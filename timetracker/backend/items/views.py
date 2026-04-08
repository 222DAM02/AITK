from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils import timezone
from django.db.models import Sum, F
import datetime

from .models import Item, TimeEntry
from .serializers import ItemSerializer, ItemDetailSerializer, TimeEntrySerializer
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
        s = self.request.query_params.get('status')
        if s:
            qs = qs.filter(status=s)
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

    @action(detail=True, methods=['get', 'post'], url_path='entries')
    def entries(self, request, pk=None):
        item = self.get_object()
        if request.method == 'GET':
            entries = item.entries.all()
            return Response(TimeEntrySerializer(entries, many=True).data)
        serializer = TimeEntrySerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(project=item, user=request.user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=['patch', 'delete'], url_path=r'entries/(?P<entry_id>[^/.]+)')
    def manage_entry(self, request, pk=None, entry_id=None):
        item = self.get_object()
        try:
            entry = item.entries.get(id=entry_id)
        except TimeEntry.DoesNotExist:
            return Response({'detail': 'Not found.'}, status=status.HTTP_404_NOT_FOUND)
        if entry.user != request.user:
            return Response({'detail': 'Not your entry.'}, status=status.HTTP_403_FORBIDDEN)
        if request.method == 'DELETE':
            entry.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        # PATCH — stop timer
        if 'end_time' in request.data:
            entry.end_time = request.data['end_time']
            entry.save(update_fields=['end_time'])
        if 'description' in request.data:
            entry.description = request.data['description']
            entry.save(update_fields=['description'])
        if 'is_billable' in request.data:
            entry.is_billable = request.data['is_billable']
            entry.save(update_fields=['is_billable'])
        return Response(TimeEntrySerializer(entry).data)

    @action(detail=True, methods=['post'], url_path='start-timer')
    def start_timer(self, request, pk=None):
        item = self.get_object()
        # Stop any running entries for this user
        TimeEntry.objects.filter(user=request.user, end_time__isnull=True).update(end_time=timezone.now())
        entry = TimeEntry.objects.create(
            project=item,
            user=request.user,
            start_time=timezone.now(),
            description=request.data.get('description', ''),
        )
        return Response(TimeEntrySerializer(entry).data, status=status.HTTP_201_CREATED)

    @action(detail=False, methods=['post'], url_path='stop-timer')
    def stop_timer(self, request):
        running = TimeEntry.objects.filter(user=request.user, end_time__isnull=True).first()
        if not running:
            return Response({'detail': 'No running timer.'}, status=status.HTTP_404_NOT_FOUND)
        running.end_time = timezone.now()
        running.save(update_fields=['end_time'])
        return Response(TimeEntrySerializer(running).data)

    @action(detail=False, methods=['get'], url_path='running')
    def running(self, request):
        entry = TimeEntry.objects.filter(user=request.user, end_time__isnull=True).select_related('project').first()
        if not entry:
            return Response(None)
        data = TimeEntrySerializer(entry).data
        data['project_title'] = entry.project.title
        data['project_color'] = entry.project.color
        return Response(data)

    @action(detail=False, methods=['get'], url_path='my-stats')
    def my_stats(self, request):
        items = Item.objects.filter(owner=request.user)
        entries = TimeEntry.objects.filter(user=request.user, end_time__isnull=False)

        total_projects = items.count()
        total_entries = entries.count()
        total_minutes = sum(e.duration_minutes for e in entries)

        # By project
        by_project = []
        for item in items.filter(status='active')[:10]:
            mins = sum(e.duration_minutes for e in entries.filter(project=item))
            by_project.append({'id': item.id, 'title': item.title, 'color': item.color, 'minutes': mins})

        # This week
        today = timezone.now().date()
        week_start = today - datetime.timedelta(days=today.weekday())
        week_entries = entries.filter(start_time__date__gte=week_start)
        week_minutes = sum(e.duration_minutes for e in week_entries)

        # Daily breakdown this week
        daily = []
        for i in range(7):
            d = week_start + datetime.timedelta(days=i)
            day_mins = sum(e.duration_minutes for e in week_entries.filter(start_time__date=d))
            daily.append({'date': d.isoformat(), 'weekday': d.strftime('%a'), 'minutes': day_mins})

        return Response({
            'total_projects': total_projects,
            'total_entries': total_entries,
            'total_minutes': total_minutes,
            'week_minutes': week_minutes,
            'by_project': by_project,
            'daily': daily,
        })
