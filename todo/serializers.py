from rest_framework import serializers
from .models import Todo, TodoCategory, TodoAttachment


class TodoAttachmentSerializer(serializers.ModelSerializer):
    """Serializer para archivos adjuntos"""
    
    class Meta:
        model = TodoAttachment
        fields = ['id', 'filename', 'file', 'uploaded_at']
        read_only_fields = ['uploaded_at']


class TodoCategorySerializer(serializers.ModelSerializer):
    """Serializer para categorías de ToDo"""
    tasks_count = serializers.SerializerMethodField()
    
    class Meta:
        model = TodoCategory
        fields = ['id', 'name', 'description', 'color', 'icon', 'created_at', 'tasks_count']
        read_only_fields = ['created_at']
    
    def get_tasks_count(self, obj):
        """Contar tareas en esta categoría"""
        return obj.todo_set.count()


class TodoSerializer(serializers.ModelSerializer):
    """Serializer principal para ToDo"""
    attachments = TodoAttachmentSerializer(many=True, read_only=True)
    category_details = TodoCategorySerializer(source='category', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    priority_display = serializers.CharField(source='get_priority_display', read_only=True)
    is_overdue = serializers.SerializerMethodField()
    days_until_due = serializers.SerializerMethodField()
    
    class Meta:
        model = Todo
        fields = [
            'id', 'title', 'description', 'priority', 'priority_display',
            'status', 'status_display', 'created_at', 'updated_at',
            'due_date', 'completed_at', 'user', 'category', 'category_details',
            'attachments', 'is_overdue', 'days_until_due'
        ]
        read_only_fields = ['created_at', 'updated_at', 'completed_at']
    
    def get_is_overdue(self, obj):
        """Método para calcular si la tarea está vencida"""
        return obj.is_overdue()
    
    def get_days_until_due(self, obj):
        """Calcular días hasta la fecha límite"""
        if not obj.due_date:
            return None
        from django.utils import timezone
        delta = obj.due_date.date() - timezone.now().date()
        return delta.days
    
    def create(self, validated_data):
        """Crear nueva tarea"""
        return Todo.objects.create(**validated_data)
    
    def update(self, instance, validated_data):
        """Actualizar tarea existente"""
        # Si se marca como completada, establecer la fecha de completado
        if validated_data.get('status') == 'completed' and instance.status != 'completed':
            from django.utils import timezone
            validated_data['completed_at'] = timezone.now()
        elif validated_data.get('status') != 'completed':
            validated_data['completed_at'] = None
            
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance


class TodoCreateSerializer(serializers.ModelSerializer):
    """Serializer simplificado para crear ToDos"""
    
    class Meta:
        model = Todo
        fields = [
            'title', 'description', 'priority', 'status',
            'due_date', 'user', 'category'
        ]


class TodoUpdateStatusSerializer(serializers.ModelSerializer):
    """Serializer para actualizar solo el estado de una tarea"""
    
    class Meta:
        model = Todo
        fields = ['status']
    
    def update(self, instance, validated_data):
        """Actualizar solo el estado"""
        new_status = validated_data.get('status')
        if new_status == 'completed' and instance.status != 'completed':
            from django.utils import timezone
            instance.completed_at = timezone.now()
        elif new_status != 'completed':
            instance.completed_at = None
            
        instance.status = new_status
        instance.save()
        return instance


class TodoStatsSerializer(serializers.Serializer):
    """Serializer para estadísticas de ToDo"""
    total_tasks = serializers.IntegerField()
    pending_tasks = serializers.IntegerField()
    completed_tasks = serializers.IntegerField()
    in_progress_tasks = serializers.IntegerField()
    cancelled_tasks = serializers.IntegerField()
    overdue_tasks = serializers.IntegerField()
    completion_rate = serializers.FloatField()
    tasks_by_priority = serializers.DictField()
    tasks_by_category = serializers.DictField()
