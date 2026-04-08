import random

from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Count

from .models import Item, Word, QuizResult
from .serializers import ItemSerializer, ItemDetailSerializer, WordSerializer, QuizResultSerializer
from core.permissions import IsOwner, IsNotBlocked


class ItemViewSet(viewsets.ModelViewSet):
    serializer_class = ItemSerializer

    def get_queryset(self):
        qs = Item.objects.annotate(words_count=Count('words'))
        language = self.request.query_params.get('language')
        if language:
            qs = qs.filter(language=language)
        category = self.request.query_params.get('category')
        if category:
            qs = qs.filter(category=category)
        if self.request.query_params.get('mine') == 'true':
            qs = qs.filter(owner=self.request.user)
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
    def words(self, request, pk=None):
        deck = self.get_object()
        if request.method == 'GET':
            words = deck.words.all()
            serializer = WordSerializer(words, many=True)
            return Response(serializer.data)
        # POST — only owner can add words
        if deck.owner != request.user:
            return Response({'detail': 'Only the owner can add words.'}, status=status.HTTP_403_FORBIDDEN)
        serializer = WordSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(deck=deck)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=['delete'], url_path='words/(?P<word_id>[^/.]+)')
    def delete_word(self, request, pk=None, word_id=None):
        deck = self.get_object()
        if deck.owner != request.user:
            return Response({'detail': 'Only the owner can delete words.'}, status=status.HTTP_403_FORBIDDEN)
        try:
            word = deck.words.get(id=word_id)
        except Word.DoesNotExist:
            return Response({'detail': 'Word not found.'}, status=status.HTTP_404_NOT_FOUND)
        word.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

    @action(detail=True, methods=['patch'], url_path='words/(?P<word_id>[^/.]+)/mastery')
    def update_mastery(self, request, pk=None, word_id=None):
        deck = self.get_object()
        try:
            word = deck.words.get(id=word_id)
        except Word.DoesNotExist:
            return Response({'detail': 'Word not found.'}, status=status.HTTP_404_NOT_FOUND)
        mastery = request.data.get('mastery')
        if mastery not in dict(Word.MASTERY_CHOICES):
            return Response({'detail': 'Invalid mastery level.'}, status=status.HTTP_400_BAD_REQUEST)
        word.mastery = mastery
        word.save(update_fields=['mastery'])
        serializer = WordSerializer(word)
        return Response(serializer.data)

    @action(detail=True, methods=['get'])
    def quiz(self, request, pk=None):
        deck = self.get_object()
        words = list(deck.words.all())
        if not words:
            return Response({'detail': 'No words in this deck.'}, status=status.HTTP_400_BAD_REQUEST)
        quiz_words = random.sample(words, min(10, len(words)))
        all_translations = [w.translation for w in words]
        questions = []
        for w in quiz_words:
            wrong_translations = [t for t in all_translations if t != w.translation]
            if len(wrong_translations) >= 3:
                wrong = random.sample(wrong_translations, 3)
            else:
                wrong = wrong_translations[:]
                while len(wrong) < 3:
                    wrong.append('—')
            options = wrong + [w.translation]
            random.shuffle(options)
            correct_index = options.index(w.translation)
            questions.append({
                'id': w.id,
                'word': w.word,
                'options': options,
                'correct_index': correct_index,
            })
        return Response(questions)

    @action(detail=True, methods=['post'], url_path='finish-quiz')
    def finish_quiz(self, request, pk=None):
        deck = self.get_object()
        total_questions = request.data.get('total_questions', 0)
        correct_answers = request.data.get('correct_answers', 0)
        result = QuizResult.objects.create(
            user=request.user,
            deck=deck,
            total_questions=total_questions,
            correct_answers=correct_answers,
        )
        serializer = QuizResultSerializer(result)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @action(detail=False, methods=['get'], url_path='my-stats')
    def my_stats(self, request):
        results = QuizResult.objects.filter(user=request.user).order_by('-created_at')
        serializer = QuizResultSerializer(results, many=True)
        return Response(serializer.data)
