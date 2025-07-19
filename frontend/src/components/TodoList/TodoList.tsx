import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { todoApi, userApi } from '../../services/api';
import type { Todo } from '../../types/api';
import LoadingSpinner from '../UI/LoadingSpinner';
import ErrorMessage from '../UI/ErrorMessage';
import { CheckCircle, Circle, Calendar, Flag, Folder, Search, Filter, Plus, User } from 'lucide-react';
import './TodoList.css';

interface TodoListProps {
  onCreateTodo?: () => void;
  onEditTodo?: (todo: Todo) => void;
}

export const TodoList: React.FC<TodoListProps> = ({ onCreateTodo, onEditTodo }) => {
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    priority: '',
    category: '',
    user: '',
    ordering: '-created_at'
  });

  const [showFilters, setShowFilters] = useState(false);

  // Fetch todos with filters
  const { data: todosResponse, isLoading: todosLoading, error: todosError, refetch } = useQuery({
    queryKey: ['todos', filters],
    queryFn: () => todoApi.getTodos({
      search: filters.search || undefined,
      status: filters.status || undefined,
      priority: filters.priority || undefined,
      category: filters.category ? parseInt(filters.category) : undefined,
      user: filters.user ? parseInt(filters.user) : undefined,
    }),
    staleTime: 30000,
  });

  // Fetch categories for filter dropdown
  const { data: categoriesResponse } = useQuery({
    queryKey: ['categories'],
    queryFn: () => todoApi.getCategories(),
    staleTime: 300000, // 5 minutes
  });

  // Fetch users for filter dropdown
  const { data: users } = useQuery({
    queryKey: ['users'],
    queryFn: userApi.getUsers,
    staleTime: 300000, // 5 minutes
  });

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      status: '',
      priority: '',
      category: '',
      user: '',
      ordering: '-created_at'
    });
  };

  const toggleTodoStatus = async (todo: Todo) => {
    try {
      const newStatus = todo.status === 'completed' ? 'pending' : 'completed';
      await todoApi.updateTodo(todo.id, { status: newStatus });
      refetch();
    } catch (error) {
      console.error('Error updating todo status:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatDueDate = (dueDateString: string) => {
    const dueDate = new Date(dueDateString);
    const today = new Date();
    const diffTime = dueDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return { text: `${Math.abs(diffDays)} días atrasado`, isOverdue: true };
    } else if (diffDays === 0) {
      return { text: 'Vence hoy', isToday: true };
    } else if (diffDays === 1) {
      return { text: 'Vence mañana', isTomorrow: true };
    } else {
      return { text: `${diffDays} días restantes`, isOverdue: false };
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'priority-urgent';
      case 'high': return 'priority-high';
      case 'medium': return 'priority-medium';
      case 'low': return 'priority-low';
      default: return 'priority-medium';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'status-completed';
      case 'in_progress': return 'status-in_progress';
      case 'cancelled': return 'status-cancelled';
      default: return 'status-pending';
    }
  };

  if (todosLoading) return <LoadingSpinner />;
  if (todosError) return <ErrorMessage message="Error al cargar las tareas" />;

  const todos = todosResponse?.results || [];
  const categories = categoriesResponse?.results || [];

  return (
    <div className="todo-list">
      {/* Header */}
      <div className="todo-list-header">
        <div className="header-title">
          <h1>Mis Tareas</h1>
          <span className="todo-count">
            {todosResponse?.count || 0} tarea{(todosResponse?.count || 0) !== 1 ? 's' : ''}
          </span>
        </div>
        <div className="header-actions">
          <button
            className="btn btn-secondary"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter size={20} />
            Filtros
          </button>
          {onCreateTodo && (
            <button className="btn btn-primary" onClick={onCreateTodo}>
              <Plus size={20} />
              Nueva Tarea
            </button>
          )}
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="filters-panel">
          <div className="filters-grid">
            {/* Search */}
            <div className="filter-group">
              <label>Buscar</label>
              <div className="search-input">
                <Search size={20} />
                <input
                  type="text"
                  placeholder="Buscar tareas..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                />
              </div>
            </div>

            {/* Status */}
            <div className="filter-group">
              <label>Estado</label>
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
              >
                <option value="">Todos los estados</option>
                <option value="pending">Pendiente</option>
                <option value="in_progress">En Progreso</option>
                <option value="completed">Completado</option>
                <option value="cancelled">Cancelado</option>
              </select>
            </div>

            {/* Priority */}
            <div className="filter-group">
              <label>Prioridad</label>
              <select
                value={filters.priority}
                onChange={(e) => handleFilterChange('priority', e.target.value)}
              >
                <option value="">Todas las prioridades</option>
                <option value="low">Baja</option>
                <option value="medium">Media</option>
                <option value="high">Alta</option>
                <option value="urgent">Urgente</option>
              </select>
            </div>

            {/* Category */}
            <div className="filter-group">
              <label>Categoría</label>
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
              >
                <option value="">Todas las categorías</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* User */}
            <div className="filter-group">
              <label>Usuario</label>
              <select
                value={filters.user}
                onChange={(e) => handleFilterChange('user', e.target.value)}
              >
                <option value="">Todos los usuarios</option>
                {users?.map(user => (
                  <option key={user.id} value={user.id}>
                    {user.first_name && user.last_name 
                      ? `${user.first_name} ${user.last_name}`
                      : user.username
                    }
                  </option>
                ))}
              </select>
            </div>

            {/* Ordering */}
            <div className="filter-group">
              <label>Ordenar por</label>
              <select
                value={filters.ordering}
                onChange={(e) => handleFilterChange('ordering', e.target.value)}
              >
                <option value="-created_at">Más recientes</option>
                <option value="created_at">Más antiguos</option>
                <option value="due_date">Fecha de vencimiento</option>
                <option value="-priority">Prioridad (Alta a Baja)</option>
                <option value="title">Título (A-Z)</option>
                <option value="-title">Título (Z-A)</option>
              </select>
            </div>
          </div>

          <div className="filters-actions">
            <button className="btn btn-text" onClick={clearFilters}>
              Limpiar filtros
            </button>
          </div>
        </div>
      )}

      {/* Todo List */}
      <div className="todos-container">
        {todos.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-content">
              <CheckCircle size={64} className="empty-icon" />
              <h3>No hay tareas</h3>
              <p>
                {Object.values(filters).some(f => f !== '' && f !== '-created_at')
                  ? 'No se encontraron tareas con los filtros aplicados.'
                  : 'Crea tu primera tarea para comenzar.'}
              </p>
              {onCreateTodo && (
                <button className="btn btn-primary" onClick={onCreateTodo}>
                  <Plus size={20} />
                  Crear Tarea
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="todos-grid">
            {todos.map((todo) => {
              const dueDateInfo = todo.due_date ? formatDueDate(todo.due_date) : null;
              
              return (
                <div
                  key={todo.id}
                  className={`todo-item ${todo.status === 'completed' ? 'completed' : ''} ${
                    dueDateInfo?.isOverdue ? 'overdue' : ''
                  }`}
                  onClick={() => onEditTodo?.(todo)}
                >
                  {/* Todo Header */}
                  <div className="todo-header">
                    <button
                      className="todo-checkbox"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleTodoStatus(todo);
                      }}
                    >
                      {todo.status === 'completed' ? (
                        <CheckCircle size={24} className="checked" />
                      ) : (
                        <Circle size={24} />
                      )}
                    </button>
                    <div className="todo-priority">
                      <Flag size={16} className={getPriorityColor(todo.priority)} />
                    </div>
                  </div>

                  {/* Todo Content */}
                  <div className="todo-content">
                    <h3 className="todo-title">{todo.title}</h3>
                    {todo.description && (
                      <p className="todo-description">{todo.description}</p>
                    )}
                  </div>

                  {/* Todo Meta */}
                  <div className="todo-meta">
                    <div className="todo-badges">
                      <span className={`status-badge ${getStatusColor(todo.status)}`}>
                        {todo.status === 'pending' && 'Pendiente'}
                        {todo.status === 'in_progress' && 'En Progreso'}
                        {todo.status === 'completed' && 'Completado'}
                        {todo.status === 'cancelled' && 'Cancelado'}
                      </span>
                      {todo.category_details && (
                        <span className="category-badge">
                          <Folder size={14} />
                          {todo.category_details.name}
                        </span>
                      )}
                      {todo.user_details && (
                        <span className="user-badge">
                          <User size={14} />
                          {todo.user_details.first_name && todo.user_details.last_name
                            ? `${todo.user_details.first_name} ${todo.user_details.last_name}`
                            : todo.user_details.username
                          }
                        </span>
                      )}
                    </div>

                    {/* Due Date */}
                    {todo.due_date && (
                      <div
                        className={`due-date ${dueDateInfo?.isOverdue ? 'overdue' : ''} ${
                          dueDateInfo?.isToday ? 'today' : ''
                        } ${dueDateInfo?.isTomorrow ? 'tomorrow' : ''}`}
                      >
                        <Calendar size={14} />
                        <span>{dueDateInfo?.text}</span>
                      </div>
                    )}
                  </div>

                  {/* Created Date */}
                  <div className="todo-created">
                    Creado el {formatDate(todo.created_at)}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Pagination */}
      {todosResponse && todosResponse.count > 20 && (
        <div className="pagination">
          <p>
            Mostrando {todos.length} de {todosResponse.count} tareas
          </p>
          {/* TODO: Implement pagination controls */}
        </div>
      )}
    </div>
  );
};
