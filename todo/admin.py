from django.contrib import admin
from .models import Todo, TodoCategory, TodoAttachment


@admin.register(Todo)
class TodoAdmin(admin.ModelAdmin):
    """Configuración del admin para ToDo"""
    list_display = [
        'title', 'status', 'priority', 'is_eco_related', 
        'user', 'created_at', 'due_date', 'is_overdue'
    ]
    list_filter = [
        'status', 'priority', 'is_eco_related', 'created_at', 'due_date'
    ]
    search_fields = ['title', 'description', 'eco_category']
    readonly_fields = ['created_at', 'updated_at', 'completed_at']
    
    fieldsets = (
        ('Información Principal', {
            'fields': ('title', 'description', 'user')
        }),
        ('Estado y Prioridad', {
            'fields': ('status', 'priority', 'due_date')
        }),
        ('EcoTrash', {
            'fields': ('is_eco_related', 'eco_category'),
            'classes': ('collapse',)
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


@admin.register(TodoCategory)
class TodoCategoryAdmin(admin.ModelAdmin):
    """Configuración del admin para categorías"""
    list_display = ['name', 'description', 'color', 'created_at']
    search_fields = ['name', 'description']
    readonly_fields = ['created_at']


@admin.register(TodoAttachment)
class TodoAttachmentAdmin(admin.ModelAdmin):
    """Configuración del admin para archivos adjuntos"""
    list_display = ['filename', 'todo', 'uploaded_at']
    list_filter = ['uploaded_at']
    search_fields = ['filename', 'todo__title']
    readonly_fields = ['uploaded_at']
