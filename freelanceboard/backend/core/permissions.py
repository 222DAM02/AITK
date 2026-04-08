from rest_framework.permissions import BasePermission


class IsAdmin(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'admin'


class IsOwner(BasePermission):
    def has_object_permission(self, request, view, obj):
        return obj.owner == request.user


class IsNotBlocked(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and not request.user.is_blocked
