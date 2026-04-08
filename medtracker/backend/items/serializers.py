from rest_framework import serializers
from .models import Item, DoseSchedule, DoseLog


class DoseScheduleSerializer(serializers.ModelSerializer):
    class Meta:
        model = DoseSchedule
        fields = ('id', 'medication', 'time_of_day')
        read_only_fields = ('id', 'medication')


class ItemSerializer(serializers.ModelSerializer):
    owner_username = serializers.ReadOnlyField(source='owner.username')
    schedules = DoseScheduleSerializer(many=True, read_only=True)
    schedule_times = serializers.ListField(
        child=serializers.CharField(), write_only=True, required=False
    )

    class Meta:
        model = Item
        fields = (
            'id', 'owner', 'owner_username', 'title', 'description',
            'category', 'dosage', 'frequency', 'start_date', 'end_date',
            'is_active', 'schedules', 'schedule_times',
            'created_at', 'updated_at',
        )
        read_only_fields = ('id', 'owner', 'owner_username', 'created_at', 'updated_at')

    def create(self, validated_data):
        schedule_times = validated_data.pop('schedule_times', [])
        item = super().create(validated_data)
        for t in schedule_times:
            DoseSchedule.objects.get_or_create(medication=item, time_of_day=t)
        return item

    def update(self, instance, validated_data):
        schedule_times = validated_data.pop('schedule_times', None)
        item = super().update(instance, validated_data)
        if schedule_times is not None:
            item.schedules.all().delete()
            for t in schedule_times:
                DoseSchedule.objects.get_or_create(medication=item, time_of_day=t)
        return item


class DoseLogSerializer(serializers.ModelSerializer):
    medication_title = serializers.ReadOnlyField(source='medication.title')

    class Meta:
        model = DoseLog
        fields = ('id', 'user', 'medication', 'medication_title', 'time_of_day', 'date', 'status', 'logged_at')
        read_only_fields = ('id', 'user', 'logged_at')
