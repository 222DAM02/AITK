from rest_framework import serializers
from .models import Item, Card, StudySession


class CardSerializer(serializers.ModelSerializer):
    class Meta:
        model = Card
        fields = ('id', 'front', 'back', 'order')


class ItemSerializer(serializers.ModelSerializer):
    owner_username = serializers.ReadOnlyField(source='owner.username')
    cards_count = serializers.SerializerMethodField()

    class Meta:
        model = Item
        fields = (
            'id', 'owner', 'owner_username', 'title', 'description',
            # === ТЕМА-СПЕЦИФИЧНЫЕ ПОЛЯ ===
            'category', 'is_public', 'image_url',
            # === КОНЕЦ ===
            'cards_count', 'created_at', 'updated_at',
        )
        read_only_fields = ('id', 'owner', 'owner_username', 'created_at', 'updated_at')

    def get_cards_count(self, obj):
        return obj.cards.count()


class ItemDetailSerializer(ItemSerializer):
    cards = CardSerializer(many=True, read_only=True)

    class Meta(ItemSerializer.Meta):
        fields = ItemSerializer.Meta.fields + ('cards',)


class StudySessionSerializer(serializers.ModelSerializer):
    deck_title = serializers.ReadOnlyField(source='deck.title')
    score_percent = serializers.SerializerMethodField()

    class Meta:
        model = StudySession
        fields = ('id', 'deck', 'deck_title', 'cards_total', 'cards_correct', 'score_percent', 'completed_at')

    def get_score_percent(self, obj):
        if obj.cards_total == 0:
            return 0
        return round(obj.cards_correct / obj.cards_total * 100)
