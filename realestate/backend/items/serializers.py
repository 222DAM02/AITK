from rest_framework import serializers
from .models import Item
class ItemSerializer(serializers.ModelSerializer):
    owner_username = serializers.ReadOnlyField(source='owner.username')
    price_per_m2 = serializers.ReadOnlyField()
    class Meta:
        model = Item
        fields = ('id','owner','owner_username','title','description','property_type','deal_type','status','price','area','rooms','floor','total_floors','address','district','price_per_m2','created_at','updated_at')
        read_only_fields = ('id','owner','owner_username','created_at','updated_at')
