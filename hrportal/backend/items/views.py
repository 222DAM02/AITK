from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Item, LeaveRequest
from .serializers import ItemSerializer, ItemDetailSerializer, LeaveRequestSerializer
from core.permissions import IsOwner, IsNotBlocked
class ItemViewSet(viewsets.ModelViewSet):
    serializer_class = ItemSerializer
    def get_serializer_class(self):
        return ItemDetailSerializer if self.action == 'retrieve' else ItemSerializer
    def get_queryset(self):
        qs = Item.objects.all()
        if self.request.query_params.get('mine')=='true': qs=qs.filter(owner=self.request.user)
        if d:=self.request.query_params.get('department'): qs=qs.filter(department=d)
        if s:=self.request.query_params.get('status'): qs=qs.filter(status=s)
        if q:=self.request.query_params.get('search'): qs=qs.filter(title__icontains=q)
        return qs
    def get_permissions(self):
        if self.action in ('update','partial_update','destroy'): return [permissions.IsAuthenticated(), IsOwner()]
        if self.action == 'create': return [permissions.IsAuthenticated(), IsNotBlocked()]
        return [permissions.IsAuthenticated()]
    def perform_create(self, ser): ser.save(owner=self.request.user)
    @action(detail=True, methods=['get','post'], url_path='leaves')
    def leaves(self, request, pk=None):
        emp = self.get_object()
        if request.method == 'GET': return Response(LeaveRequestSerializer(emp.leave_requests.all(), many=True).data)
        ser = LeaveRequestSerializer(data=request.data); ser.is_valid(raise_exception=True)
        ser.save(employee=emp, user=request.user)
        return Response(ser.data, status=status.HTTP_201_CREATED)
    @action(detail=True, methods=['patch'], url_path=r'leaves/(?P<leave_id>[^/.]+)')
    def update_leave(self, request, pk=None, leave_id=None):
        emp = self.get_object()
        try: leave = emp.leave_requests.get(id=leave_id)
        except LeaveRequest.DoesNotExist: return Response(status=status.HTTP_404_NOT_FOUND)
        for k,v in request.data.items(): setattr(leave, k, v)
        leave.save(); return Response(LeaveRequestSerializer(leave).data)
    @action(detail=False, methods=['get'], url_path='my-stats')
    def my_stats(self, request):
        items = Item.objects.filter(owner=request.user)
        return Response({'total': items.count(), 'by_dept': {d: items.filter(department=d).count() for d,_ in Item.DEPT_CHOICES if items.filter(department=d).exists()},
            'by_status': {s: items.filter(status=s).count() for s,_ in Item.STATUS_CHOICES if items.filter(status=s).exists()},
            'pending_leaves': LeaveRequest.objects.filter(employee__owner=request.user, status='pending').count()})
