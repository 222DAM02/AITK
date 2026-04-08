from rest_framework import serializers
from .models import Item, Comment


class CommentSerializer(serializers.ModelSerializer):
    author_username = serializers.ReadOnlyField(source='author.username')

    class Meta:
        model = Comment
        fields = ('id', 'task', 'author', 'author_username', 'text', 'created_at')
        read_only_fields = ('id', 'task', 'author', 'author_username', 'created_at')


class ItemSerializer(serializers.ModelSerializer):
    owner_username = serializers.ReadOnlyField(source='owner.username')
    is_overdue = serializers.ReadOnlyField()
    comments_count = serializers.SerializerMethodField()

    def get_comments_count(self, obj):
        return obj.comments.count()

    class Meta:
        model = Item
        fields = (
            'id', 'owner', 'owner_username', 'title', 'description',
            'status', 'priority', 'due_date', 'is_overdue',
            'comments_count', 'created_at', 'updated_at',
        )
        read_only_fields = ('id', 'owner', 'owner_username', 'created_at', 'updated_at')


class ItemDetailSerializer(ItemSerializer):
    comments = CommentSerializer(many=True, read_only=True)

    class Meta(ItemSerializer.Meta):
        fields = ItemSerializer.Meta.fields + ('comments',)
