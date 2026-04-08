from django.db import models
from django.conf import settings

class Item(models.Model):  # Order/Project
    CAT_CHOICES = [('web','Веб-разработка'),('mobile','Мобильная'),('design','Дизайн'),('marketing','Маркетинг'),('writing','Копирайтинг'),('video','Видео'),('data','Данные/ML'),('devops','DevOps'),('other','Другое')]
    STATUS_CHOICES = [('open','Открыт'),('in_progress','В работе'),('review','На проверке'),('completed','Завершён'),('cancelled','Отменён')]
    BUDGET_CHOICES = [('fixed','Фиксированный'),('hourly','Почасовой')]
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='items')
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True, default='')
    category = models.CharField(max_length=20, choices=CAT_CHOICES, default='web')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='open')
    budget_type = models.CharField(max_length=10, choices=BUDGET_CHOICES, default='fixed')
    budget = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    deadline = models.DateField(null=True, blank=True)
    skills = models.CharField(max_length=500, blank=True, default='')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    class Meta:
        ordering = ['-created_at']

class Proposal(models.Model):
    STATUS_CHOICES = [('pending','Ожидает'),('accepted','Принят'),('rejected','Отклонён')]
    order = models.ForeignKey(Item, on_delete=models.CASCADE, related_name='proposals')
    freelancer = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='proposals')
    price = models.DecimalField(max_digits=12, decimal_places=2)
    message = models.TextField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)
    class Meta:
        ordering = ['-created_at']
        unique_together = ['order', 'freelancer']
