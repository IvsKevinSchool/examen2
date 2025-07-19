from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from django.db.models import Q, Count
from django.utils import timezone
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from .models import Todo, TodoCategory, TodoAttachment
from .serializers import (
    TodoSerializer, TodoCreateSerializer, TodoUpdateStatusSerializer,
    TodoCategorySerializer, TodoAttachmentSerializer, TodoStatsSerializer
)


class TodoViewSet(viewsets.ModelViewSet):
    """
    ViewSet para gestionar ToDos del sistema
    
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
    
    @swagger_auto_schema(
        manual_parameters=[
            openapi.Parameter('status', openapi.IN_QUERY, description="Filtrar por estado (pending, in_progress, completed, cancelled)", type=openapi.TYPE_STRING),
            openapi.Parameter('priority', openapi.IN_QUERY, description="Filtrar por prioridad (low, medium, high, urgent)", type=openapi.TYPE_STRING),
            openapi.Parameter('category', openapi.IN_QUERY, description="Filtrar por categoría (ID)", type=openapi.TYPE_INTEGER),
            openapi.Parameter('search', openapi.IN_QUERY, description="Buscar en título/descripción", type=openapi.TYPE_STRING),
            openapi.Parameter('overdue', openapi.IN_QUERY, description="Filtrar tareas vencidas", type=openapi.TYPE_BOOLEAN),
            openapi.Parameter('user', openapi.IN_QUERY, description="Filtrar por usuario (ID)", type=openapi.TYPE_INTEGER),
        ],
        operation_description="Obtener lista de tareas con filtros opcionales"
    )
    def list(self, request, *args, **kwargs):
        """Obtener lista de tareas con filtros"""
        return super().list(request, *args, **kwargs)
    
    def get_queryset(self):
        """Filtrar tareas según parámetros de consulta"""
        queryset = Todo.objects.select_related('category', 'user').prefetch_related('attachments')
        
        # Filtro por estado
        status_filter = self.request.query_params.get('status', None)
        if status_filter:
            queryset = queryset.filter(status=status_filter)
        
        # Filtro por prioridad
        priority_filter = self.request.query_params.get('priority', None)
        if priority_filter:
            queryset = queryset.filter(priority=priority_filter)
        
        # Filtro por categoría
        category_filter = self.request.query_params.get('category', None)
        if category_filter:
            queryset = queryset.filter(category_id=category_filter)
        
        # Filtro por usuario
        user_filter = self.request.query_params.get('user', None)
        if user_filter:
            queryset = queryset.filter(user_id=user_filter)
        
        # Búsqueda por texto
        search = self.request.query_params.get('search', None)
        if search:
            queryset = queryset.filter(
                Q(title__icontains=search) | 
                Q(description__icontains=search)
            )
        
        # Filtro por vencidas
        overdue_filter = self.request.query_params.get('overdue', None)
        if overdue_filter is not None and overdue_filter.lower() in ['true', '1', 'yes']:
            queryset = queryset.filter(
                due_date__lt=timezone.now(),
                status__in=['pending', 'in_progress']
            )
        
        return queryset
    
    @swagger_auto_schema(
        request_body=TodoUpdateStatusSerializer,
        responses={200: TodoSerializer},
        operation_description="Actualizar solo el estado de una tarea específica"
    )
    @action(detail=True, methods=['patch'])
    def update_status(self, request, pk=None):
        """Actualizar solo el estado de una tarea"""
        todo = self.get_object()
        serializer = TodoUpdateStatusSerializer(todo, data=request.data, partial=True)
        
        if serializer.is_valid():
            serializer.save()
            return Response(TodoSerializer(todo).data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @swagger_auto_schema(
        method='post',
        responses={200: TodoSerializer},
        operation_description="Marcar una tarea como completada automáticamente"
    )
    @action(detail=True, methods=['post'])
    def mark_completed(self, request, pk=None):
        """Marcar tarea como completada"""
        todo = self.get_object()
        todo.mark_as_completed()
        return Response(TodoSerializer(todo).data)
    
    @swagger_auto_schema(
        method='get',
        responses={200: TodoStatsSerializer},
        operation_description="Obtener estadísticas generales de las tareas"
    )
    @action(detail=False, methods=['get'])
    def stats(self, request):
        """Obtener estadísticas de las tareas"""
        queryset = self.get_queryset()
        total_tasks = queryset.count()
        
        # Estadísticas por estado
        pending_tasks = queryset.filter(status='pending').count()
        completed_tasks = queryset.filter(status='completed').count()
        in_progress_tasks = queryset.filter(status='in_progress').count()
        cancelled_tasks = queryset.filter(status='cancelled').count()
        
        # Tareas vencidas
        overdue_tasks = queryset.filter(
            due_date__lt=timezone.now(),
            status__in=['pending', 'in_progress']
        ).count()
        
        # Tasa de completado
        completion_rate = (completed_tasks / total_tasks * 100) if total_tasks > 0 else 0
        
        # Estadísticas por prioridad
        priority_stats = queryset.values('priority').annotate(count=Count('priority'))
        tasks_by_priority = {item['priority']: item['count'] for item in priority_stats}
        
        # Estadísticas por categoría
        category_stats = queryset.values('category__name').annotate(count=Count('category'))
        tasks_by_category = {item['category__name'] or 'Sin categoría': item['count'] for item in category_stats}
        
        stats_data = {
            'total_tasks': total_tasks,
            'pending_tasks': pending_tasks,
            'completed_tasks': completed_tasks,
            'in_progress_tasks': in_progress_tasks,
            'cancelled_tasks': cancelled_tasks,
            'overdue_tasks': overdue_tasks,
            'completion_rate': round(completion_rate, 2),
            'tasks_by_priority': tasks_by_priority,
            'tasks_by_category': tasks_by_category,
        }
        
        serializer = TodoStatsSerializer(stats_data)
        return Response(serializer.data)
    
    @swagger_auto_schema(
        method='get',
        responses={200: TodoSerializer(many=True)},
        operation_description="Obtener tareas de alta prioridad"
    )
    @action(detail=False, methods=['get'])
    def high_priority(self, request):
        """Obtener tareas de alta prioridad"""
        high_priority_todos = self.get_queryset().filter(priority__in=['high', 'urgent'])
        serializer = self.get_serializer(high_priority_todos, many=True)
        return Response(serializer.data)
    
    @swagger_auto_schema(
        method='get',
        responses={200: TodoSerializer(many=True)},
        operation_description="Obtener tareas vencidas"
    )
    @action(detail=False, methods=['get'])
    def overdue(self, request):
        """Obtener tareas vencidas"""
        overdue_todos = self.get_queryset().filter(
            due_date__lt=timezone.now(),
            status__in=['pending', 'in_progress']
        )
        serializer = self.get_serializer(overdue_todos, many=True)
        return Response(serializer.data)


@swagger_auto_schema(tags=['Categories'])
class TodoCategoryViewSet(viewsets.ModelViewSet):
    """ViewSet para gestionar categorías de ToDo"""
    queryset = TodoCategory.objects.all()
    serializer_class = TodoCategorySerializer
    permission_classes = [AllowAny]


@swagger_auto_schema(tags=['Attachments'])
class TodoAttachmentViewSet(viewsets.ModelViewSet):
    """ViewSet para gestionar archivos adjuntos"""
    queryset = TodoAttachment.objects.all()
    serializer_class = TodoAttachmentSerializer
    permission_classes = [AllowAny]
    
    @swagger_auto_schema(
        manual_parameters=[
            openapi.Parameter('todo_id', openapi.IN_QUERY, description="ID de la tarea", type=openapi.TYPE_INTEGER),
        ],
        operation_description="Obtener archivos adjuntos, opcionalmente filtrados por tarea"
    )
    def list(self, request, *args, **kwargs):
        """Obtener lista de archivos adjuntos"""
        return super().list(request, *args, **kwargs)
    
    def get_queryset(self):
        """Filtrar por tarea si se especifica"""
        queryset = TodoAttachment.objects.all()
        todo_id = self.request.query_params.get('todo_id', None)
        if todo_id:
            queryset = queryset.filter(todo_id=todo_id)
        return queryset
