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
    
    class Meta:
        model = TodoCategory
        fields = ['id', 'name', 'description', 'color', 'created_at']
        read_only_fields = ['created_at']


class TodoSerializer(serializers.ModelSerializer):
    """Serializer principal para ToDo"""
    attachments = TodoAttachmentSerializer(many=True, read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    priority_display = serializers.CharField(source='get_priority_display', read_only=True)
    is_overdue = serializers.SerializerMethodField()
    
    class Meta:
        model = Todo
        fields = [
            'id', 'title', 'description', 'priority', 'priority_display',
            'status', 'status_display', 'created_at', 'updated_at',
            'due_date', 'completed_at', 'user', 'is_eco_related',
            'eco_category', 'attachments', 'is_overdue'
        ]
        read_only_fields = ['created_at', 'updated_at', 'completed_at']
    
    def get_is_overdue(self, obj):
        """Método para calcular si la tarea está vencida"""
        return obj.is_overdue()
    
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
            'due_date', 'user', 'is_eco_related', 'eco_category'
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
    overdue_tasks = serializers.IntegerField()
    eco_related_tasks = serializers.IntegerField()
