"""
URL configuration for examen2 project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include, re_path
from django.conf import settings
from django.conf.urls.static import static
from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi

schema_view = get_schema_view(
    openapi.Info(
        title="ToDo Management API",
        default_version='v1',
        description="API documentation for the ToDo Management System. "
                   "A comprehensive task management system with categories, "
                   "priorities, status tracking, and file attachments.",
        contact=openapi.Contact(email="admin@todoapp.com"),
        license=openapi.License(name="MIT License"),
    ),
    public=True,
    permission_classes=(permissions.AllowAny,),
)

def api_root(request):
    """Vista raíz de la API que muestra información del backend ToDo"""
    from django.http import JsonResponse
    return JsonResponse({
        'message': 'ToDo Management API',
        'version': '1.0.0',
        'endpoints': {
            'todos': '/api/todos/',
            'categories': '/api/categories/',
            'attachments': '/api/attachments/',
            'admin': '/admin/',
            'swagger': '/',
            'redoc': '/redoc/',
        },
        'description': 'Backend para sistema de gestión de tareas ToDo',
        'features': [
            'CRUD de tareas',
            'Gestión de categorías',
            'Archivos adjuntos',
            'Filtros avanzados',
            'Estadísticas'
        ]
    })

urlpatterns = [
    path('api/', include('todo.urls')),  # APIs de ToDo
    path('admin/', admin.site.urls),
    path('', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    path('redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
    path('info/', api_root, name='api_info'),
    re_path(r'^swagger(?P<format>\.json|\.yaml)$', schema_view.without_ui(cache_timeout=0), name='schema-json'),
]

# Serve static and media files during development
if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
