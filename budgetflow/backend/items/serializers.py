from rest_framework import serializers
from .models import Item, Budget


class ItemSerializer(serializers.ModelSerializer):
    owner_username = serializers.ReadOnlyField(source='owner.username')

    class Meta:
        model = Item
        fields = ('id', 'owner', 'owner_username', 'title', 'description', 'amount',
                  'type', 'category', 'currency', 'date', 'created_at', 'updated_at')
        read_only_fields = ('id', 'owner', 'owner_username', 'created_at', 'updated_at')


class BudgetSerializer(serializers.ModelSerializer):
    spent = serializers.SerializerMethodField()

    def get_spent(self, obj):
        from django.db.models import Sum
        total = Item.objects.filter(
            owner=obj.owner, category=obj.category, type='expense',
            date__year=obj.month.year, date__month=obj.month.month,
        ).aggregate(s=Sum('amount'))['s']
        return float(total or 0)

    class Meta:
        model = Budget
        fields = ('id', 'category', 'limit_amount', 'month', 'spent')
        read_only_fields = ('id',)
