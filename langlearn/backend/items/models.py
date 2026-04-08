from django.db import models
from django.conf import settings


class Item(models.Model):
    LANGUAGE_CHOICES = [
        ('en', 'English'),
        ('de', 'Deutsch'),
        ('fr', 'Français'),
        ('es', 'Español'),
        ('ja', '日本語'),
        ('zh', '中文'),
        ('ko', '한국어'),
        ('other', 'Other'),
    ]

    CATEGORY_CHOICES = [
        ('general', 'Общее'),
        ('travel', 'Путешествия'),
        ('business', 'Бизнес'),
        ('tech', 'Технологии'),
        ('food', 'Еда'),
        ('medicine', 'Медицина'),
    ]

    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='items')
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True, default='')
    language = models.CharField(max_length=10, choices=LANGUAGE_CHOICES, default='en')
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES, default='general')

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.title


class Word(models.Model):
    MASTERY_CHOICES = [
        ('new', 'New'),
        ('learning', 'Learning'),
        ('learned', 'Learned'),
    ]

    deck = models.ForeignKey(Item, on_delete=models.CASCADE, related_name='words')
    word = models.CharField(max_length=200)
    translation = models.CharField(max_length=200)
    example_sentence = models.TextField(blank=True, default='')
    mastery = models.CharField(max_length=10, choices=MASTERY_CHOICES, default='new')
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order', 'id']

    def __str__(self):
        return f'{self.word} — {self.translation}'


class QuizResult(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='quiz_results')
    deck = models.ForeignKey(Item, on_delete=models.CASCADE, related_name='quiz_results')
    total_questions = models.PositiveIntegerField()
    correct_answers = models.PositiveIntegerField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f'{self.user} — {self.deck} — {self.correct_answers}/{self.total_questions}'
