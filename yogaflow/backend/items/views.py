from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Count

from .models import Item, Pose
from .serializers import ItemSerializer, ItemDetailSerializer, PoseSerializer
from core.permissions import IsOwner, IsNotBlocked


class ItemViewSet(viewsets.ModelViewSet):
    serializer_class = ItemSerializer

    def get_queryset(self):
        qs = Item.objects.prefetch_related('poses').annotate(poses_count=Count('poses'))
        level = self.request.query_params.get('level')
        if level:
            qs = qs.filter(level=level)
        style = self.request.query_params.get('style')
        if style:
            qs = qs.filter(style=style)
        if self.request.query_params.get('mine') == 'true':
            qs = qs.filter(owner=self.request.user)
        return qs

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return ItemDetailSerializer
        return ItemSerializer

    def get_permissions(self):
        if self.action in ('update', 'partial_update', 'destroy'):
            return [permissions.IsAuthenticated(), IsOwner()]
        if self.action == 'create':
            return [permissions.IsAuthenticated(), IsNotBlocked()]
        return [permissions.IsAuthenticated()]

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

    @action(detail=True, methods=['get', 'post'])
    def poses(self, request, pk=None):
        flow = self.get_object()
        if request.method == 'GET':
            serializer = PoseSerializer(flow.poses.all(), many=True)
            return Response(serializer.data)
        if flow.owner != request.user:
            return Response({'detail': 'Only the owner can add poses.'}, status=status.HTTP_403_FORBIDDEN)
        serializer = PoseSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(flow=flow)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=['delete', 'patch'], url_path='poses/(?P<pose_id>[^/.]+)')
    def manage_pose(self, request, pk=None, pose_id=None):
        flow = self.get_object()
        if flow.owner != request.user:
            return Response({'detail': 'Only the owner can modify poses.'}, status=status.HTTP_403_FORBIDDEN)
        try:
            pose = flow.poses.get(id=pose_id)
        except Pose.DoesNotExist:
            return Response({'detail': 'Pose not found.'}, status=status.HTTP_404_NOT_FOUND)
        if request.method == 'DELETE':
            pose.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        # PATCH — reorder (move up/down)
        direction = request.data.get('direction')
        poses = list(flow.poses.all())
        idx = next((i for i, p in enumerate(poses) if p.id == pose.id), None)
        if direction == 'up' and idx > 0:
            poses[idx].order, poses[idx - 1].order = poses[idx - 1].order, poses[idx].order
            poses[idx].save(update_fields=['order'])
            poses[idx - 1].save(update_fields=['order'])
        elif direction == 'down' and idx < len(poses) - 1:
            poses[idx].order, poses[idx + 1].order = poses[idx + 1].order, poses[idx].order
            poses[idx].save(update_fields=['order'])
            poses[idx + 1].save(update_fields=['order'])
        return Response(PoseSerializer(flow.poses.all(), many=True).data)

    @action(detail=False, methods=['get'], url_path='my-stats')
    def my_stats(self, request):
        flows = Item.objects.filter(owner=request.user)
        total = flows.count()
        total_poses = Pose.objects.filter(flow__owner=request.user).count()
        by_level = {}
        by_style = {}
        for f in flows:
            by_level[f.level] = by_level.get(f.level, 0) + 1
            by_style[f.style] = by_style.get(f.style, 0) + 1
        return Response({
            'total_flows': total,
            'total_poses': total_poses,
            'by_level': by_level,
            'by_style': by_style,
        })
