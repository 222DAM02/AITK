from django.db import models
from django.conf import settings
from django.utils import timezone

class Item(models.Model):  # Ticket
    PRIORITY_CHOICES = [('low','Низкий'),('medium','Средний'),('high','Высокий'),('critical','Критический')]
    STATUS_CHOICES = [('open','Открыт'),('in_progress','В работе'),('waiting','Ожидание'),('resolved','Решён'),('closed','Закрыт')]
    CAT_CHOICES = [('bug','Баг'),('feature','Фича'),('question','Вопрос'),('incident','Инцидент'),('task','Задача')]
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='items')
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True, default='')
    priority = models.CharField(max_length=10, choices=PRIORITY_CHOICES, default='medium')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='open')
    category = models.CharField(max_length=20, choices=CAT_CHOICES, default='bug')
    assigned_to = models.ForeignKey(settings.AUTH_USER_MODEL, null=True, blank=True, on_delete=models.SET_NULL, related_name='assigned_tickets')
    sla_hours = models.PositiveIntegerField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    class Meta:
        ordering = ['-created_at']
    @property
    def is_overdue(self):
        if self.sla_hours and self.status not in ('resolved','closed'):
            deadline = self.created_at + timezone.timedelta(hours=self.sla_hours)
            return timezone.now() > deadline
        return False

class TicketComment(models.Model):
    ticket = models.ForeignKey(Item, on_delete=models.CASCADE, related_name='comments')
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    text = models.TextField()
    is_internal = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    class Meta:
        ordering = ['created_at']
