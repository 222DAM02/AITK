from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Count
from django.utils import timezone
import datetime

from .models import Item, Registration
from .serializers import ItemSerializer, ItemDetailSerializer, RegistrationSerializer
from core.permissions import IsOwner, IsNotBlocked


class ItemViewSet(viewsets.ModelViewSet):
    serializer_class = ItemSerializer

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return ItemDetailSerializer
        return ItemSerializer

    def get_serializer_context(self):
        return {'request': self.request}

    def get_queryset(self):
        qs = Item.objects.all()
        if self.request.query_params.get('mine') == 'true':
            qs = qs.filter(owner=self.request.user)
        tp = self.request.query_params.get('event_type')
        if tp:
            qs = qs.filter(event_type=tp)
        st = self.request.query_params.get('status')
        if st:
            qs = qs.filter(status=st)
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

    @action(detail=True, methods=['post'], url_path='register')
    def register_event(self, request, pk=None):
        event = self.get_object()
        if Registration.objects.filter(event=event, user=request.user).exists():
            return Response({"detail": "Уже зарегистрированы."}, status=status.HTTP_400_BAD_REQUEST)
        if event.max_participants and event.registrations.count() >= event.max_participants:
            return Response({"detail": "Мест нет."}, status=status.HTTP_400_BAD_REQUEST)
        reg = Registration.objects.create(event=event, user=request.user, note=request.data.get('note', ''))
        return Response(RegistrationSerializer(reg).data, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=['delete'], url_path='unregister')
    def unregister_event(self, request, pk=None):
        event = self.get_object()
        Registration.objects.filter(event=event, user=request.user).delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

    @action(detail=False, methods=['get'], url_path='my-stats')
    def my_stats(self, request):
        my_events = Item.objects.filter(owner=request.user)
        my_regs = Registration.objects.filter(user=request.user)
        today = timezone.now().date()
        upcoming = Item.objects.filter(date__gte=today, status='upcoming').count()
        return Response({
            'my_events': my_events.count(),
            'my_registrations': my_regs.count(),
            'upcoming_events': upcoming,
            'by_type': {t: my_events.filter(event_type=t).count() for t, _ in Item.TYPE_CHOICES},
            'by_status': {s: my_events.filter(status=s).count() for s, _ in Item.STATUS_CHOICES},
        })
