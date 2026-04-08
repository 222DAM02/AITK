from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Avg
from .models import Item
from .serializers import ItemSerializer
from core.permissions import IsOwner, IsNotBlocked
class ItemViewSet(viewsets.ModelViewSet):
    serializer_class = ItemSerializer
    def get_queryset(self):
        qs = Item.objects.all()
        if self.request.query_params.get('mine')=='true': qs=qs.filter(owner=self.request.user)
        if t:=self.request.query_params.get('property_type'): qs=qs.filter(property_type=t)
        if d:=self.request.query_params.get('deal_type'): qs=qs.filter(deal_type=d)
        if s:=self.request.query_params.get('status'): qs=qs.filter(status=s)
        if q:=self.request.query_params.get('search'): qs=qs.filter(title__icontains=q)
        if mn:=self.request.query_params.get('price_min'):
            try: qs=qs.filter(price__gte=float(mn))
            except: pass
        if mx:=self.request.query_params.get('price_max'):
            try: qs=qs.filter(price__lte=float(mx))
            except: pass
        return qs
    def get_permissions(self):
        if self.action in ('update','partial_update','destroy'): return [permissions.IsAuthenticated(), IsOwner()]
        if self.action == 'create': return [permissions.IsAuthenticated(), IsNotBlocked()]
        return [permissions.IsAuthenticated()]
    def perform_create(self, ser): ser.save(owner=self.request.user)
    @action(detail=False, methods=['get'], url_path='my-stats')
    def my_stats(self, request):
        items = Item.objects.filter(owner=request.user)
        avg_price = items.aggregate(a=Avg('price'))['a']
        return Response({'total': items.count(), 'avg_price': float(avg_price or 0),
            'by_type': {t: items.filter(property_type=t).count() for t,_ in Item.TYPE_CHOICES if items.filter(property_type=t).exists()},
            'by_deal': {d: items.filter(deal_type=d).count() for d,_ in Item.DEAL_CHOICES}})
