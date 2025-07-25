from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

# Crear el router para las APIs
router = DefaultRouter()
router.register(r'todos', views.TodoViewSet)
router.register(r'categories', views.TodoCategoryViewSet)
router.register(r'attachments', views.TodoAttachmentViewSet)
router.register(r'users', views.UserViewSet)

# Definir patrones de URL
urlpatterns = [
    path('', include(router.urls)),
]

# URLs adicionales personalizadas si las necesitas
app_name = 'todo'
