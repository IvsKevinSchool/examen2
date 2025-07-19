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
from django.urls import path, include
from django.http import JsonResponse

def api_root(request):
    """Vista raíz de la API que muestra información del backend EcoTrash"""
    return JsonResponse({
        'message': 'EcoTrash Backend API',
        'version': '1.0.0',
        'endpoints': {
            'todos': '/todo/api/todos/',
            'categories': '/todo/api/categories/',
            'attachments': '/todo/api/attachments/',
            'admin': '/admin/',
            'api_docs': '/api/docs/',
        },
        'description': 'Backend para sistema de gestión de tareas EcoTrash'
    })

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', api_root, name='api_root'),
    path('todo/', include('todo.urls')),
    path('api/', api_root, name='api_info'),
]
