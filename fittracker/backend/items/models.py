from django.db import models
from django.conf import settings


class Item(models.Model):
    WORKOUT_TYPE_CHOICES = [
        ('strength', 'Силовая'),
        ('cardio', 'Кардио'),
        ('flexibility', 'Растяжка'),
        ('hiit', 'HIIT'),
        ('crossfit', 'Кроссфит'),
        ('yoga', 'Йога'),
        ('swimming', 'Плавание'),
        ('running', 'Бег'),
        ('cycling', 'Велосипед'),
        ('other', 'Другое'),
    ]

    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='items')
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True, default='')
    workout_type = models.CharField(max_length=20, choices=WORKOUT_TYPE_CHOICES, default='strength')
    duration_minutes = models.PositiveIntegerField(null=True, blank=True)
    calories_burned = models.PositiveIntegerField(null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.title


class Exercise(models.Model):
    workout = models.ForeignKey(Item, on_delete=models.CASCADE, related_name='exercises')
    name = models.CharField(max_length=200)
    sets = models.PositiveIntegerField(default=3)
    reps = models.PositiveIntegerField(default=10)
    weight_kg = models.DecimalField(max_digits=6, decimal_places=1, null=True, blank=True)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order', 'id']

    def __str__(self):
        return f'{self.name} — {self.sets}x{self.reps}'
