from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Item, Enrollment
from .serializers import ItemSerializer, EnrollmentSerializer
from core.permissions import IsOwner, IsNotBlocked


class ItemViewSet(viewsets.ModelViewSet):
    serializer_class = ItemSerializer

    def get_queryset(self):
        qs = Item.objects.all()
        if self.request.query_params.get('mine'):
            qs = qs.filter(owner=self.request.user)
        category = self.request.query_params.get('category')
        if category:
            qs = qs.filter(category__icontains=category)
        level = self.request.query_params.get('level')
        if level:
            qs = qs.filter(level=level)
        return qs

    def get_permissions(self):
        if self.action in ('update', 'partial_update', 'destroy'):
            return [permissions.IsAuthenticated(), IsOwner()]
        if self.action == 'create':
            return [permissions.IsAuthenticated(), IsNotBlocked()]
        return [permissions.IsAuthenticated()]

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated()])
    def enroll(self, request, pk=None):
        course = self.get_object()
        enrollment, created = Enrollment.objects.get_or_create(
            user=request.user, course=course
        )
        if not created:
            return Response({'detail': 'Вы уже записаны на этот курс.'}, status=status.HTTP_400_BAD_REQUEST)
        return Response(EnrollmentSerializer(enrollment).data, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=['patch'], permission_classes=[permissions.IsAuthenticated()])
    def progress(self, request, pk=None):
        course = self.get_object()
        try:
            enrollment = Enrollment.objects.get(user=request.user, course=course)
        except Enrollment.DoesNotExist:
            return Response({'detail': 'Вы не записаны на этот курс.'}, status=status.HTTP_400_BAD_REQUEST)
        new_progress = request.data.get('progress', 0)
        enrollment.progress = min(100, max(0, int(new_progress)))
        enrollment.save()
        return Response(EnrollmentSerializer(enrollment).data)


class MyEnrollmentsView(viewsets.GenericViewSet):
    serializer_class = EnrollmentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Enrollment.objects.filter(user=self.request.user)

    def list(self, request):
        qs = self.get_queryset()
        serializer = self.get_serializer(qs, many=True)
        return Response(serializer.data)
