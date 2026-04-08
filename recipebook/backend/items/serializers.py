from rest_framework import serializers
from .models import Item


class ItemSerializer(serializers.ModelSerializer):
    owner_username = serializers.ReadOnlyField(source='owner.username')

    class Meta:
        model = Item
        fields = (
            'id', 'owner', 'owner_username', 'title', 'description',
            # === ТЕМА-СПЕЦИФИЧНЫЕ ПОЛЯ ===
            'ingredients', 'cooking_time', 'image_url',
            # === КОНЕЦ ===
            'created_at', 'updated_at',
        )
        read_only_fields = ('id', 'owner', 'owner_username', 'created_at', 'updated_at')
