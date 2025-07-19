import axios from 'axios';
import type {
  Todo,
  TodoCategory,
  TodoStats,
  CreateTodoRequest,
  UpdateTodoRequest,
  TodoFilters,
  PaginatedResponse
} from '../types/api';

// Configure axios instance
const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for debugging (development only)
api.interceptors.request.use(
  (config) => {
    if (import.meta.env.DEV) {
      console.log(`Making ${config.method?.toUpperCase()} request to ${config.url}`);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (import.meta.env.DEV) {
      console.error('API Error:', error.response?.data || error.message);
    }
    return Promise.reject(error);
  }
);

// Todo API endpoints
export const todoApi = {
  // Get all todos with filters
  getTodos: async (filters?: TodoFilters): Promise<PaginatedResponse<Todo>> => {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, value.toString());
        }
      });
    }
    
    const response = await api.get(`/todos/?${params.toString()}`);
    
    // Check if response is already paginated or if it's a simple array
    if (Array.isArray(response.data)) {
      // Backend returned simple array, wrap it in pagination format
      return {
        count: response.data.length,
        next: undefined,
        previous: undefined,
        results: response.data
      };
    }
    
    // Backend returned paginated response
    return response.data;
  },

  // Get all categories
  getCategories: async (): Promise<PaginatedResponse<TodoCategory>> => {
    const response = await api.get('/categories/');
    
    // Check if response is already paginated or if it's a simple array
    if (Array.isArray(response.data)) {
      // Backend returned simple array, wrap it in pagination format
      return {
        count: response.data.length,
        next: undefined,
        previous: undefined,
        results: response.data
      };
    }
    
    // Backend returned paginated response
    return response.data;
  },

  // Get single todo
  getTodo: async (id: number): Promise<Todo> => {
    const response = await api.get(`/todos/${id}/`);
    return response.data;
  },

  // Create new todo
  createTodo: async (data: CreateTodoRequest): Promise<Todo> => {
    const response = await api.post('/todos/', data);
    return response.data;
  },

  // Update todo
  updateTodo: async (id: number, data: Partial<UpdateTodoRequest>): Promise<Todo> => {
    const response = await api.patch(`/todos/${id}/`, data);
    return response.data;
  },

  // Update todo status only
  updateTodoStatus: async (id: number, status: string): Promise<Todo> => {
    const response = await api.patch(`/todos/${id}/update_status/`, { status });
    return response.data;
  },

  // Mark todo as completed
  markCompleted: async (id: number): Promise<Todo> => {
    const response = await api.post(`/todos/${id}/mark_completed/`);
    return response.data;
  },

  // Delete todo
  deleteTodo: async (id: number): Promise<void> => {
    await api.delete(`/todos/${id}/`);
  },

  // Get todo statistics
  getStats: async (): Promise<TodoStats> => {
    const response = await api.get('/todos/stats/');
    return response.data;
  },

  // Get high priority todos
  getHighPriority: async (): Promise<Todo[]> => {
    const response = await api.get('/todos/high_priority/');
    return response.data;
  },

  // Get overdue todos
  getOverdue: async (): Promise<Todo[]> => {
    const response = await api.get('/todos/overdue/');
    return response.data;
  },
};

// Category API endpoints
export const categoryApi = {
  // Get all categories
  getCategories: async (): Promise<TodoCategory[]> => {
    const response = await api.get('/categories/');
    return response.data;
  },

  // Get single category
  getCategory: async (id: number): Promise<TodoCategory> => {
    const response = await api.get(`/categories/${id}/`);
    return response.data;
  },

  // Create new category
  createCategory: async (data: Omit<TodoCategory, 'id' | 'created_at' | 'tasks_count'>): Promise<TodoCategory> => {
    const response = await api.post('/categories/', data);
    return response.data;
  },

  // Update category
  updateCategory: async (id: number, data: Partial<TodoCategory>): Promise<TodoCategory> => {
    const response = await api.patch(`/categories/${id}/`, data);
    return response.data;
  },

  // Delete category
  deleteCategory: async (id: number): Promise<void> => {
    await api.delete(`/categories/${id}/`);
  },
};

// Utility functions
export const apiUtils = {
  // Test API connection
  testConnection: async (): Promise<boolean> => {
    try {
      await api.get('/todos/');
      return true;
    } catch (error) {
      console.error('API connection failed:', error);
      return false;
    }
  },

  // Format date for API
  formatDateForApi: (date: Date): string => {
    return date.toISOString();
  },

  // Parse date from API
  parseDateFromApi: (dateString: string): Date => {
    return new Date(dateString);
  },
};

export default api;
