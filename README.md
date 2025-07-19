# ToDo Management System

A full-stack ToDo management application built with Django REST Framework backend and React TypeScript frontend.

## Overview

This is a comprehensive task management system that allows users to create, organize, and track their todos with features like categorization, priority levels, status tracking, and file attachments.

## Features

### 🎯 Core Functionality
- ✅ Create, read, update, and delete tasks
- 📋 Organize tasks with custom categories
- 🎯 Set priority levels (Low, Medium, High, Urgent)
- ⏰ Track task status (Pending, In Progress, Completed, Cancelled)
- 📅 Set due dates and track overdue tasks
- 📎 Attach files to tasks

### 📊 Analytics & Insights
- 📈 Dashboard with task statistics
- 🔍 Advanced filtering and search
- 📊 Visual representation of task distribution
- ⏱️ Completion rate tracking

### 🛠️ Technical Features
- 🌐 RESTful API with comprehensive endpoints
- 📱 Responsive web interface
- 📚 Interactive API documentation (Swagger)
- 🔒 User management and authentication ready
- 🎨 Modern and clean UI design

## Tech Stack

### Backend
- **Django 5.2.4** - Web framework
- **Django REST Framework 3.16.0** - API framework
- **SQLite** - Database
- **drf-yasg** - API documentation
- **django-cors-headers** - CORS handling

### Frontend
- **React 19** - Frontend framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **TanStack Query** - State management
- **Axios** - HTTP client
- **Lucide React** - Icons

## Quick Start

### Prerequisites
- Python 3.8+
- Node.js 18+
- npm or yarn

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Create virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Run migrations:
```bash
python manage.py migrate
```

5. Start backend server:
```bash
python manage.py runserver
```

Backend will be available at `http://127.0.0.1:8000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start development server:
```bash
npm run dev
```

Frontend will be available at `http://localhost:3000`

## Project Structure

```
examen2/
├── backend/               # Django REST API
│   ├── config/           # Django configuration
│   ├── todo/             # Todo app
│   ├── manage.py         # Django management
│   ├── requirements.txt  # Python dependencies
│   └── README.md         # Backend documentation
├── frontend/             # React TypeScript app
│   ├── src/              # Source code
│   │   ├── components/   # React components
│   │   ├── hooks/        # Custom hooks
│   │   ├── services/     # API services
│   │   └── types/        # TypeScript types
│   ├── package.json      # Node dependencies
│   └── README.md         # Frontend documentation
└── README.md             # This file
```

## API Documentation

Once the backend is running, you can access:

- **Swagger UI**: http://127.0.0.1:8000/ (Interactive API documentation)
- **ReDoc**: http://127.0.0.1:8000/redoc/ (Alternative documentation)
- **Django Admin**: http://127.0.0.1:8000/admin/ (Admin interface)

## Key API Endpoints

- `GET /api/todos/` - List all todos with filtering
- `POST /api/todos/` - Create new todo
- `GET /api/todos/stats/` - Get task statistics
- `GET /api/categories/` - List all categories
- `GET /api/todos/high-priority/` - Get high priority tasks
- `GET /api/todos/overdue/` - Get overdue tasks

## Development

### Adding New Features

1. **Backend**: Add models, serializers, and views in the `todo` app
2. **Frontend**: Create components in the appropriate directory
3. **Types**: Update TypeScript interfaces in `types/api.ts`
4. **API**: Update service functions in `services/api.ts`

### Code Quality

- Backend follows Django best practices
- Frontend uses TypeScript for type safety
- Components are modular and reusable
- API responses are consistently structured

## Deployment

### Backend Deployment
1. Set `DEBUG = False` in settings
2. Configure production database
3. Set up static file serving
4. Configure allowed hosts

### Frontend Deployment
1. Build production bundle: `npm run build`
2. Serve static files
3. Configure API base URL for production

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).

## Support

For questions or issues, please check the individual README files in the `backend/` and `frontend/` directories for more detailed information.
