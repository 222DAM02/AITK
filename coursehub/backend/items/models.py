from django.db import models
from django.conf import settings


class Item(models.Model):
    LEVEL_CHOICES = (
        ('beginner', 'Начальный'),
        ('intermediate', 'Средний'),
        ('advanced', 'Продвинутый'),
    )
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='items')
    title = models.CharField(max_length=200)
    description = models.TextField()

    # === ТЕМА-СПЕЦИФИЧНЫЕ ПОЛЯ ===
    category = models.CharField(max_length=100, blank=True, default='')
    level = models.CharField(max_length=20, choices=LEVEL_CHOICES, default='beginner')
    duration_hours = models.PositiveIntegerField(null=True, blank=True, help_text='Длительность курса в часах')
    lessons_count = models.PositiveIntegerField(default=0, help_text='Количество уроков')
    image_url = models.URLField(blank=True, default='')
    # === КОНЕЦ ТЕМА-СПЕЦИФИЧНЫХ ПОЛЕЙ ===

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.title


class Enrollment(models.Model):
    """Запись пользователя на курс + прогресс"""
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='enrollments')
    course = models.ForeignKey(Item, on_delete=models.CASCADE, related_name='enrollments')
    progress = models.PositiveIntegerField(default=0, help_text='Прогресс в процентах (0-100)')
    enrolled_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'course')
        ordering = ['-enrolled_at']

    def __str__(self):
        return f"{self.user.username} -> {self.course.title} ({self.progress}%)"
