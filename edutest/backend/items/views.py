from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Avg

from .models import Item, Question, TestResult
from .serializers import ItemSerializer, ItemDetailSerializer, QuestionSerializer, QuestionPublicSerializer, TestResultSerializer
from core.permissions import IsOwner, IsNotBlocked


class ItemViewSet(viewsets.ModelViewSet):
    serializer_class = ItemSerializer

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return ItemDetailSerializer
        return ItemSerializer

    def get_queryset(self):
        qs = Item.objects.all()
        if self.request.query_params.get('mine') == 'true':
            qs = qs.filter(owner=self.request.user)
        if self.request.query_params.get('published') == 'true':
            qs = qs.filter(is_published=True)
        cat = self.request.query_params.get('category')
        if cat:
            qs = qs.filter(category=cat)
        diff = self.request.query_params.get('difficulty')
        if diff:
            qs = qs.filter(difficulty=diff)
        search = self.request.query_params.get('search')
        if search:
            qs = qs.filter(title__icontains=search)
        return qs

    def get_permissions(self):
        if self.action in ('update', 'partial_update', 'destroy'):
            return [permissions.IsAuthenticated(), IsOwner()]
        if self.action == 'create':
            return [permissions.IsAuthenticated(), IsNotBlocked()]
        return [permissions.IsAuthenticated()]

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

    @action(detail=True, methods=['get', 'post'], url_path='questions')
    def questions(self, request, pk=None):
        test = self.get_object()
        if request.method == 'GET':
            if test.owner == request.user:
                return Response(QuestionSerializer(test.questions.all(), many=True).data)
            return Response(QuestionPublicSerializer(test.questions.all(), many=True).data)
        ser = QuestionSerializer(data=request.data)
        ser.is_valid(raise_exception=True)
        ser.save(test=test)
        return Response(ser.data, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=['delete'], url_path=r'questions/(?P<q_id>[^/.]+)')
    def delete_question(self, request, pk=None, q_id=None):
        test = self.get_object()
        test.questions.filter(id=q_id).delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

    @action(detail=True, methods=['post'], url_path='submit')
    def submit_test(self, request, pk=None):
        test = self.get_object()
        answers = request.data.get('answers', {})
        time_spent = request.data.get('time_spent', 0)
        questions = test.questions.all()
        score = 0
        total = questions.count()
        for q in questions:
            if answers.get(str(q.id)) == q.correct:
                score += 1
        result = TestResult.objects.create(
            test=test, user=request.user, score=score, total=total,
            answers=answers, time_spent=time_spent,
        )
        return Response(TestResultSerializer(result).data, status=status.HTTP_201_CREATED)

    @action(detail=False, methods=['get'], url_path='my-stats')
    def my_stats(self, request):
        my_tests = Item.objects.filter(owner=request.user)
        my_results = TestResult.objects.filter(user=request.user)
        avg = my_results.aggregate(a=Avg('score'))['a']
        return Response({
            'tests_created': my_tests.count(),
            'tests_taken': my_results.count(),
            'avg_score': round(avg, 1) if avg else 0,
            'by_category': {c: my_tests.filter(category=c).count() for c, _ in Item.CATEGORY_CHOICES if my_tests.filter(category=c).exists()},
        })
