from django.db import models
from django.conf import settings
from django.utils import timezone


class Item(models.Model):  # Test
    DIFFICULTY_CHOICES = [
        ('easy', 'Лёгкий'), ('medium', 'Средний'), ('hard', 'Сложный'),
    ]
    CATEGORY_CHOICES = [
        ('general', 'Общие знания'), ('science', 'Наука'), ('history', 'История'),
        ('geography', 'География'), ('math', 'Математика'), ('literature', 'Литература'),
        ('computers', 'IT и компьютеры'), ('sports', 'Спорт'), ('art', 'Искусство'),
    ]

    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='items')
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True, default='')
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES, default='general')
    difficulty = models.CharField(max_length=10, choices=DIFFICULTY_CHOICES, default='medium')
    time_limit = models.PositiveIntegerField(null=True, blank=True, help_text="Минуты")
    is_published = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.title


class Question(models.Model):
    test = models.ForeignKey(Item, on_delete=models.CASCADE, related_name='questions')
    text = models.TextField()
    option_a = models.CharField(max_length=500)
    option_b = models.CharField(max_length=500)
    option_c = models.CharField(max_length=500, blank=True, default='')
    option_d = models.CharField(max_length=500, blank=True, default='')
    correct = models.CharField(max_length=1, default='a')  # a/b/c/d
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order']


class TestResult(models.Model):
    test = models.ForeignKey(Item, on_delete=models.CASCADE, related_name='results')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='test_results')
    score = models.PositiveIntegerField(default=0)
    total = models.PositiveIntegerField(default=0)
    answers = models.JSONField(default=dict)
    completed_at = models.DateTimeField(auto_now_add=True)
    time_spent = models.PositiveIntegerField(default=0)  # seconds

    class Meta:
        ordering = ['-completed_at']
