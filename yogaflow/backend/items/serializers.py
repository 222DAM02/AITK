from rest_framework import serializers
from .models import Item, Pose


class PoseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Pose
        fields = ('id', 'flow', 'pose_name', 'sanskrit_name', 'duration_seconds', 'instructions', 'order')
        read_only_fields = ('id', 'flow')


class ItemSerializer(serializers.ModelSerializer):
    owner_username = serializers.ReadOnlyField(source='owner.username')
    poses_count = serializers.IntegerField(read_only=True, default=0)
    total_duration = serializers.SerializerMethodField()

    class Meta:
        model = Item
        fields = (
            'id', 'owner', 'owner_username', 'title', 'description',
            'level', 'style', 'duration_minutes', 'focus',
            'poses_count', 'total_duration',
            'created_at', 'updated_at',
        )
        read_only_fields = ('id', 'owner', 'owner_username', 'created_at', 'updated_at')

    def get_total_duration(self, obj):
        # sum of all poses duration in seconds
        try:
            return sum(p.duration_seconds for p in obj.poses.all())
        except Exception:
            return 0


class ItemDetailSerializer(ItemSerializer):
    poses = PoseSerializer(many=True, read_only=True)

    class Meta(ItemSerializer.Meta):
        fields = ItemSerializer.Meta.fields + ('poses',)
