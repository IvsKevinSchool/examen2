from django.db import models
from django.contrib.auth.models import User

class Todo(models.Model):
    """
    Modelo para las tareas del sistema ToDo
    """
    PRIORITY_CHOICES = [
        ('low', 'Baja'),
        ('medium', 'Media'),
        ('high', 'Alta'),
        ('urgent', 'Urgente'),
    ]
    
    STATUS_CHOICES = [
        ('pending', 'Pendiente'),
        ('in_progress', 'En Progreso'),
        ('completed', 'Completada'),
        ('cancelled', 'Cancelada'),
    ]
    
    title = models.CharField(max_length=200, verbose_name="Título")
    description = models.TextField(blank=True, null=True, verbose_name="Descripción")
    priority = models.CharField(
        max_length=10, 
        choices=PRIORITY_CHOICES, 
        default='medium',
        verbose_name="Prioridad"
    )
    status = models.CharField(
        max_length=15, 
        choices=STATUS_CHOICES, 
        default='pending',
        verbose_name="Estado"
    )
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Fecha de creación")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="Fecha de actualización")
    due_date = models.DateTimeField(blank=True, null=True, verbose_name="Fecha límite")
    completed_at = models.DateTimeField(blank=True, null=True, verbose_name="Fecha de completado")
    
    # Relación con usuario
    user = models.ForeignKey(
        User, 
        on_delete=models.CASCADE, 
        blank=True, 
        null=True,
        verbose_name="Usuario asignado"
    )
    
    # Campos adicionales para organización
    category = models.ForeignKey(
        'TodoCategory',
        on_delete=models.SET_NULL,
        blank=True,
        null=True,
        verbose_name="Categoría"
    )
    
    class Meta:
        ordering = ['-created_at', '-priority']
        verbose_name = "Tarea"
        verbose_name_plural = "Tareas"
    
    def __str__(self):
        return f"{self.title} - {self.get_status_display()}"
    
    def mark_as_completed(self):
        """Marca la tarea como completada"""
        from django.utils import timezone
        self.status = 'completed'
        self.completed_at = timezone.now()
        self.save()
    
    def is_overdue(self):
        """Verifica si la tarea está vencida"""
        from django.utils import timezone
        if self.due_date and self.status != 'completed':
            return timezone.now() > self.due_date
        return False


class TodoCategory(models.Model):
    """
    Categorías para organizar las tareas ToDo
    """
    name = models.CharField(max_length=100, unique=True, verbose_name="Nombre")
    description = models.TextField(blank=True, null=True, verbose_name="Descripción")
    color = models.CharField(
        max_length=7, 
        default='#007bff',
        verbose_name="Color",
        help_text="Color en formato hexadecimal (#ffffff)"
    )
    icon = models.CharField(
        max_length=50,
        blank=True,
        null=True,
        verbose_name="Icono",
        help_text="Nombre del icono (ej: work, home, shopping)"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        verbose_name = "Categoría"
        verbose_name_plural = "Categorías"
        ordering = ['name']
    
    def __str__(self):
        return self.name


class TodoAttachment(models.Model):
    """
    Archivos adjuntos para las tareas
    """
    todo = models.ForeignKey(
        Todo, 
        on_delete=models.CASCADE, 
        related_name='attachments',
        verbose_name="Tarea"
    )
    file = models.FileField(
        upload_to='todo_attachments/',
        verbose_name="Archivo"
    )
    filename = models.CharField(max_length=255, verbose_name="Nombre del archivo")
    uploaded_at = models.DateTimeField(auto_now_add=True, verbose_name="Fecha de subida")
    
    class Meta:
        verbose_name = "Archivo adjunto"
        verbose_name_plural = "Archivos adjuntos"
    
    def __str__(self):
        return f"{self.filename} - {self.todo.title}"
