from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Item, Proposal
from .serializers import ItemSerializer, ItemDetailSerializer, ProposalSerializer
from core.permissions import IsOwner, IsNotBlocked
class ItemViewSet(viewsets.ModelViewSet):
    serializer_class = ItemSerializer
    def get_serializer_class(self):
        return ItemDetailSerializer if self.action == 'retrieve' else ItemSerializer
    def get_queryset(self):
        qs = Item.objects.all()
        if self.request.query_params.get('mine')=='true': qs=qs.filter(owner=self.request.user)
        if c:=self.request.query_params.get('category'): qs=qs.filter(category=c)
        if s:=self.request.query_params.get('status'): qs=qs.filter(status=s)
        if q:=self.request.query_params.get('search'): qs=qs.filter(title__icontains=q)
        return qs
    def get_permissions(self):
        if self.action in ('update','partial_update','destroy'): return [permissions.IsAuthenticated(), IsOwner()]
        if self.action == 'create': return [permissions.IsAuthenticated(), IsNotBlocked()]
        return [permissions.IsAuthenticated()]
    def perform_create(self, ser): ser.save(owner=self.request.user)
    @action(detail=True, methods=['get','post'], url_path='proposals')
    def proposals(self, request, pk=None):
        order = self.get_object()
        if request.method == 'GET': return Response(ProposalSerializer(order.proposals.all(), many=True).data)
        ser = ProposalSerializer(data=request.data); ser.is_valid(raise_exception=True)
        ser.save(order=order, freelancer=request.user)
        return Response(ser.data, status=status.HTTP_201_CREATED)
    @action(detail=True, methods=['patch'], url_path=r'proposals/(?P<prop_id>[^/.]+)')
    def update_proposal(self, request, pk=None, prop_id=None):
        order = self.get_object()
        try: prop = order.proposals.get(id=prop_id)
        except Proposal.DoesNotExist: return Response(status=status.HTTP_404_NOT_FOUND)
        for k,v in request.data.items(): setattr(prop, k, v)
        prop.save(); return Response(ProposalSerializer(prop).data)
    @action(detail=False, methods=['get'], url_path='my-stats')
    def my_stats(self, request):
        orders = Item.objects.filter(owner=request.user)
        my_proposals = Proposal.objects.filter(freelancer=request.user)
        return Response({'my_orders': orders.count(), 'open_orders': orders.filter(status='open').count(),
            'my_proposals': my_proposals.count(), 'accepted': my_proposals.filter(status='accepted').count(),
            'by_category': {c: orders.filter(category=c).count() for c,_ in Item.CAT_CHOICES if orders.filter(category=c).exists()}})
