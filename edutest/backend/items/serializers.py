from rest_framework import serializers
from .models import Item, Question, TestResult

class QuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Question
        fields = ('id', 'text', 'option_a', 'option_b', 'option_c', 'option_d', 'correct', 'order')
        read_only_fields = ('id',)

class QuestionPublicSerializer(serializers.ModelSerializer):
    class Meta:
        model = Question
        fields = ('id', 'text', 'option_a', 'option_b', 'option_c', 'option_d', 'order')

class TestResultSerializer(serializers.ModelSerializer):
    username = serializers.ReadOnlyField(source='user.username')
    percentage = serializers.SerializerMethodField()
    def get_percentage(self, obj):
        return round(obj.score / obj.total * 100) if obj.total else 0
    class Meta:
        model = TestResult
        fields = ('id', 'user', 'username', 'score', 'total', 'percentage', 'time_spent', 'completed_at')
        read_only_fields = ('id', 'user', 'username', 'completed_at')

class ItemSerializer(serializers.ModelSerializer):
    owner_username = serializers.ReadOnlyField(source='owner.username')
    questions_count = serializers.SerializerMethodField()
    avg_score = serializers.SerializerMethodField()

    def get_questions_count(self, obj):
        return obj.questions.count()

    def get_avg_score(self, obj):
        from django.db.models import Avg
        avg = obj.results.aggregate(a=Avg('score'))['a']
        return round(avg, 1) if avg else None

    class Meta:
        model = Item
        fields = ('id', 'owner', 'owner_username', 'title', 'description', 'category', 'difficulty',
                  'time_limit', 'is_published', 'questions_count', 'avg_score', 'created_at', 'updated_at')
        read_only_fields = ('id', 'owner', 'owner_username', 'created_at', 'updated_at')

class ItemDetailSerializer(ItemSerializer):
    questions = QuestionSerializer(many=True, read_only=True)
    results = TestResultSerializer(many=True, read_only=True)
    class Meta(ItemSerializer.Meta):
        fields = ItemSerializer.Meta.fields + ('questions', 'results')
