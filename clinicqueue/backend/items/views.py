from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Item, Appointment
from .serializers import ItemSerializer, ItemDetailSerializer, AppointmentSerializer
from core.permissions import IsOwner, IsNotBlocked
class ItemViewSet(viewsets.ModelViewSet):
    serializer_class = ItemSerializer
    def get_serializer_class(self):
        return ItemDetailSerializer if self.action == 'retrieve' else ItemSerializer
    def get_queryset(self):
        qs = Item.objects.all()
        if self.request.query_params.get('mine')=='true': qs=qs.filter(owner=self.request.user)
        if s:=self.request.query_params.get('specialization'): qs=qs.filter(specialization=s)
        if st:=self.request.query_params.get('status'): qs=qs.filter(status=st)
        if q:=self.request.query_params.get('search'): qs=qs.filter(title__icontains=q)
        return qs
    def get_permissions(self):
        if self.action in ('update','partial_update','destroy'): return [permissions.IsAuthenticated(), IsOwner()]
        if self.action == 'create': return [permissions.IsAuthenticated(), IsNotBlocked()]
        return [permissions.IsAuthenticated()]
    def perform_create(self, ser): ser.save(owner=self.request.user)
    @action(detail=True, methods=['get','post'], url_path='appointments')
    def appointments(self, request, pk=None):
        doctor = self.get_object()
        if request.method == 'GET': return Response(AppointmentSerializer(doctor.appointments.all(), many=True).data)
        ser = AppointmentSerializer(data=request.data); ser.is_valid(raise_exception=True)
        ser.save(doctor=doctor, patient=request.user)
        return Response(ser.data, status=status.HTTP_201_CREATED)
    @action(detail=True, methods=['patch'], url_path=r'appointments/(?P<apt_id>[^/.]+)')
    def update_appointment(self, request, pk=None, apt_id=None):
        doctor = self.get_object()
        try: apt = doctor.appointments.get(id=apt_id)
        except Appointment.DoesNotExist: return Response(status=status.HTTP_404_NOT_FOUND)
        for k,v in request.data.items(): setattr(apt, k, v)
        apt.save(); return Response(AppointmentSerializer(apt).data)
    @action(detail=False, methods=['get'], url_path='my-stats')
    def my_stats(self, request):
        my_apts = Appointment.objects.filter(patient=request.user)
        return Response({'my_appointments': my_apts.count(), 'upcoming': my_apts.filter(status='booked').count(),
            'by_spec': {s: Item.objects.filter(specialization=s).count() for s,_ in Item.SPEC_CHOICES if Item.objects.filter(specialization=s).exists()}})
