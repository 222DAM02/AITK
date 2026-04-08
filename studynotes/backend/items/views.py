from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import Item
from .serializers import ItemSerializer
from core.permissions import IsOwner, IsNotBlocked


class ItemViewSet(viewsets.ModelViewSet):
    serializer_class = ItemSerializer

    def get_queryset(self):
        qs = Item.objects.all()
        if self.request.query_params.get('mine') == 'true':
            qs = qs.filter(owner=self.request.user)
        subject = self.request.query_params.get('subject')
        if subject:
            qs = qs.filter(subject=subject)
        tag = self.request.query_params.get('tag')
        if tag:
            qs = qs.filter(tags__icontains=tag)
        search = self.request.query_params.get('search')
        if search:
            qs = qs.filter(title__icontains=search)
        pinned = self.request.query_params.get('pinned')
        if pinned == 'true':
            qs = qs.filter(is_pinned=True)
        return qs

    def get_permissions(self):
        if self.action in ('update', 'partial_update', 'destroy'):
            return [permissions.IsAuthenticated(), IsOwner()]
        if self.action == 'create':
            return [permissions.IsAuthenticated(), IsNotBlocked()]
        return [permissions.IsAuthenticated()]

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

    @action(detail=True, methods=['patch'], url_path='toggle-pin')
    def toggle_pin(self, request, pk=None):
        item = self.get_object()
        if item.owner != request.user:
            return Response({'detail': 'Only the owner can pin.'}, status=status.HTTP_403_FORBIDDEN)
        item.is_pinned = not item.is_pinned
        item.save(update_fields=['is_pinned'])
        return Response(ItemSerializer(item).data)

    @action(detail=False, methods=['get'], url_path='all-tags')
    def all_tags(self, request):
        items = Item.objects.filter(owner=request.user).exclude(tags='')
        tags_set = set()
        for item in items:
            for tag in item.tags_list:
                tags_set.add(tag)
        return Response(sorted(tags_set))

    @action(detail=False, methods=['get'], url_path='my-stats')
    def my_stats(self, request):
        items = Item.objects.filter(owner=request.user)
        total = items.count()
        pinned = items.filter(is_pinned=True).count()
        subjects = {}
        for item in items:
            subjects[item.subject] = subjects.get(item.subject, 0) + 1
        return Response({
            'total': total,
            'pinned': pinned,
            'by_subject': subjects,
        })
