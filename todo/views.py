from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from django.db.models import Q
from django.utils import timezone
from .models import Todo, TodoCategory, TodoAttachment
from .serializers import (
    TodoSerializer, TodoCreateSerializer, TodoUpdateStatusSerializer,
    TodoCategorySerializer, TodoAttachmentSerializer, TodoStatsSerializer
)


class TodoViewSet(viewsets.ModelViewSet):
    """
    ViewSet para gestionar ToDos del sistema EcoTrash
    
    Provee operaciones CRUD completas para las tareas:
    - list: Obtener todas las tareas
    - create: Crear nueva tarea
    - retrieve: Obtener tarea específica
    - update: Actualizar tarea completa
    - partial_update: Actualizar campos específicos
    - destroy: Eliminar tarea
    """
    queryset = Todo.objects.all()
    serializer_class = TodoSerializer
    permission_classes = [AllowAny]  # Para desarrollo, cambiar en producción
    
    def get_serializer_class(self):
        """Usar diferentes serializers según la acción"""
        if self.action == 'create':
            return TodoCreateSerializer
        elif self.action == 'update_status':
            return TodoUpdateStatusSerializer
        return TodoSerializer
    
    def get_queryset(self):
        """Filtrar tareas según parámetros de consulta"""
        queryset = Todo.objects.all()
        
        # Filtro por estado
        status_filter = self.request.query_params.get('status', None)
        if status_filter:
            queryset = queryset.filter(status=status_filter)
        
        # Filtro por prioridad
        priority_filter = self.request.query_params.get('priority', None)
        if priority_filter:
            queryset = queryset.filter(priority=priority_filter)
        
        # Filtro por tareas relacionadas con eco
        eco_filter = self.request.query_params.get('eco_related', None)
        if eco_filter is not None:
            is_eco = eco_filter.lower() in ['true', '1', 'yes']
            queryset = queryset.filter(is_eco_related=is_eco)
        
        # Búsqueda por texto
        search = self.request.query_params.get('search', None)
        if search:
            queryset = queryset.filter(
                Q(title__icontains=search) | 
                Q(description__icontains=search) |
                Q(eco_category__icontains=search)
            )
        
        # Filtro por vencidas
        overdue_filter = self.request.query_params.get('overdue', None)
        if overdue_filter is not None and overdue_filter.lower() in ['true', '1', 'yes']:
            queryset = queryset.filter(
                due_date__lt=timezone.now(),
                status__in=['pending', 'in_progress']
            )
        
        return queryset
    
    @action(detail=True, methods=['patch'])
    def update_status(self, request, pk=None):
        """Actualizar solo el estado de una tarea"""
        todo = self.get_object()
        serializer = TodoUpdateStatusSerializer(todo, data=request.data, partial=True)
        
        if serializer.is_valid():
            serializer.save()
            return Response(TodoSerializer(todo).data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['post'])
    def mark_completed(self, request, pk=None):
        """Marcar tarea como completada"""
        todo = self.get_object()
        todo.mark_as_completed()
        return Response(TodoSerializer(todo).data)
    
    @action(detail=False, methods=['get'])
    def stats(self, request):
        """Obtener estadísticas de las tareas"""
        queryset = self.get_queryset()
        
        stats_data = {
            'total_tasks': queryset.count(),
            'pending_tasks': queryset.filter(status='pending').count(),
            'completed_tasks': queryset.filter(status='completed').count(),
            'in_progress_tasks': queryset.filter(status='in_progress').count(),
            'overdue_tasks': queryset.filter(
                due_date__lt=timezone.now(),
                status__in=['pending', 'in_progress']
            ).count(),
            'eco_related_tasks': queryset.filter(is_eco_related=True).count(),
        }
        
        serializer = TodoStatsSerializer(stats_data)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def eco_tasks(self, request):
        """Obtener solo tareas relacionadas con EcoTrash"""
        eco_todos = self.get_queryset().filter(is_eco_related=True)
        serializer = self.get_serializer(eco_todos, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def priority_high(self, request):
        """Obtener tareas de alta prioridad"""
        high_priority_todos = self.get_queryset().filter(priority='high')
        serializer = self.get_serializer(high_priority_todos, many=True)
        return Response(serializer.data)


class TodoCategoryViewSet(viewsets.ModelViewSet):
    """ViewSet para gestionar categorías de ToDo"""
    queryset = TodoCategory.objects.all()
    serializer_class = TodoCategorySerializer
    permission_classes = [AllowAny]


class TodoAttachmentViewSet(viewsets.ModelViewSet):
    """ViewSet para gestionar archivos adjuntos"""
    queryset = TodoAttachment.objects.all()
    serializer_class = TodoAttachmentSerializer
    permission_classes = [AllowAny]
    
    def get_queryset(self):
        """Filtrar por tarea si se especifica"""
        queryset = TodoAttachment.objects.all()
        todo_id = self.request.query_params.get('todo_id', None)
        if todo_id:
            queryset = queryset.filter(todo_id=todo_id)
        return queryset
