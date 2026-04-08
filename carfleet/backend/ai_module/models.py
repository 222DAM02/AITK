from django.db import models
from django.conf import settings

class AIQuery(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='ai_queries')
    prompt = models.TextField()
    result = models.TextField()
    sources = models.JSONField(default=list, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    class Meta:
        ordering = ['-created_at']

class KnowledgeBase(models.Model):
    title = models.CharField(max_length=300)
    content = models.TextField()
    source = models.CharField(max_length=500, blank=True, default='')
    category = models.CharField(max_length=100, blank=True, default='')
    embedding = models.JSONField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    class Meta:
        ordering = ['-created_at']
