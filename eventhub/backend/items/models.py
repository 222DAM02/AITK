from django.db import models
from django.conf import settings
from django.utils import timezone


class Item(models.Model):  # Event
    TYPE_CHOICES = [
        ('conference', 'Конференция'), ('meetup', 'Митап'), ('workshop', 'Воркшоп'),
        ('webinar', 'Вебинар'), ('hackathon', 'Хакатон'), ('party', 'Вечеринка'), ('other', 'Другое'),
    ]
    STATUS_CHOICES = [
        ('upcoming', 'Предстоит'), ('active', 'Идёт'), ('completed', 'Завершено'), ('cancelled', 'Отменено'),
    ]

    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='items')
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True, default='')
    event_type = models.CharField(max_length=20, choices=TYPE_CHOICES, default='meetup')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='upcoming')
    location = models.CharField(max_length=300, blank=True, default='')
    date = models.DateField(default=timezone.now)
    time_start = models.TimeField(null=True, blank=True)
    time_end = models.TimeField(null=True, blank=True)
    max_participants = models.PositiveIntegerField(null=True, blank=True)
    is_free = models.BooleanField(default=True)
    price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['date', 'time_start']

    def __str__(self):
        return self.title


class Registration(models.Model):
    event = models.ForeignKey(Item, on_delete=models.CASCADE, related_name='registrations')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='registrations')
    registered_at = models.DateTimeField(auto_now_add=True)
    note = models.TextField(blank=True, default='')

    class Meta:
        unique_together = ['event', 'user']
        ordering = ['-registered_at']
