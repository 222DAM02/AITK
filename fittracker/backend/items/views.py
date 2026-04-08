import datetime
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Count, Sum

from .models import Item, Exercise
from .serializers import ItemSerializer, ItemDetailSerializer, ExerciseSerializer
from core.permissions import IsOwner, IsNotBlocked


class ItemViewSet(viewsets.ModelViewSet):
    serializer_class = ItemSerializer

    def get_queryset(self):
        qs = Item.objects.annotate(exercises_count=Count('exercises'))
        if self.request.query_params.get('mine') == 'true':
            qs = qs.filter(owner=self.request.user)
        workout_type = self.request.query_params.get('type')
        if workout_type:
            qs = qs.filter(workout_type=workout_type)
        return qs

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return ItemDetailSerializer
        return ItemSerializer

    def get_permissions(self):
        if self.action in ('update', 'partial_update', 'destroy'):
            return [permissions.IsAuthenticated(), IsOwner()]
        if self.action == 'create':
            return [permissions.IsAuthenticated(), IsNotBlocked()]
        return [permissions.IsAuthenticated()]

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

    @action(detail=True, methods=['get', 'post'])
    def exercises(self, request, pk=None):
        workout = self.get_object()
        if request.method == 'GET':
            exercises = workout.exercises.all()
            return Response(ExerciseSerializer(exercises, many=True).data)
        if workout.owner != request.user:
            return Response({'detail': 'Only owner can add exercises.'}, status=status.HTTP_403_FORBIDDEN)
        serializer = ExerciseSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(workout=workout)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=['delete'], url_path='exercises/(?P<exercise_id>[^/.]+)')
    def delete_exercise(self, request, pk=None, exercise_id=None):
        workout = self.get_object()
        if workout.owner != request.user:
            return Response({'detail': 'Only owner can delete exercises.'}, status=status.HTTP_403_FORBIDDEN)
        try:
            exercise = workout.exercises.get(id=exercise_id)
        except Exercise.DoesNotExist:
            return Response({'detail': 'Exercise not found.'}, status=status.HTTP_404_NOT_FOUND)
        exercise.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

    @action(detail=False, methods=['get'], url_path='my-stats')
    def my_stats(self, request):
        workouts = Item.objects.filter(owner=request.user)
        total = workouts.count()
        total_duration = workouts.aggregate(s=Sum('duration_minutes'))['s'] or 0
        total_calories = workouts.aggregate(s=Sum('calories_burned'))['s'] or 0
        total_exercises = Exercise.objects.filter(workout__owner=request.user).count()

        # Streak calculation
        dates = list(workouts.values_list('created_at__date', flat=True).distinct().order_by('-created_at__date'))
        streak = 0
        today = datetime.date.today()
        for i, d in enumerate(dates):
            expected = today - datetime.timedelta(days=i)
            if d == expected:
                streak += 1
            else:
                break

        by_type = {}
        for w in workouts:
            by_type[w.workout_type] = by_type.get(w.workout_type, 0) + 1

        return Response({
            'total_workouts': total,
            'total_duration': total_duration,
            'total_calories': total_calories,
            'total_exercises': total_exercises,
            'streak': streak,
            'by_type': by_type,
        })
