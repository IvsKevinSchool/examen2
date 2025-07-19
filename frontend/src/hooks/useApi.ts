import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { todoApi, categoryApi } from '../services/api';
import type { 
  TodoCategory, 
  CreateTodoRequest, 
  UpdateTodoRequest, 
  TodoFilters
} from '../types/api';

// Query keys
export const queryKeys = {
  todos: ['todos'] as const,
  todo: (id: number) => ['todos', id] as const,
  todosWithFilters: (filters: TodoFilters) => ['todos', 'filtered', filters] as const,
  todoStats: ['todos', 'stats'] as const,
  highPriority: ['todos', 'high-priority'] as const,
  overdue: ['todos', 'overdue'] as const,
  categories: ['categories'] as const,
  category: (id: number) => ['categories', id] as const,
};

// Todo Hooks
export const useTodos = (filters?: TodoFilters) => {
  return useQuery({
    queryKey: filters ? queryKeys.todosWithFilters(filters) : queryKeys.todos,
    queryFn: () => todoApi.getTodos(filters),
    staleTime: 30000, // 30 seconds
  });
};

export const useTodo = (id: number) => {
  return useQuery({
    queryKey: queryKeys.todo(id),
    queryFn: () => todoApi.getTodo(id),
    enabled: !!id,
  });
};

export const useTodoStats = () => {
  return useQuery({
    queryKey: queryKeys.todoStats,
    queryFn: todoApi.getStats,
    staleTime: 60000, // 1 minute
  });
};

export const useHighPriorityTodos = () => {
  return useQuery({
    queryKey: queryKeys.highPriority,
    queryFn: todoApi.getHighPriority,
    staleTime: 30000,
  });
};

export const useOverdueTodos = () => {
  return useQuery({
    queryKey: queryKeys.overdue,
    queryFn: todoApi.getOverdue,
    staleTime: 30000,
  });
};

// Todo Mutations
export const useCreateTodo = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreateTodoRequest) => todoApi.createTodo(data),
    onSuccess: () => {
      // Invalidate and refetch all todo-related queries
      queryClient.invalidateQueries({ queryKey: queryKeys.todos });
      queryClient.invalidateQueries({ queryKey: queryKeys.todoStats });
    },
  });
};

export const useUpdateTodo = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<UpdateTodoRequest> }) => 
      todoApi.updateTodo(id, data),
    onSuccess: (updatedTodo) => {
      // Update the specific todo in cache
      queryClient.setQueryData(queryKeys.todo(updatedTodo.id), updatedTodo);
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: queryKeys.todos });
      queryClient.invalidateQueries({ queryKey: queryKeys.todoStats });
    },
  });
};

export const useUpdateTodoStatus = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) => 
      todoApi.updateTodoStatus(id, status),
    onSuccess: (updatedTodo) => {
      queryClient.setQueryData(queryKeys.todo(updatedTodo.id), updatedTodo);
      queryClient.invalidateQueries({ queryKey: queryKeys.todos });
      queryClient.invalidateQueries({ queryKey: queryKeys.todoStats });
    },
  });
};

export const useMarkTodoCompleted = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: number) => todoApi.markCompleted(id),
    onSuccess: (updatedTodo) => {
      queryClient.setQueryData(queryKeys.todo(updatedTodo.id), updatedTodo);
      queryClient.invalidateQueries({ queryKey: queryKeys.todos });
      queryClient.invalidateQueries({ queryKey: queryKeys.todoStats });
    },
  });
};

export const useDeleteTodo = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: number) => todoApi.deleteTodo(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.todos });
      queryClient.invalidateQueries({ queryKey: queryKeys.todoStats });
    },
  });
};

// Category Hooks
export const useCategories = () => {
  return useQuery({
    queryKey: queryKeys.categories,
    queryFn: categoryApi.getCategories,
    staleTime: 300000, // 5 minutes
  });
};

export const useCategory = (id: number) => {
  return useQuery({
    queryKey: queryKeys.category(id),
    queryFn: () => categoryApi.getCategory(id),
    enabled: !!id,
  });
};

// Category Mutations
export const useCreateCategory = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: Omit<TodoCategory, 'id' | 'created_at' | 'tasks_count'>) => 
      categoryApi.createCategory(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.categories });
    },
  });
};

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<TodoCategory> }) => 
      categoryApi.updateCategory(id, data),
    onSuccess: (updatedCategory) => {
      queryClient.setQueryData(queryKeys.category(updatedCategory.id), updatedCategory);
      queryClient.invalidateQueries({ queryKey: queryKeys.categories });
    },
  });
};

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: number) => categoryApi.deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.categories });
      queryClient.invalidateQueries({ queryKey: queryKeys.todos });
    },
  });
};
