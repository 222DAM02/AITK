from django.db import models
from django.conf import settings
from django.utils import timezone

class Item(models.Model):  # Employee
    DEPT_CHOICES = [('dev','Разработка'),('design','Дизайн'),('marketing','Маркетинг'),('hr','HR'),('finance','Финансы'),('sales','Продажи'),('support','Поддержка'),('management','Управление')]
    STATUS_CHOICES = [('active','Работает'),('vacation','В отпуске'),('sick','На больничном'),('fired','Уволен')]
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='items')
    title = models.CharField(max_length=200)  # ФИО
    description = models.TextField(blank=True, default='')
    position = models.CharField(max_length=100, blank=True, default='')
    department = models.CharField(max_length=20, choices=DEPT_CHOICES, default='dev')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active')
    salary = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    hire_date = models.DateField(null=True, blank=True)
    email = models.EmailField(blank=True, default='')
    phone = models.CharField(max_length=20, blank=True, default='')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    class Meta:
        ordering = ['-created_at']

class LeaveRequest(models.Model):
    TYPE_CHOICES = [('vacation','Отпуск'),('sick','Больничный'),('personal','Личный'),('remote','Удалёнка')]
    STATUS_CHOICES = [('pending','На рассмотрении'),('approved','Одобрен'),('rejected','Отклонён')]
    employee = models.ForeignKey(Item, on_delete=models.CASCADE, related_name='leave_requests')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    leave_type = models.CharField(max_length=20, choices=TYPE_CHOICES, default='vacation')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    start_date = models.DateField()
    end_date = models.DateField()
    reason = models.TextField(blank=True, default='')
    created_at = models.DateTimeField(auto_now_add=True)
    class Meta:
        ordering = ['-created_at']
