from django.contrib import admin
from .models import Todo, TodoCategory, TodoAttachment


@admin.register(Todo)
class TodoAdmin(admin.ModelAdmin):
    """Configuración del admin para ToDo"""
    list_display = [
        'title', 'status', 'priority', 'category', 
        'user', 'created_at', 'due_date', 'is_overdue'
    ]
    list_filter = [
        'status', 'priority', 'category', 'created_at', 'due_date', 'user'
    ]
    search_fields = ['title', 'description', 'category__name']
    readonly_fields = ['created_at', 'updated_at', 'completed_at']
    autocomplete_fields = ['category', 'user']
    
    fieldsets = (
        ('Información Principal', {
            'fields': ('title', 'description', 'user', 'category')
        }),
        ('Estado y Prioridad', {
            'fields': ('status', 'priority', 'due_date')
        }),
        ('Fechas', {
            'fields': ('created_at', 'updated_at', 'completed_at'),
            'classes': ('collapse',)
        })
    )
    
    def is_overdue(self, obj):
        """Mostrar si la tarea está vencida"""
        return obj.is_overdue()
    is_overdue.boolean = True
    is_overdue.short_description = 'Vencida'
    
    def get_queryset(self, request):
        """Optimizar consultas"""
        return super().get_queryset(request).select_related('category', 'user')


@admin.register(TodoCategory)
class TodoCategoryAdmin(admin.ModelAdmin):
    """Configuración del admin para categorías"""
    list_display = ['name', 'description', 'color', 'icon', 'tasks_count', 'created_at']
    search_fields = ['name', 'description']
    readonly_fields = ['created_at']
    
    def tasks_count(self, obj):
        """Mostrar número de tareas en esta categoría"""
        return obj.todo_set.count()
    tasks_count.short_description = 'Número de tareas'


@admin.register(TodoAttachment)
class TodoAttachmentAdmin(admin.ModelAdmin):
    """Configuración del admin para archivos adjuntos"""
    list_display = ['filename', 'todo', 'uploaded_at']
    list_filter = ['uploaded_at']
    search_fields = ['filename', 'todo__title']
    readonly_fields = ['uploaded_at']
    autocomplete_fields = ['todo']
