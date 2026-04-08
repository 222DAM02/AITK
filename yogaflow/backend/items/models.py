from django.db import models
from django.conf import settings


class Item(models.Model):
    LEVEL_CHOICES = [
        ('beginner', 'Начинающий'),
        ('intermediate', 'Средний'),
        ('advanced', 'Продвинутый'),
    ]

    STYLE_CHOICES = [
        ('vinyasa', 'Виньяса'),
        ('hatha', 'Хатха'),
        ('yin', 'Инь'),
        ('power', 'Силовая'),
        ('restorative', 'Восстановительная'),
        ('ashtanga', 'Аштанга'),
        ('kundalini', 'Кундалини'),
        ('other', 'Другое'),
    ]

    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='items')
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True, default='')
    level = models.CharField(max_length=20, choices=LEVEL_CHOICES, default='beginner')
    style = models.CharField(max_length=20, choices=STYLE_CHOICES, default='hatha')
    duration_minutes = models.PositiveIntegerField(null=True, blank=True)
    focus = models.CharField(max_length=200, blank=True, default='')

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.title


class Pose(models.Model):
    flow = models.ForeignKey(Item, on_delete=models.CASCADE, related_name='poses')
    pose_name = models.CharField(max_length=200)
    sanskrit_name = models.CharField(max_length=200, blank=True, default='')
    duration_seconds = models.PositiveIntegerField(default=30)
    instructions = models.TextField(blank=True, default='')
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order', 'id']

    def __str__(self):
        return f'{self.flow.title} — {self.pose_name}'
