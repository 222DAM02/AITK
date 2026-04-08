import datetime
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import Item, DoseLog
from .serializers import ItemSerializer, DoseLogSerializer
from core.permissions import IsOwner, IsNotBlocked


class ItemViewSet(viewsets.ModelViewSet):
    serializer_class = ItemSerializer

    def get_queryset(self):
        qs = Item.objects.prefetch_related('schedules')
        # medications are always private
        qs = qs.filter(owner=self.request.user)
        active = self.request.query_params.get('active')
        if active == 'true':
            qs = qs.filter(is_active=True)
        category = self.request.query_params.get('category')
        if category:
            qs = qs.filter(category=category)
        return qs

    def get_permissions(self):
        if self.action in ('update', 'partial_update', 'destroy'):
            return [permissions.IsAuthenticated(), IsOwner()]
        if self.action == 'create':
            return [permissions.IsAuthenticated(), IsNotBlocked()]
        return [permissions.IsAuthenticated()]

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

    @action(detail=True, methods=['post'], url_path='log-dose')
    def log_dose(self, request, pk=None):
        medication = self.get_object()
        time_of_day = request.data.get('time_of_day')
        log_status = request.data.get('status', 'taken')
        date_str = request.data.get('date', str(datetime.date.today()))

        if not time_of_day:
            return Response({'detail': 'time_of_day is required.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            date = datetime.date.fromisoformat(date_str)
        except ValueError:
            return Response({'detail': 'Invalid date format.'}, status=status.HTTP_400_BAD_REQUEST)

        log, _ = DoseLog.objects.update_or_create(
            user=request.user,
            medication=medication,
            time_of_day=time_of_day,
            date=date,
            defaults={'status': log_status},
        )
        return Response(DoseLogSerializer(log).data, status=status.HTTP_200_OK)

    @action(detail=False, methods=['get'], url_path='today')
    def today(self, request):
        today = datetime.date.today()
        medications = Item.objects.filter(owner=request.user, is_active=True).prefetch_related('schedules')
        logs_today = DoseLog.objects.filter(user=request.user, date=today)
        logs_map = {(l.medication_id, l.time_of_day): l for l in logs_today}

        result = []
        time_order = {'morning': 0, 'afternoon': 1, 'evening': 2, 'night': 3}
        for med in medications:
            for schedule in sorted(med.schedules.all(), key=lambda s: time_order.get(s.time_of_day, 99)):
                log = logs_map.get((med.id, schedule.time_of_day))
                result.append({
                    'medication_id': med.id,
                    'medication_title': med.title,
                    'dosage': med.dosage,
                    'category': med.category,
                    'time_of_day': schedule.time_of_day,
                    'date': str(today),
                    'status': log.status if log else None,
                    'log_id': log.id if log else None,
                })
        return Response(result)

    @action(detail=False, methods=['get'], url_path='my-stats')
    def my_stats(self, request):
        total_meds = Item.objects.filter(owner=request.user).count()
        active_meds = Item.objects.filter(owner=request.user, is_active=True).count()
        total_logs = DoseLog.objects.filter(user=request.user).count()
        taken_logs = DoseLog.objects.filter(user=request.user, status='taken').count()
        adherence = round(taken_logs / total_logs * 100) if total_logs > 0 else 0
        return Response({
            'total_medications': total_meds,
            'active_medications': active_meds,
            'total_doses_logged': total_logs,
            'doses_taken': taken_logs,
            'adherence_percent': adherence,
        })
