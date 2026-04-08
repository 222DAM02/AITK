from rest_framework import serializers
from .models import Item, Exercise


class ExerciseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Exercise
        fields = ('id', 'workout', 'name', 'sets', 'reps', 'weight_kg', 'order')
        read_only_fields = ('id', 'workout')


class ItemSerializer(serializers.ModelSerializer):
    owner_username = serializers.ReadOnlyField(source='owner.username')
    exercises_count = serializers.IntegerField(read_only=True, default=0)

    class Meta:
        model = Item
        fields = (
            'id', 'owner', 'owner_username', 'title', 'description',
            'workout_type', 'duration_minutes', 'calories_burned',
            'exercises_count', 'created_at', 'updated_at',
        )
        read_only_fields = ('id', 'owner', 'owner_username', 'created_at', 'updated_at')


class ItemDetailSerializer(ItemSerializer):
    exercises = ExerciseSerializer(many=True, read_only=True)

    class Meta(ItemSerializer.Meta):
        fields = ItemSerializer.Meta.fields + ('exercises',)
