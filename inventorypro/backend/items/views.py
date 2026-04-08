from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Sum, F
from .models import Item, StockMovement
from .serializers import ItemSerializer, ItemDetailSerializer, StockMovementSerializer
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
    @action(detail=True, methods=['get','post'], url_path='movements')
    def movements(self, request, pk=None):
        product = self.get_object()
        if request.method == 'GET': return Response(StockMovementSerializer(product.movements.all(), many=True).data)
        ser = StockMovementSerializer(data=request.data); ser.is_valid(raise_exception=True)
        mov = ser.save(product=product, user=request.user)
        if mov.movement_type == 'in': product.quantity += mov.quantity
        elif mov.movement_type == 'out': product.quantity = max(0, product.quantity - abs(mov.quantity))
        else: product.quantity = max(0, product.quantity + mov.quantity)
        product.save(update_fields=['quantity'])
        return Response(ser.data, status=status.HTTP_201_CREATED)
    @action(detail=False, methods=['get'], url_path='my-stats')
    def my_stats(self, request):
        items = Item.objects.filter(owner=request.user)
        total_value = sum(float(i.quantity * (i.price or 0)) for i in items)
        return Response({'total_products': items.count(), 'total_quantity': items.aggregate(s=Sum('quantity'))['s'] or 0,
            'total_value': total_value, 'low_stock': items.filter(quantity__lte=F('min_stock')).count(),
            'by_category': {c: items.filter(category=c).count() for c,_ in Item.CAT_CHOICES if items.filter(category=c).exists()}})
