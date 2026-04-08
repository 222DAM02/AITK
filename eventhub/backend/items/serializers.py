from rest_framework import serializers
from .models import Item, Registration

class RegistrationSerializer(serializers.ModelSerializer):
    username = serializers.ReadOnlyField(source='user.username')
    class Meta:
        model = Registration
        fields = ('id', 'user', 'username', 'registered_at', 'note')
        read_only_fields = ('id', 'user', 'username', 'registered_at')

class ItemSerializer(serializers.ModelSerializer):
    owner_username = serializers.ReadOnlyField(source='owner.username')
    registrations_count = serializers.SerializerMethodField()
    is_registered = serializers.SerializerMethodField()

    def get_registrations_count(self, obj):
        return obj.registrations.count()

    def get_is_registered(self, obj):
        req = self.context.get('request')
        if req and req.user.is_authenticated:
            return obj.registrations.filter(user=req.user).exists()
        return False

    class Meta:
        model = Item
        fields = ('id', 'owner', 'owner_username', 'title', 'description', 'event_type', 'status',
                  'location', 'date', 'time_start', 'time_end', 'max_participants', 'is_free', 'price',
                  'registrations_count', 'is_registered', 'created_at', 'updated_at')
        read_only_fields = ('id', 'owner', 'owner_username', 'created_at', 'updated_at')

class ItemDetailSerializer(ItemSerializer):
    registrations = RegistrationSerializer(many=True, read_only=True)
    class Meta(ItemSerializer.Meta):
        fields = ItemSerializer.Meta.fields + ('registrations',)
