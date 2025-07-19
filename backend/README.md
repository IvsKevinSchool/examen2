# ToDo Management System - Backend

A Django REST API backend for the ToDo Management System with comprehensive task management features.

## Features

- ✅ Full CRUD operations for tasks
- 📋 Task categorization system
- 🎯 Priority levels (Low, Medium, High, Urgent)
- ⏰ Status tracking (Pending, In Progress, Completed, Cancelled)
- 📊 Statistical endpoints and analytics
- 🔍 Advanced filtering and search
- 📎 File attachments for tasks
- 🚀 RESTful API with pagination
- 📚 Swagger/OpenAPI documentation
- 🔧 Django Admin interface

## Tech Stack

- **Django 5.2.4** - Web framework
- **Django REST Framework 3.16.0** - API framework
- **SQLite** - Database (configurable)
- **drf-yasg** - Swagger documentation
- **django-cors-headers** - CORS handling
- **Pillow** - Image processing

## Prerequisites

- Python 3.8+
- pip
- Virtual environment (recommended)

## Installation

1. Create and activate virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Run migrations:
```bash
python manage.py migrate
```

4. Create superuser (optional):
```bash
python manage.py createsuperuser
```

5. Start development server:
```bash
python manage.py runserver
```

The API will be available at `http://127.0.0.1:8000`

## API Documentation

- **Swagger UI**: `http://127.0.0.1:8000/` (Interactive documentation)
- **ReDoc**: `http://127.0.0.1:8000/redoc/` (Alternative documentation)
- **Django Admin**: `http://127.0.0.1:8000/admin/` (Admin interface)

## API Endpoints

### Todos
- `GET /api/todos/` - List all todos (with pagination and filtering)
- `POST /api/todos/` - Create new todo
- `GET /api/todos/{id}/` - Retrieve specific todo
- `PUT /api/todos/{id}/` - Update todo
- `DELETE /api/todos/{id}/` - Delete todo
- `PATCH /api/todos/{id}/status/` - Update todo status

### Categories
- `GET /api/categories/` - List all categories
- `POST /api/categories/` - Create new category
- `GET /api/categories/{id}/` - Retrieve specific category
- `PUT /api/categories/{id}/` - Update category
- `DELETE /api/categories/{id}/` - Delete category

### Statistics
- `GET /api/todos/stats/` - Get comprehensive statistics
- `GET /api/todos/high-priority/` - Get high priority tasks
- `GET /api/todos/overdue/` - Get overdue tasks
- `GET /api/todos/pending-ids/` - Get pending task IDs
- `GET /api/todos/pending-titles/` - Get pending task titles

## Project Structure

```
backend/
├── config/                 # Django configuration
│   ├── settings.py        # Main settings
│   ├── urls.py           # URL configuration
│   └── wsgi.py           # WSGI configuration
├── todo/                  # Todo app
│   ├── models.py         # Data models
│   ├── views.py          # API views
│   ├── serializers.py    # DRF serializers
│   ├── admin.py          # Admin configuration
│   └── urls.py           # App URLs
├── manage.py             # Django management script
├── requirements.txt      # Python dependencies
└── db.sqlite3           # SQLite database
```

## Models

### Todo Model
- `title` - Task title
- `description` - Task description (optional)
- `priority` - Task priority (low, medium, high, urgent)
- `status` - Task status (pending, in_progress, completed, cancelled)
- `due_date` - Due date (optional)
- `user` - Associated user (optional)
- `category` - Task category (optional)
- `created_at` - Creation timestamp
- `updated_at` - Last update timestamp
- `completed_at` - Completion timestamp

### TodoCategory Model
- `name` - Category name
- `description` - Category description (optional)
- `color` - Category color
- `icon` - Category icon (optional)

### TodoAttachment Model
- `todo` - Associated todo
- `filename` - Original filename
- `file` - File field
- `uploaded_at` - Upload timestamp

## Configuration

### Settings
- Debug mode enabled for development
- CORS configured for frontend integration
- REST Framework with pagination (20 items per page)
- Time zone: America/Mexico_City
- Language: Spanish (Mexico)

### CORS Settings
Configured to allow requests from:
- `http://localhost:3000`
- `http://127.0.0.1:3000`
- `http://localhost:5173`
- `http://127.0.0.1:5173`

## Development

### Running Tests
```bash
python manage.py test
```

### Creating Migrations
```bash
python manage.py makemigrations
python manage.py migrate
```

### Collecting Static Files
```bash
python manage.py collectstatic
```

## Contributing

1. Follow Django best practices
2. Use proper serializers for API endpoints
3. Maintain consistent error handling
4. Add tests for new functionality
5. Update documentation when adding features
