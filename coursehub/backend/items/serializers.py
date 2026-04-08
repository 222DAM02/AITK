from rest_framework import serializers
from .models import Item, Enrollment


class ItemSerializer(serializers.ModelSerializer):
    owner_username = serializers.ReadOnlyField(source='owner.username')
    enrolled_count = serializers.SerializerMethodField()

    class Meta:
        model = Item
        fields = (
            'id', 'owner', 'owner_username', 'title', 'description',
            # === ТЕМА-СПЕЦИФИЧНЫЕ ПОЛЯ ===
            'category', 'level', 'duration_hours', 'lessons_count', 'image_url',
            # === КОНЕЦ ===
            'enrolled_count', 'created_at', 'updated_at',
        )
        read_only_fields = ('id', 'owner', 'owner_username', 'created_at', 'updated_at')

    def get_enrolled_count(self, obj):
        return obj.enrollments.count()


class EnrollmentSerializer(serializers.ModelSerializer):
    course_title = serializers.ReadOnlyField(source='course.title')

    class Meta:
        model = Enrollment
        fields = ('id', 'course', 'course_title', 'progress', 'enrolled_at')
        read_only_fields = ('id', 'enrolled_at')
