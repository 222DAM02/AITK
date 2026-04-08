from rest_framework import serializers
from .models import Item, FuelLog

class FuelLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = FuelLog
        fields = ('id', 'date', 'liters', 'cost', 'mileage_at', 'is_full_tank')
        read_only_fields = ('id',)

class ItemSerializer(serializers.ModelSerializer):
    owner_username = serializers.ReadOnlyField(source='owner.username')
    fuel_logs_count = serializers.SerializerMethodField()
    total_fuel_cost = serializers.SerializerMethodField()

    def get_fuel_logs_count(self, obj):
        return obj.fuel_logs.count()

    def get_total_fuel_cost(self, obj):
        from django.db.models import Sum
        return float(obj.fuel_logs.aggregate(s=Sum('cost'))['s'] or 0)

    class Meta:
        model = Item
        fields = ('id', 'owner', 'owner_username', 'title', 'description', 'vin', 'license_plate',
                  'status', 'fuel_type', 'year', 'mileage', 'insurance_expires', 'next_maintenance',
                  'fuel_logs_count', 'total_fuel_cost', 'created_at', 'updated_at')
        read_only_fields = ('id', 'owner', 'owner_username', 'created_at', 'updated_at')

class ItemDetailSerializer(ItemSerializer):
    fuel_logs = FuelLogSerializer(many=True, read_only=True)
    class Meta(ItemSerializer.Meta):
        fields = ItemSerializer.Meta.fields + ('fuel_logs',)
