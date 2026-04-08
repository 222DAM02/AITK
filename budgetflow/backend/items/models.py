from django.db import models
from django.conf import settings
from django.utils import timezone


class Item(models.Model):  # Transaction
    TYPE_CHOICES = [('income', 'Доход'), ('expense', 'Расход')]
    CATEGORY_CHOICES = [
        ('salary', 'Зарплата'), ('freelance', 'Фриланс'), ('investment', 'Инвестиции'), ('other_income', 'Прочий доход'),
        ('food', 'Еда'), ('transport', 'Транспорт'), ('housing', 'Жильё'), ('utilities', 'Коммунальные'),
        ('health', 'Здоровье'), ('education', 'Образование'), ('entertainment', 'Развлечения'),
        ('clothing', 'Одежда'), ('savings', 'Накопления'), ('other_expense', 'Прочий расход'),
    ]

    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='items')
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True, default='')
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    type = models.CharField(max_length=10, choices=TYPE_CHOICES, default='expense')
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES, default='other_expense')
    currency = models.CharField(max_length=3, default='RUB')
    date = models.DateField(default=timezone.now)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-date', '-created_at']

    def __str__(self):
        return f"{self.title} ({self.amount} {self.currency})"


class Budget(models.Model):
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='budgets')
    category = models.CharField(max_length=20, choices=Item.CATEGORY_CHOICES)
    limit_amount = models.DecimalField(max_digits=12, decimal_places=2)
    month = models.DateField()  # first day of month

    class Meta:
        unique_together = ['owner', 'category', 'month']
        ordering = ['-month']

    def __str__(self):
        return f"Budget {self.category} — {self.limit_amount}"
