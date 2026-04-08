from rest_framework import serializers
from .models import Item, Appointment
class AppointmentSerializer(serializers.ModelSerializer):
    patient_name = serializers.ReadOnlyField(source='patient.username')
    class Meta:
        model = Appointment
        fields = ('id','patient','patient_name','date','time_slot','status','complaint','created_at')
        read_only_fields = ('id','patient','patient_name','created_at')
class ItemSerializer(serializers.ModelSerializer):
    owner_username = serializers.ReadOnlyField(source='owner.username')
    appointments_count = serializers.SerializerMethodField()
    def get_appointments_count(self, obj): return obj.appointments.filter(status='booked').count()
    class Meta:
        model = Item
        fields = ('id','owner','owner_username','title','description','specialization','status','cabinet','experience_years','reception_time','appointments_count','created_at','updated_at')
        read_only_fields = ('id','owner','owner_username','created_at','updated_at')
class ItemDetailSerializer(ItemSerializer):
    appointments = AppointmentSerializer(many=True, read_only=True)
    class Meta(ItemSerializer.Meta):
        fields = ItemSerializer.Meta.fields + ('appointments',)
