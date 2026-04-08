from django.db import models
from django.conf import settings


class Item(models.Model):
    SUBJECT_CHOICES = [
        ('math', 'Математика'),
        ('physics', 'Физика'),
        ('chemistry', 'Химия'),
        ('biology', 'Биология'),
        ('history', 'История'),
        ('literature', 'Литература'),
        ('cs', 'Информатика'),
        ('languages', 'Языки'),
        ('philosophy', 'Философия'),
        ('other', 'Другое'),
    ]

    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='items')
    title = models.CharField(max_length=200)
    description = models.TextField()
    subject = models.CharField(max_length=20, choices=SUBJECT_CHOICES, default='other')
    tags = models.CharField(max_length=500, blank=True, default='')
    is_pinned = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-is_pinned', '-created_at']

    def __str__(self):
        return self.title

    @property
    def tags_list(self):
        if not self.tags:
            return []
        return [t.strip() for t in self.tags.split(',') if t.strip()]
