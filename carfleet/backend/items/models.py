from django.db import models
from django.conf import settings
from django.utils import timezone


class Item(models.Model):  # Vehicle
    STATUS_CHOICES = [
        ('active', 'В эксплуатации'), ('maintenance', 'На ТО'), ('repair', 'В ремонте'), ('decommissioned', 'Списан'),
    ]
    FUEL_CHOICES = [
        ('petrol', 'Бензин'), ('diesel', 'Дизель'), ('electric', 'Электро'),
        ('hybrid', 'Гибрид'), ('gas', 'Газ'),
    ]

    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='items')
    title = models.CharField(max_length=200)  # e.g. "Toyota Camry 2022"
    description = models.TextField(blank=True, default='')
    vin = models.CharField(max_length=17, blank=True, default='')
    license_plate = models.CharField(max_length=20, blank=True, default='')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active')
    fuel_type = models.CharField(max_length=20, choices=FUEL_CHOICES, default='petrol')
    year = models.PositiveIntegerField(null=True, blank=True)
    mileage = models.PositiveIntegerField(default=0)  # km
    insurance_expires = models.DateField(null=True, blank=True)
    next_maintenance = models.DateField(null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.title


class FuelLog(models.Model):
    vehicle = models.ForeignKey(Item, on_delete=models.CASCADE, related_name='fuel_logs')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    date = models.DateField(default=timezone.now)
    liters = models.DecimalField(max_digits=8, decimal_places=2)
    cost = models.DecimalField(max_digits=10, decimal_places=2)
    mileage_at = models.PositiveIntegerField()
    is_full_tank = models.BooleanField(default=True)

    class Meta:
        ordering = ['-date']
