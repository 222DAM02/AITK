from rest_framework import serializers
from .models import Item, Word, QuizResult


class WordSerializer(serializers.ModelSerializer):
    class Meta:
        model = Word
        fields = ('id', 'deck', 'word', 'translation', 'example_sentence', 'mastery', 'order')
        read_only_fields = ('id', 'deck')


class ItemSerializer(serializers.ModelSerializer):
    owner_username = serializers.ReadOnlyField(source='owner.username')
    words_count = serializers.IntegerField(read_only=True, default=0)

    class Meta:
        model = Item
        fields = (
            'id', 'owner', 'owner_username', 'title', 'description',
            'language', 'category', 'words_count',
            'created_at', 'updated_at',
        )
        read_only_fields = ('id', 'owner', 'owner_username', 'created_at', 'updated_at')


class ItemDetailSerializer(ItemSerializer):
    words = WordSerializer(many=True, read_only=True)

    class Meta(ItemSerializer.Meta):
        fields = ItemSerializer.Meta.fields + ('words',)


class QuizResultSerializer(serializers.ModelSerializer):
    score_percent = serializers.SerializerMethodField()

    class Meta:
        model = QuizResult
        fields = ('id', 'user', 'deck', 'total_questions', 'correct_answers', 'score_percent', 'created_at')
        read_only_fields = ('id', 'user', 'created_at')

    def get_score_percent(self, obj):
        if obj.total_questions == 0:
            return 0
        return round(obj.correct_answers / obj.total_questions * 100, 1)
