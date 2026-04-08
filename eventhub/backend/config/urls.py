from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('django-admin/', admin.site.urls),
    path('api/auth/', include('core.urls')),
    path('api/items/', include('items.urls')),
    path('api/ai/', include('ai_module.urls')),
    path('api/admin/', include('core.admin_urls')),
]
