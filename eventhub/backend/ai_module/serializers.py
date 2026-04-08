from rest_framework import serializers
from .models import AIQuery, KnowledgeBase

class AIQuerySerializer(serializers.ModelSerializer):
    class Meta:
        model = AIQuery
        fields = ('id', 'prompt', 'result', 'sources', 'created_at')
        read_only_fields = ('id', 'result', 'sources', 'created_at')

class AIGenerateSerializer(serializers.Serializer):
    prompt = serializers.CharField(min_length=3, max_length=2000)

class AISaveAsItemSerializer(serializers.Serializer):
    query_id = serializers.IntegerField()
    title = serializers.CharField(max_length=200)

class KnowledgeBaseSerializer(serializers.ModelSerializer):
    class Meta:
        model = KnowledgeBase
        fields = ('id', 'title', 'content', 'source', 'category', 'created_at')
