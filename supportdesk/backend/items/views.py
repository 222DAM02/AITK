from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Item, TicketComment
from .serializers import ItemSerializer, ItemDetailSerializer, TicketCommentSerializer
from core.permissions import IsOwner, IsNotBlocked
class ItemViewSet(viewsets.ModelViewSet):
    serializer_class = ItemSerializer
    def get_serializer_class(self):
        return ItemDetailSerializer if self.action == 'retrieve' else ItemSerializer
    def get_queryset(self):
        qs = Item.objects.all()
        if self.request.query_params.get('mine')=='true': qs=qs.filter(owner=self.request.user)
        if p:=self.request.query_params.get('priority'): qs=qs.filter(priority=p)
        if s:=self.request.query_params.get('status'): qs=qs.filter(status=s)
        if c:=self.request.query_params.get('category'): qs=qs.filter(category=c)
        if q:=self.request.query_params.get('search'): qs=qs.filter(title__icontains=q)
        return qs
    def get_permissions(self):
        if self.action in ('update','partial_update','destroy'): return [permissions.IsAuthenticated(), IsOwner()]
        if self.action == 'create': return [permissions.IsAuthenticated(), IsNotBlocked()]
        return [permissions.IsAuthenticated()]
    def perform_create(self, ser): ser.save(owner=self.request.user)
    @action(detail=True, methods=['get','post'], url_path='comments')
    def comments(self, request, pk=None):
        ticket = self.get_object()
        if request.method == 'GET': return Response(TicketCommentSerializer(ticket.comments.all(), many=True).data)
        ser = TicketCommentSerializer(data=request.data); ser.is_valid(raise_exception=True)
        ser.save(ticket=ticket, author=request.user)
        return Response(ser.data, status=status.HTTP_201_CREATED)
    @action(detail=True, methods=['delete'], url_path=r'comments/(?P<comment_id>[^/.]+)')
    def delete_comment(self, request, pk=None, comment_id=None):
        ticket = self.get_object()
        ticket.comments.filter(id=comment_id, author=request.user).delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    @action(detail=False, methods=['get'], url_path='my-stats')
    def my_stats(self, request):
        items = Item.objects.filter(owner=request.user)
        return Response({'total': items.count(),
            'by_priority': {p: items.filter(priority=p).count() for p,_ in Item.PRIORITY_CHOICES if items.filter(priority=p).exists()},
            'by_status': {s: items.filter(status=s).count() for s,_ in Item.STATUS_CHOICES if items.filter(status=s).exists()},
            'overdue': sum(1 for i in items if i.is_overdue)})
