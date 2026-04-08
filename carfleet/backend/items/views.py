from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Sum, Avg

from .models import Item, FuelLog
from .serializers import ItemSerializer, ItemDetailSerializer, FuelLogSerializer
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
        st = self.request.query_params.get('status')
        if st:
            qs = qs.filter(status=st)
        fuel = self.request.query_params.get('fuel_type')
        if fuel:
            qs = qs.filter(fuel_type=fuel)
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

    @action(detail=True, methods=['get', 'post'], url_path='fuel')
    def fuel_logs(self, request, pk=None):
        vehicle = self.get_object()
        if request.method == 'GET':
            return Response(FuelLogSerializer(vehicle.fuel_logs.all(), many=True).data)
        ser = FuelLogSerializer(data=request.data)
        ser.is_valid(raise_exception=True)
        ser.save(vehicle=vehicle, user=request.user)
        vehicle.mileage = max(vehicle.mileage, ser.validated_data.get('mileage_at', 0))
        vehicle.save(update_fields=['mileage'])
        return Response(ser.data, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=['delete'], url_path=r'fuel/(?P<log_id>[^/.]+)')
    def delete_fuel_log(self, request, pk=None, log_id=None):
        vehicle = self.get_object()
        vehicle.fuel_logs.filter(id=log_id).delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

    @action(detail=False, methods=['get'], url_path='my-stats')
    def my_stats(self, request):
        vehicles = Item.objects.filter(owner=request.user)
        logs = FuelLog.objects.filter(vehicle__owner=request.user)
        return Response({
            'total_vehicles': vehicles.count(),
            'active_vehicles': vehicles.filter(status='active').count(),
            'total_fuel_cost': float(logs.aggregate(s=Sum('cost'))['s'] or 0),
            'total_liters': float(logs.aggregate(s=Sum('liters'))['s'] or 0),
            'avg_cost_per_liter': float(logs.aggregate(a=Avg('cost'))['a'] or 0),
            'by_fuel': {f: vehicles.filter(fuel_type=f).count() for f, _ in Item.FUEL_CHOICES},
            'by_status': {s: vehicles.filter(status=s).count() for s, _ in Item.STATUS_CHOICES},
        })
