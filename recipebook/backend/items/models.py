from django.db import models
from django.conf import settings


class Item(models.Model):
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='items')
    title = models.CharField(max_length=200)
    description = models.TextField()

    ingredients = models.TextField(blank=True, default='')
    cooking_time = models.PositiveIntegerField(null=True, blank=True)
    image_url = models.URLField(blank=True, default='')

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.title
