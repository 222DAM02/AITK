from django.db import models
from django.conf import settings


class Item(models.Model):
    """Колода карточек"""
    CATEGORY_CHOICES = (
        ('languages', 'Иностранные языки'),
        ('science', 'Наука'),
        ('history', 'История'),
        ('programming', 'Программирование'),
        ('math', 'Математика'),
        ('other', 'Другое'),
    )
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='items')
    title = models.CharField(max_length=200)
    description = models.TextField()

    # === ТЕМА-СПЕЦИФИЧНЫЕ ПОЛЯ ===
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES, default='other')
    is_public = models.BooleanField(default=True, help_text='Видна всем пользователям')
    image_url = models.URLField(blank=True, default='')
    # === КОНЕЦ ТЕМА-СПЕЦИФИЧНЫХ ПОЛЕЙ ===

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.title


class Card(models.Model):
    """Карточка внутри колоды (лицо + обратная сторона)"""
    deck = models.ForeignKey(Item, on_delete=models.CASCADE, related_name='cards')
    front = models.TextField(help_text='Вопрос / лицевая сторона')
    back = models.TextField(help_text='Ответ / обратная сторона')
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order', 'id']

    def __str__(self):
        return f"{self.front[:50]}"


class StudySession(models.Model):
    """Сессия изучения колоды"""
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='study_sessions')
    deck = models.ForeignKey(Item, on_delete=models.CASCADE, related_name='study_sessions')
    cards_total = models.PositiveIntegerField(default=0)
    cards_correct = models.PositiveIntegerField(default=0)
    completed_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-completed_at']

    def __str__(self):
        return f"{self.user.username} — {self.deck.title} ({self.cards_correct}/{self.cards_total})"
