from rest_framework import serializers
from .models import Item, LeaveRequest
class LeaveRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = LeaveRequest
        fields = ('id','leave_type','status','start_date','end_date','reason','created_at')
        read_only_fields = ('id','created_at')
class ItemSerializer(serializers.ModelSerializer):
    owner_username = serializers.ReadOnlyField(source='owner.username')
    leaves_count = serializers.SerializerMethodField()
    def get_leaves_count(self, obj): return obj.leave_requests.count()
    class Meta:
        model = Item
        fields = ('id','owner','owner_username','title','description','position','department','status','salary','hire_date','email','phone','leaves_count','created_at','updated_at')
        read_only_fields = ('id','owner','owner_username','created_at','updated_at')
class ItemDetailSerializer(ItemSerializer):
    leave_requests = LeaveRequestSerializer(many=True, read_only=True)
    class Meta(ItemSerializer.Meta):
        fields = ItemSerializer.Meta.fields + ('leave_requests',)
