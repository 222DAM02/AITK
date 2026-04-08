from rest_framework import serializers
from .models import Item, TimeEntry


class TimeEntrySerializer(serializers.ModelSerializer):
    user_username = serializers.ReadOnlyField(source='user.username')
    duration_minutes = serializers.ReadOnlyField()

    class Meta:
        model = TimeEntry
        fields = ('id', 'project', 'user', 'user_username', 'description',
                  'start_time', 'end_time', 'duration_minutes', 'is_billable')
        read_only_fields = ('id', 'project', 'user', 'user_username')


class ItemSerializer(serializers.ModelSerializer):
    owner_username = serializers.ReadOnlyField(source='owner.username')
    entries_count = serializers.SerializerMethodField()
    total_minutes = serializers.SerializerMethodField()

    def get_entries_count(self, obj):
        return obj.entries.count()

    def get_total_minutes(self, obj):
        total = 0
        for e in obj.entries.filter(end_time__isnull=False):
            total += e.duration_minutes
        return total

    class Meta:
        model = Item
        fields = (
            'id', 'owner', 'owner_username', 'title', 'description',
            'status', 'color', 'hourly_rate',
            'entries_count', 'total_minutes',
            'created_at', 'updated_at',
        )
        read_only_fields = ('id', 'owner', 'owner_username', 'created_at', 'updated_at')


class ItemDetailSerializer(ItemSerializer):
    entries = TimeEntrySerializer(many=True, read_only=True)

    class Meta(ItemSerializer.Meta):
        fields = ItemSerializer.Meta.fields + ('entries',)
