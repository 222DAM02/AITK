from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
import datetime

from .models import Item, Comment
from .serializers import ItemSerializer, ItemDetailSerializer, CommentSerializer
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
        status_filter = self.request.query_params.get('status')
        if status_filter:
            qs = qs.filter(status=status_filter)
        priority = self.request.query_params.get('priority')
        if priority:
            qs = qs.filter(priority=priority)
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

    @action(detail=True, methods=['patch'], url_path='move')
    def move(self, request, pk=None):
        item = self.get_object()
        if item.owner != request.user:
            return Response({'detail': 'Only owner can move.'}, status=status.HTTP_403_FORBIDDEN)
        new_status = request.data.get('status')
        if new_status not in dict(Item.STATUS_CHOICES):
            return Response({'detail': 'Invalid status.'}, status=status.HTTP_400_BAD_REQUEST)
        item.status = new_status
        item.save(update_fields=['status'])
        return Response(ItemSerializer(item).data)

    @action(detail=True, methods=['get', 'post'], url_path='comments')
    def comments(self, request, pk=None):
        item = self.get_object()
        if request.method == 'GET':
            return Response(CommentSerializer(item.comments.all(), many=True).data)
        serializer = CommentSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(task=item, author=request.user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=['delete'], url_path=r'comments/(?P<comment_id>[^/.]+)')
    def delete_comment(self, request, pk=None, comment_id=None):
        item = self.get_object()
        try:
            comment = item.comments.get(id=comment_id)
        except Comment.DoesNotExist:
            return Response({'detail': 'Not found.'}, status=status.HTTP_404_NOT_FOUND)
        if comment.author != request.user:
            return Response({'detail': 'Only the author can delete.'}, status=status.HTTP_403_FORBIDDEN)
        comment.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

    @action(detail=False, methods=['get'], url_path='my-stats')
    def my_stats(self, request):
        items = Item.objects.filter(owner=request.user)
        today = datetime.date.today()
        by_status = {}
        for s, _ in Item.STATUS_CHOICES:
            by_status[s] = items.filter(status=s).count()
        by_priority = {}
        for p, _ in Item.PRIORITY_CHOICES:
            by_priority[p] = items.filter(priority=p).count()
        overdue = items.exclude(status='done').filter(due_date__lt=today).count()
        due_today = items.exclude(status='done').filter(due_date=today).count()
        return Response({
            'total': items.count(),
            'by_status': by_status,
            'by_priority': by_priority,
            'overdue': overdue,
            'due_today': due_today,
        })
