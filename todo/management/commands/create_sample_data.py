from django.core.management.base import BaseCommand
from todo.models import TodoCategory, Todo
from django.contrib.auth.models import User
from django.utils import timezone
from datetime import timedelta

class Command(BaseCommand):
    help = 'Crear datos de ejemplo para el sistema ToDo'

    def handle(self, *args, **options):
        # Crear categorías
        categories_data = [
            {'name': 'Trabajo', 'description': 'Tareas relacionadas con el trabajo', 'color': '#007bff', 'icon': 'work'},
            {'name': 'Personal', 'description': 'Tareas personales', 'color': '#28a745', 'icon': 'person'},
            {'name': 'Hogar', 'description': 'Tareas del hogar', 'color': '#ffc107', 'icon': 'home'},
            {'name': 'Compras', 'description': 'Lista de compras', 'color': '#17a2b8', 'icon': 'shopping_cart'},
            {'name': 'Estudios', 'description': 'Tareas académicas', 'color': '#6f42c1', 'icon': 'school'},
        ]

        for cat_data in categories_data:
            category, created = TodoCategory.objects.get_or_create(
                name=cat_data['name'],
                defaults=cat_data
            )
            if created:
                self.stdout.write(f'Categoría creada: {category.name}')

        # Obtener usuario admin
        try:
            admin_user = User.objects.get(username='admin')
        except User.DoesNotExist:
            admin_user = None

        # Crear tareas de ejemplo
        work_category = TodoCategory.objects.get(name='Trabajo')
        personal_category = TodoCategory.objects.get(name='Personal')
        home_category = TodoCategory.objects.get(name='Hogar')
        shopping_category = TodoCategory.objects.get(name='Compras')

        todos_data = [
            {
                'title': 'Completar informe mensual',
                'description': 'Terminar el informe de ventas del mes de julio',
                'priority': 'high',
                'status': 'in_progress',
                'category': work_category,
                'due_date': timezone.now() + timedelta(days=2),
                'user': admin_user
            },
            {
                'title': 'Llamar al dentista',
                'description': 'Agendar cita para limpieza dental',
                'priority': 'medium',
                'status': 'pending',
                'category': personal_category,
                'due_date': timezone.now() + timedelta(days=7),
                'user': admin_user
            },
            {
                'title': 'Comprar groceries',
                'description': 'Leche, pan, huevos, frutas',
                'priority': 'medium',
                'status': 'pending',
                'category': shopping_category,
                'due_date': timezone.now() + timedelta(days=1),
                'user': admin_user
            },
            {
                'title': 'Limpiar la cocina',
                'description': 'Limpieza profunda de la cocina',
                'priority': 'low',
                'status': 'pending',
                'category': home_category,
                'user': admin_user
            },
            {
                'title': 'Revisar emails urgentes',
                'description': 'Responder emails pendientes de clientes',
                'priority': 'urgent',
                'status': 'completed',
                'category': work_category,
                'completed_at': timezone.now() - timedelta(hours=2),
                'user': admin_user
            },
            {
                'title': 'Ejercicio matutino',
                'description': '30 minutos de cardio',
                'priority': 'medium',
                'status': 'completed',
                'category': personal_category,
                'completed_at': timezone.now() - timedelta(hours=8),
                'user': admin_user
            },
            {
                'title': 'Preparar presentación',
                'description': 'Presentación para reunión del viernes',
                'priority': 'high',
                'status': 'pending',
                'category': work_category,
                'due_date': timezone.now() + timedelta(days=3),
                'user': admin_user
            },
            {
                'title': 'Tarea vencida',
                'description': 'Esta es una tarea que ya venció',
                'priority': 'medium',
                'status': 'pending',
                'category': work_category,
                'due_date': timezone.now() - timedelta(days=1),
                'user': admin_user
            }
        ]

        for todo_data in todos_data:
            todo, created = Todo.objects.get_or_create(
                title=todo_data['title'],
                defaults=todo_data
            )
            if created:
                self.stdout.write(f'Tarea creada: {todo.title}')

        self.stdout.write(
            self.style.SUCCESS('Datos de ejemplo creados exitosamente!')
        )
