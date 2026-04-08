from rest_framework import serializers
from .models import Item, StockMovement
class StockMovementSerializer(serializers.ModelSerializer):
    username = serializers.ReadOnlyField(source='user.username')
    class Meta:
        model = StockMovement
        fields = ('id','movement_type','quantity','note','username','created_at')
        read_only_fields = ('id','username','created_at')
class ItemSerializer(serializers.ModelSerializer):
    owner_username = serializers.ReadOnlyField(source='owner.username')
    total_value = serializers.SerializerMethodField()
    def get_total_value(self, obj):
        return float(obj.quantity * (obj.price or 0))
    class Meta:
        model = Item
        fields = ('id','owner','owner_username','title','description','sku','category','status','quantity','price','supplier','min_stock','total_value','created_at','updated_at')
        read_only_fields = ('id','owner','owner_username','created_at','updated_at')
class ItemDetailSerializer(ItemSerializer):
    movements = StockMovementSerializer(many=True, read_only=True)
    class Meta(ItemSerializer.Meta):
        fields = ItemSerializer.Meta.fields + ('movements',)
