from django.db import models
from django.conf import settings
from django.utils import timezone

class Item(models.Model):  # Doctor
    SPEC_CHOICES = [('therapist','Терапевт'),('surgeon','Хирург'),('dentist','Стоматолог'),('cardiologist','Кардиолог'),('neurologist','Невролог'),('ophthalmologist','Офтальмолог'),('dermatologist','Дерматолог'),('pediatrician','Педиатр'),('ent','ЛОР'),('orthopedist','Ортопед')]
    STATUS_CHOICES = [('available','Принимает'),('busy','Занят'),('day_off','Выходной'),('vacation','Отпуск')]
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='items')
    title = models.CharField(max_length=200)  # ФИО врача
    description = models.TextField(blank=True, default='')
    specialization = models.CharField(max_length=20, choices=SPEC_CHOICES, default='therapist')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='available')
    cabinet = models.CharField(max_length=20, blank=True, default='')
    experience_years = models.PositiveIntegerField(null=True, blank=True)
    reception_time = models.CharField(max_length=100, blank=True, default='')  # e.g. "9:00-17:00"
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    class Meta:
        ordering = ['title']

class Appointment(models.Model):
    STATUS_CHOICES = [('booked','Забронировано'),('completed','Завершено'),('cancelled','Отменено'),('no_show','Не явился')]
    doctor = models.ForeignKey(Item, on_delete=models.CASCADE, related_name='appointments')
    patient = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='appointments')
    date = models.DateField()
    time_slot = models.TimeField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='booked')
    complaint = models.TextField(blank=True, default='')
    created_at = models.DateTimeField(auto_now_add=True)
    class Meta:
        ordering = ['date', 'time_slot']
        unique_together = ['doctor', 'date', 'time_slot']
