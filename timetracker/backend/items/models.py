from django.db import models
from django.conf import settings
from django.utils import timezone


class Item(models.Model):  # Project
    STATUS_CHOICES = [
        ('active', 'Активный'),
        ('paused', 'На паузе'),
        ('completed', 'Завершён'),
        ('archived', 'Архив'),
    ]
    COLOR_CHOICES = [
        ('blue', 'Синий'), ('green', 'Зелёный'), ('red', 'Красный'),
        ('purple', 'Фиолетовый'), ('orange', 'Оранжевый'), ('cyan', 'Бирюзовый'),
        ('pink', 'Розовый'), ('yellow', 'Жёлтый'),
    ]

    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='items')
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True, default='')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active')
    color = models.CharField(max_length=20, choices=COLOR_CHOICES, default='blue')
    hourly_rate = models.DecimalField(max_digits=8, decimal_places=2, null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.title


class TimeEntry(models.Model):
    project = models.ForeignKey(Item, on_delete=models.CASCADE, related_name='entries')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='time_entries')
    description = models.CharField(max_length=500, blank=True, default='')
    start_time = models.DateTimeField(default=timezone.now)
    end_time = models.DateTimeField(null=True, blank=True)
    is_billable = models.BooleanField(default=True)

    class Meta:
        ordering = ['-start_time']

    def __str__(self):
        return f"{self.project.title} — {self.start_time}"

    @property
    def duration_minutes(self):
        if self.end_time:
            delta = self.end_time - self.start_time
            return max(0, int(delta.total_seconds() / 60))
        return 0
