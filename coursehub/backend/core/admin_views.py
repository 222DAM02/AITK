from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth import get_user_model

from .permissions import IsAdmin
from .serializers import AdminUserSerializer
from items.models import Item
from items.serializers import ItemSerializer

User = get_user_model()


class AdminUserListView(generics.ListAPIView):
    queryset = User.objects.all().order_by('-date_joined')
    serializer_class = AdminUserSerializer
    permission_classes = [IsAuthenticated, IsAdmin]


class AdminUserBlockView(APIView):
    permission_classes = [IsAuthenticated, IsAdmin]

    def patch(self, request, pk):
        try:
            user = User.objects.get(pk=pk)
        except User.DoesNotExist:
            return Response({"detail": "Пользователь не найден."}, status=status.HTTP_404_NOT_FOUND)
        user.is_blocked = not user.is_blocked
        user.is_active = not user.is_blocked
        user.save()
        return Response(AdminUserSerializer(user).data)


class AdminItemListView(generics.ListAPIView):
    queryset = Item.objects.all().order_by('-created_at')
    serializer_class = ItemSerializer
    permission_classes = [IsAuthenticated, IsAdmin]


class AdminItemDeleteView(generics.DestroyAPIView):
    queryset = Item.objects.all()
    serializer_class = ItemSerializer
    permission_classes = [IsAuthenticated, IsAdmin]
