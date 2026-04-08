from rest_framework import serializers
from django.contrib.auth import get_user_model

User = get_user_model()


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=6)
    password2 = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'password', 'password2')

    def validate_email(self, value):
        if not value:
            raise serializers.ValidationError("Email обязателен.")
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("Этот email уже зарегистрирован.")
        return value

    def validate(self, data):
        if data['password'] != data['password2']:
            raise serializers.ValidationError({"password2": "Пароли не совпадают."})
        return data

    def create(self, validated_data):
        validated_data.pop('password2')
        return User.objects.create_user(**validated_data)


class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'role', 'date_joined')
        read_only_fields = ('id', 'role', 'date_joined')


class AdminUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'role', 'is_blocked', 'date_joined', 'is_active')
        read_only_fields = ('id', 'username', 'email', 'date_joined')
