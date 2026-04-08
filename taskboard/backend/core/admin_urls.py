from django.urls import path

from .admin_views import AdminUserListView, AdminUserBlockView, AdminItemListView, AdminItemDeleteView

urlpatterns = [
    path('users/', AdminUserListView.as_view(), name='admin-users'),
    path('users/<int:pk>/block/', AdminUserBlockView.as_view(), name='admin-user-block'),
    path('items/', AdminItemListView.as_view(), name='admin-items'),
    path('items/<int:pk>/', AdminItemDeleteView.as_view(), name='admin-item-delete'),
]
