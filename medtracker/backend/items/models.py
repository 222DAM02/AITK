from django.db import models
from django.conf import settings
import datetime


class Item(models.Model):
    CATEGORY_CHOICES = [
        ('tablet', 'Таблетки'),
        ('capsule', 'Капсулы'),
        ('syrup', 'Сироп'),
        ('injection', 'Инъекция'),
        ('drops', 'Капли'),
        ('spray', 'Спрей'),
        ('patch', 'Пластырь'),
        ('other', 'Другое'),
    ]

    FREQUENCY_CHOICES = [
        ('once', '1 раз в день'),
        ('twice', '2 раза в день'),
        ('three', '3 раза в день'),
        ('four', '4 раза в день'),
        ('weekly', '1 раз в неделю'),
        ('as_needed', 'По необходимости'),
    ]

    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='items')
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True, default='')
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES, default='tablet')
    dosage = models.CharField(max_length=100, blank=True, default='')
    frequency = models.CharField(max_length=20, choices=FREQUENCY_CHOICES, default='once')
    start_date = models.DateField(null=True, blank=True)
    end_date = models.DateField(null=True, blank=True)
    is_active = models.BooleanField(default=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-is_active', '-created_at']

    def __str__(self):
        return self.title


class DoseSchedule(models.Model):
    TIME_CHOICES = [
        ('morning', 'Утро (~08:00)'),
        ('afternoon', 'День (~13:00)'),
        ('evening', 'Вечер (~19:00)'),
        ('night', 'Ночь (~22:00)'),
    ]

    medication = models.ForeignKey(Item, on_delete=models.CASCADE, related_name='schedules')
    time_of_day = models.CharField(max_length=20, choices=TIME_CHOICES)

    class Meta:
        unique_together = ('medication', 'time_of_day')
        ordering = ['time_of_day']

    def __str__(self):
        return f'{self.medication.title} — {self.time_of_day}'


class DoseLog(models.Model):
    STATUS_CHOICES = [
        ('taken', 'Принято'),
        ('missed', 'Пропущено'),
        ('skipped', 'Пропущено намеренно'),
    ]

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='dose_logs')
    medication = models.ForeignKey(Item, on_delete=models.CASCADE, related_name='dose_logs')
    time_of_day = models.CharField(max_length=20)
    date = models.DateField(default=datetime.date.today)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='taken')
    logged_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'medication', 'time_of_day', 'date')
        ordering = ['-date', 'time_of_day']

    def __str__(self):
        return f'{self.user} — {self.medication} — {self.date} {self.time_of_day}'
