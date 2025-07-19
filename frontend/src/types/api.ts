// Backend API Types for Todo System

export interface Todo {
  id: number;
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  priority_display: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  status_display: string;
  created_at: string;
  updated_at: string;
  due_date?: string;
  completed_at?: string;
  user?: number;
  category?: number;
  category_details?: TodoCategory;
  attachments: TodoAttachment[];
  is_overdue: boolean;
  days_until_due?: number;
}

export interface TodoCategory {
  id: number;
  name: string;
  description?: string;
  color: string;
  icon?: string;
  created_at: string;
  tasks_count: number;
}

export interface TodoAttachment {
  id: number;
  filename: string;
  file: string;
  uploaded_at: string;
}

export interface TodoStats {
  total_tasks: number;
  pending_tasks: number;
  completed_tasks: number;
  in_progress_tasks: number;
  cancelled_tasks: number;
  overdue_tasks: number;
  completion_rate: number;
  tasks_by_priority: Record<string, number>;
  tasks_by_category: Record<string, number>;
}

export interface CreateTodoRequest {
  title: string;
  description?: string;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  status?: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  due_date?: string;
  user?: number;
  category?: number;
}

export interface UpdateTodoRequest extends Partial<CreateTodoRequest> {
  id: number;
}

export interface TodoFilters {
  status?: string;
  priority?: string;
  category?: number;
  search?: string;
  overdue?: boolean;
  user?: number;
}

// API Response Types
export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  count: number;
  next?: string;
  previous?: string;
  results: T[];
}

// Form Types
export interface TodoFormData {
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  due_date: string;
  category: number | '';
}

export interface CategoryFormData {
  name: string;
  description: string;
  color: string;
  icon: string;
}
