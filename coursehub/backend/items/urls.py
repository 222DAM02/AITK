from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ItemViewSet, MyEnrollmentsView

router = DefaultRouter()
router.register('', ItemViewSet, basename='item')

urlpatterns = [
    path('enrollments/', MyEnrollmentsView.as_view({'get': 'list'}), name='my-enrollments'),
    path('', include(router.urls)),
]
