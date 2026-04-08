from rest_framework import status
from rest_framework.views import APIView
from rest_framework.generics import ListAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import AIQuery, KnowledgeBase
from .serializers import AIQuerySerializer, AIGenerateSerializer, AISaveAsItemSerializer, KnowledgeBaseSerializer
from .services import generate_ai_response, fetch_inventory_data
from items.models import Item

class AIGenerateView(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request):
        ser = AIGenerateSerializer(data=request.data); ser.is_valid(raise_exception=True)
        try: result = generate_ai_response(ser.validated_data['prompt'])
        except Exception as e: return Response({"detail": str(e)}, status=status.HTTP_502_BAD_GATEWAY)
        q = AIQuery.objects.create(user=request.user, prompt=ser.validated_data['prompt'], result=result["text"], sources=result["sources"])
        return Response(AIQuerySerializer(q).data, status=status.HTTP_201_CREATED)

class AIHistoryView(ListAPIView):
    serializer_class = AIQuerySerializer; permission_classes = [IsAuthenticated]
    def get_queryset(self): return AIQuery.objects.filter(user=self.request.user)[:20]

class AISaveAsItemView(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request):
        ser = AISaveAsItemSerializer(data=request.data); ser.is_valid(raise_exception=True)
        try: q = AIQuery.objects.get(id=ser.validated_data['query_id'], user=request.user)
        except AIQuery.DoesNotExist: return Response(status=status.HTTP_404_NOT_FOUND)
        Item.objects.create(owner=request.user, title=ser.validated_data['title'], description=q.result)
        return Response({"detail": "Сохранено."}, status=status.HTTP_201_CREATED)

class FetchDataView(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request):
        try: count = fetch_inventory_data()
        except Exception as e: return Response({"detail": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        return Response({"fetched": count, "total": KnowledgeBase.objects.count()})

class KnowledgeBaseListView(ListAPIView):
    serializer_class = KnowledgeBaseSerializer; permission_classes = [IsAuthenticated]
    pagination_class = None
    def get_queryset(self):
        qs = KnowledgeBase.objects.all()
        if c := self.request.query_params.get('category'): qs = qs.filter(category=c)
        if s := self.request.query_params.get('search'): qs = qs.filter(title__icontains=s)
        return qs[:50]

class KnowledgeBaseStatsView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        return Response({"total": KnowledgeBase.objects.count(),
            "with_embeddings": KnowledgeBase.objects.exclude(embedding__isnull=True).count(),
            "categories": list(KnowledgeBase.objects.values_list('category', flat=True).distinct())})
