from rest_framework import serializers
from .models import Item


class ItemSerializer(serializers.ModelSerializer):
    owner_username = serializers.ReadOnlyField(source='owner.username')
    tags_list = serializers.ReadOnlyField()

    class Meta:
        model = Item
        fields = (
            'id', 'owner', 'owner_username', 'title', 'description',
            'subject', 'tags', 'tags_list', 'is_pinned',
            'created_at', 'updated_at',
        )
        read_only_fields = ('id', 'owner', 'owner_username', 'created_at', 'updated_at')
