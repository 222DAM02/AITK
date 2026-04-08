from django.db import models
from django.conf import settings
from django.utils import timezone

class Item(models.Model):  # Product
    CAT_CHOICES = [('electronics','Электроника'),('food','Продукты'),('clothing','Одежда'),('tools','Инструменты'),('office','Офис'),('raw','Сырьё'),('other','Прочее')]
    STATUS_CHOICES = [('in_stock','В наличии'),('low_stock','Мало'),('out_of_stock','Нет в наличии'),('discontinued','Снят')]
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='items')
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True, default='')
    sku = models.CharField(max_length=50, blank=True, default='')
    category = models.CharField(max_length=20, choices=CAT_CHOICES, default='other')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='in_stock')
    quantity = models.PositiveIntegerField(default=0)
    price = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    supplier = models.CharField(max_length=200, blank=True, default='')
    min_stock = models.PositiveIntegerField(default=5)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    class Meta:
        ordering = ['-created_at']

class StockMovement(models.Model):
    TYPE_CHOICES = [('in','Приход'),('out','Расход'),('adjustment','Корректировка')]
    product = models.ForeignKey(Item, on_delete=models.CASCADE, related_name='movements')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    movement_type = models.CharField(max_length=20, choices=TYPE_CHOICES)
    quantity = models.IntegerField()
    note = models.TextField(blank=True, default='')
    created_at = models.DateTimeField(auto_now_add=True)
    class Meta:
        ordering = ['-created_at']
