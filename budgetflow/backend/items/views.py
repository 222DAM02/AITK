from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Sum, Q
from django.utils import timezone
import datetime

from .models import Item, Budget
from .serializers import ItemSerializer, BudgetSerializer
from core.permissions import IsOwner, IsNotBlocked


class ItemViewSet(viewsets.ModelViewSet):
    serializer_class = ItemSerializer

    def get_queryset(self):
        qs = Item.objects.all()
        if self.request.query_params.get('mine') == 'true':
            qs = qs.filter(owner=self.request.user)
        tp = self.request.query_params.get('type')
        if tp:
            qs = qs.filter(type=tp)
        cat = self.request.query_params.get('category')
        if cat:
            qs = qs.filter(category=cat)
        search = self.request.query_params.get('search')
        if search:
            qs = qs.filter(title__icontains=search)
        month = self.request.query_params.get('month')
        if month:
            try:
                y, m = month.split('-')
                qs = qs.filter(date__year=int(y), date__month=int(m))
            except Exception:
                pass
        return qs

    def get_permissions(self):
        if self.action in ('update', 'partial_update', 'destroy'):
            return [permissions.IsAuthenticated(), IsOwner()]
        if self.action == 'create':
            return [permissions.IsAuthenticated(), IsNotBlocked()]
        return [permissions.IsAuthenticated()]

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

    @action(detail=False, methods=['get'], url_path='my-stats')
    def my_stats(self, request):
        items = Item.objects.filter(owner=request.user)
        today = timezone.now().date()
        month_start = today.replace(day=1)

        month_income = items.filter(type='income', date__gte=month_start).aggregate(s=Sum('amount'))['s'] or 0
        month_expense = items.filter(type='expense', date__gte=month_start).aggregate(s=Sum('amount'))['s'] or 0

        # By category this month
        by_category = {}
        for cat, label in Item.CATEGORY_CHOICES:
            total = items.filter(type='expense', category=cat, date__gte=month_start).aggregate(s=Sum('amount'))['s']
            if total:
                by_category[cat] = {'label': label, 'total': float(total)}

        # Daily for last 30 days
        daily = []
        for i in range(29, -1, -1):
            d = today - datetime.timedelta(days=i)
            inc = items.filter(type='income', date=d).aggregate(s=Sum('amount'))['s'] or 0
            exp = items.filter(type='expense', date=d).aggregate(s=Sum('amount'))['s'] or 0
            daily.append({'date': d.isoformat(), 'income': float(inc), 'expense': float(exp)})

        return Response({
            'total_transactions': items.count(),
            'month_income': float(month_income),
            'month_expense': float(month_expense),
            'month_balance': float(month_income - month_expense),
            'by_category': by_category,
            'daily': daily,
        })

    @action(detail=False, methods=['get', 'post'], url_path='budgets')
    def budgets(self, request):
        if request.method == 'GET':
            month = request.query_params.get('month')
            qs = Budget.objects.filter(owner=request.user)
            if month:
                try:
                    y, m = month.split('-')
                    qs = qs.filter(month__year=int(y), month__month=int(m))
                except Exception:
                    pass
            return Response(BudgetSerializer(qs, many=True).data)
        serializer = BudgetSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(owner=request.user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @action(detail=False, methods=['delete'], url_path=r'budgets/(?P<budget_id>[^/.]+)')
    def delete_budget(self, request, budget_id=None):
        try:
            b = Budget.objects.get(id=budget_id, owner=request.user)
        except Budget.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        b.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
