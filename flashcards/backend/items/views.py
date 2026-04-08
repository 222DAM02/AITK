from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Item, Card, StudySession
from .serializers import ItemSerializer, ItemDetailSerializer, CardSerializer, StudySessionSerializer
from core.permissions import IsOwner, IsNotBlocked


class ItemViewSet(viewsets.ModelViewSet):
    serializer_class = ItemSerializer

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return ItemDetailSerializer
        return ItemSerializer

    def get_queryset(self):
        qs = Item.objects.all()
        if self.request.query_params.get('mine'):
            qs = qs.filter(owner=self.request.user)
        category = self.request.query_params.get('category')
        if category:
            qs = qs.filter(category=category)
        return qs

    def get_permissions(self):
        if self.action in ('update', 'partial_update', 'destroy'):
            return [permissions.IsAuthenticated(), IsOwner()]
        if self.action == 'create':
            return [permissions.IsAuthenticated(), IsNotBlocked()]
        return [permissions.IsAuthenticated()]

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

    @action(detail=True, methods=['get', 'post'], permission_classes=[permissions.IsAuthenticated()])
    def cards(self, request, pk=None):
        deck = self.get_object()
        if request.method == 'GET':
            cards = deck.cards.all()
            return Response(CardSerializer(cards, many=True).data)
        # POST — добавить карточку
        serializer = CardSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(deck=deck)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=['delete'], url_path='cards/(?P<card_id>[0-9]+)',
            permission_classes=[permissions.IsAuthenticated()])
    def delete_card(self, request, pk=None, card_id=None):
        deck = self.get_object()
        try:
            card = deck.cards.get(pk=card_id)
        except Card.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        card.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated()])
    def finish_study(self, request, pk=None):
        deck = self.get_object()
        session = StudySession.objects.create(
            user=request.user,
            deck=deck,
            cards_total=request.data.get('cards_total', 0),
            cards_correct=request.data.get('cards_correct', 0),
        )
        return Response(StudySessionSerializer(session).data, status=status.HTTP_201_CREATED)

    @action(detail=False, methods=['get'], url_path='my-stats',
            permission_classes=[permissions.IsAuthenticated()])
    def my_stats(self, request):
        sessions = StudySession.objects.filter(user=request.user)[:20]
        return Response(StudySessionSerializer(sessions, many=True).data)
