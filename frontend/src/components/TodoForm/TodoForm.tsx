import React, { useState, useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { todoApi } from '../../services/api';
import type { Todo, TodoFormData } from '../../types/api';
import LoadingSpinner from '../UI/LoadingSpinner';
import ErrorMessage from '../UI/ErrorMessage';
import { Save, X, Calendar, Flag, Folder, FileText, AlignLeft } from 'lucide-react';
import './TodoForm.css';

interface TodoFormProps {
  todo?: Todo;
  onSave?: (todo: Todo) => void;
  onCancel?: () => void;
  onClose?: () => void;
}

export const TodoForm: React.FC<TodoFormProps> = ({ 
  todo, 
  onSave, 
  onCancel, 
  onClose 
}) => {
  const queryClient = useQueryClient();
  const isEditing = !!todo;

  const [formData, setFormData] = useState<TodoFormData>({
    title: '',
    description: '',
    priority: 'medium',
    status: 'pending',
    due_date: '',
    category: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Fetch categories for dropdown
  const { data: categoriesResponse } = useQuery({
    queryKey: ['categories'],
    queryFn: () => todoApi.getCategories(),
    staleTime: 300000, // 5 minutes
  });

  // Create mutation
  const createMutation = useMutation({
    mutationFn: todoApi.createTodo,
    onSuccess: (newTodo) => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
      queryClient.invalidateQueries({ queryKey: ['stats'] });
      onSave?.(newTodo);
      onClose?.();
    },
    onError: (error: any) => {
      console.error('Error creating todo:', error);
      setErrors(error.response?.data || { general: 'Error al crear la tarea' });
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => todoApi.updateTodo(id, data),
    onSuccess: (updatedTodo) => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
      queryClient.invalidateQueries({ queryKey: ['stats'] });
      queryClient.setQueryData(['todo', todo?.id], updatedTodo);
      onSave?.(updatedTodo);
      onClose?.();
    },
    onError: (error: any) => {
      console.error('Error updating todo:', error);
      setErrors(error.response?.data || { general: 'Error al actualizar la tarea' });
    },
  });

  // Initialize form data when editing
  useEffect(() => {
    if (todo) {
      setFormData({
        title: todo.title,
        description: todo.description || '',
        priority: todo.priority,
        status: todo.status,
        due_date: todo.due_date ? todo.due_date.split('T')[0] : '',
        category: todo.category || '',
      });
    }
  }, [todo]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'El título es requerido';
    }

    if (formData.title.length > 200) {
      newErrors.title = 'El título debe tener máximo 200 caracteres';
    }

    if (formData.description.length > 1000) {
      newErrors.description = 'La descripción debe tener máximo 1000 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const submitData = {
      title: formData.title.trim(),
      description: formData.description.trim() || undefined,
      priority: formData.priority,
      status: formData.status,
      due_date: formData.due_date || undefined,
      category: formData.category ? parseInt(formData.category.toString()) : undefined,
    };

    if (isEditing && todo) {
      updateMutation.mutate({ id: todo.id, data: submitData });
    } else {
      createMutation.mutate(submitData);
    }
  };

  const handleCancel = () => {
    onCancel?.();
    onClose?.();
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;
  const categories = categoriesResponse?.results || [];

  return (
    <div className="todo-form-overlay">
      <div className="todo-form-container">
        <div className="todo-form-header">
          <h2>
            {isEditing ? (
              <>
                <FileText size={24} />
                Editar Tarea
              </>
            ) : (
              <>
                <FileText size={24} />
                Nueva Tarea
              </>
            )}
          </h2>
          <button 
            className="close-button" 
            onClick={handleCancel}
            disabled={isLoading}
          >
            <X size={20} />
          </button>
        </div>

        {errors.general && (
          <ErrorMessage 
            message={errors.general} 
            onDismiss={() => setErrors(prev => ({ ...prev, general: '' }))}
          />
        )}

        <form onSubmit={handleSubmit} className="todo-form">
          {/* Title */}
          <div className="form-group">
            <label htmlFor="title" className="form-label required">
              <FileText size={16} />
              Título
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className={`form-input ${errors.title ? 'error' : ''}`}
              placeholder="Escribe el título de la tarea..."
              maxLength={200}
              disabled={isLoading}
              autoFocus
            />
            {errors.title && <span className="error-message">{errors.title}</span>}
            <span className="char-counter">{formData.title.length}/200</span>
          </div>

          {/* Description */}
          <div className="form-group">
            <label htmlFor="description" className="form-label">
              <AlignLeft size={16} />
              Descripción
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className={`form-textarea ${errors.description ? 'error' : ''}`}
              placeholder="Describe los detalles de la tarea..."
              rows={4}
              maxLength={1000}
              disabled={isLoading}
            />
            {errors.description && <span className="error-message">{errors.description}</span>}
            <span className="char-counter">{formData.description.length}/1000</span>
          </div>

          {/* Form Row 1: Priority and Status */}
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="priority" className="form-label">
                <Flag size={16} />
                Prioridad
              </label>
              <select
                id="priority"
                name="priority"
                value={formData.priority}
                onChange={handleInputChange}
                className="form-select"
                disabled={isLoading}
              >
                <option value="low">Baja</option>
                <option value="medium">Media</option>
                <option value="high">Alta</option>
                <option value="urgent">Urgente</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="status" className="form-label">
                Estado
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="form-select"
                disabled={isLoading}
              >
                <option value="pending">Pendiente</option>
                <option value="in_progress">En Progreso</option>
                <option value="completed">Completado</option>
                <option value="cancelled">Cancelado</option>
              </select>
            </div>
          </div>

          {/* Form Row 2: Due Date and Category */}
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="due_date" className="form-label">
                <Calendar size={16} />
                Fecha de Vencimiento
              </label>
              <input
                type="date"
                id="due_date"
                name="due_date"
                value={formData.due_date}
                onChange={handleInputChange}
                className="form-input"
                disabled={isLoading}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>

            <div className="form-group">
              <label htmlFor="category" className="form-label">
                <Folder size={16} />
                Categoría
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="form-select"
                disabled={isLoading}
              >
                <option value="">Sin categoría</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Form Actions */}
          <div className="form-actions">
            <button
              type="button"
              onClick={handleCancel}
              className="btn btn-secondary"
              disabled={isLoading}
            >
              <X size={16} />
              Cancelar
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isLoading || !formData.title.trim()}
            >
              {isLoading ? (
                <LoadingSpinner size="small" />
              ) : (
                <>
                  <Save size={16} />
                  {isEditing ? 'Actualizar' : 'Crear Tarea'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
