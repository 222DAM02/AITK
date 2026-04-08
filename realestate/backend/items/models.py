from django.db import models
from django.conf import settings

class Item(models.Model):  # Property
    TYPE_CHOICES = [('apartment','Квартира'),('house','Дом'),('studio','Студия'),('room','Комната'),('commercial','Коммерция'),('land','Участок')]
    DEAL_CHOICES = [('sale','Продажа'),('rent','Аренда')]
    STATUS_CHOICES = [('active','Активно'),('reserved','Забронировано'),('sold','Продано'),('rented','Сдано')]
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='items')
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True, default='')
    property_type = models.CharField(max_length=20, choices=TYPE_CHOICES, default='apartment')
    deal_type = models.CharField(max_length=10, choices=DEAL_CHOICES, default='sale')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active')
    price = models.DecimalField(max_digits=14, decimal_places=2)
    area = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)  # m²
    rooms = models.PositiveIntegerField(null=True, blank=True)
    floor = models.IntegerField(null=True, blank=True)
    total_floors = models.PositiveIntegerField(null=True, blank=True)
    address = models.CharField(max_length=300, blank=True, default='')
    district = models.CharField(max_length=100, blank=True, default='')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    class Meta:
        ordering = ['-created_at']
    @property
    def price_per_m2(self):
        if self.area and self.area > 0:
            return round(float(self.price) / float(self.area), 2)
        return None
