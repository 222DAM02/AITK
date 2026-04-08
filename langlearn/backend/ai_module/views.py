from rest_framework import status
from rest_framework.views import APIView
from rest_framework.generics import ListAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .models import AIQuery, KnowledgeBase
from .serializers import AIQuerySerializer, AIGenerateSerializer, AISaveAsItemSerializer, KnowledgeBaseSerializer
from .services import generate_ai_response, fetch_dictionary_data
from items.models import Item


class AIGenerateView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = AIGenerateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        prompt = serializer.validated_data['prompt']
        try:
            result = generate_ai_response(prompt)
        except Exception as e:
            return Response(
                {"detail": f"Ошибка AI сервиса: {str(e)}"},
                status=status.HTTP_502_BAD_GATEWAY,
            )

        query = AIQuery.objects.create(
            user=request.user,
            prompt=prompt,
            result=result["text"],
            sources=result["sources"],
        )
        return Response(AIQuerySerializer(query).data, status=status.HTTP_201_CREATED)


class AIHistoryView(ListAPIView):
    serializer_class = AIQuerySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return AIQuery.objects.filter(user=self.request.user)[:20]


class AISaveAsItemView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = AISaveAsItemSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        try:
            query = AIQuery.objects.get(
                id=serializer.validated_data['query_id'],
                user=request.user,
            )
        except AIQuery.DoesNotExist:
            return Response({"detail": "Запрос не найден."}, status=status.HTTP_404_NOT_FOUND)

        item = Item.objects.create(
            owner=request.user,
            title=serializer.validated_data['title'],
            description=query.result,
        )
        return Response({"detail": "Сохранено.", "item_id": item.id}, status=status.HTTP_201_CREATED)


class FetchDataView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        words = request.data.get('words', None)
        try:
            count = fetch_dictionary_data(words)
        except Exception as e:
            return Response({"detail": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        total = KnowledgeBase.objects.count()
        return Response({"fetched": count, "total": total})


class KnowledgeBaseListView(ListAPIView):
    serializer_class = KnowledgeBaseSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = None

    def get_queryset(self):
        qs = KnowledgeBase.objects.all()
        category = self.request.query_params.get('category')
        if category:
            qs = qs.filter(category=category)
        search = self.request.query_params.get('search')
        if search:
            qs = qs.filter(title__icontains=search)
        return qs[:50]


class KnowledgeBaseStatsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        total = KnowledgeBase.objects.count()
        with_embeddings = KnowledgeBase.objects.exclude(embedding__isnull=True).count()
        categories = list(
            KnowledgeBase.objects.values_list('category', flat=True).distinct()
        )
        return Response({
            "total": total,
            "with_embeddings": with_embeddings,
            "categories": categories,
        })
