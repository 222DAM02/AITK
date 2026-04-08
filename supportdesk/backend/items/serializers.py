from rest_framework import serializers
from .models import Item, TicketComment
class TicketCommentSerializer(serializers.ModelSerializer):
    author_name = serializers.ReadOnlyField(source='author.username')
    class Meta:
        model = TicketComment
        fields = ('id','author','author_name','text','is_internal','created_at')
        read_only_fields = ('id','author','author_name','created_at')
class ItemSerializer(serializers.ModelSerializer):
    owner_username = serializers.ReadOnlyField(source='owner.username')
    is_overdue = serializers.ReadOnlyField()
    comments_count = serializers.SerializerMethodField()
    assigned_username = serializers.ReadOnlyField(source='assigned_to.username')
    def get_comments_count(self, obj): return obj.comments.count()
    class Meta:
        model = Item
        fields = ('id','owner','owner_username','title','description','priority','status','category','assigned_to','assigned_username','sla_hours','is_overdue','comments_count','created_at','updated_at')
        read_only_fields = ('id','owner','owner_username','created_at','updated_at')
class ItemDetailSerializer(ItemSerializer):
    comments = TicketCommentSerializer(many=True, read_only=True)
    class Meta(ItemSerializer.Meta):
        fields = ItemSerializer.Meta.fields + ('comments',)
