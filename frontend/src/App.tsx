import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Layout from './components/Layout/Layout';
import Dashboard from './components/Dashboard/Dashboard';
import { TodoList } from './components/TodoList/TodoList';
import { TodoForm } from './components/TodoForm/TodoForm';
import type { Todo } from './types/api';
import './App.css';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

type View = 'dashboard' | 'todos' | 'categories';

function App() {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [showTodoForm, setShowTodoForm] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Todo | undefined>();

  const handleCreateTodo = () => {
    setEditingTodo(undefined);
    setShowTodoForm(true);
  };

  const handleEditTodo = (todo: Todo) => {
    setEditingTodo(todo);
    setShowTodoForm(true);
  };

  const handleCloseTodoForm = () => {
    setShowTodoForm(false);
    setEditingTodo(undefined);
  };

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return (
          <Dashboard 
            onCreateTodo={handleCreateTodo}
            onViewTodos={() => setCurrentView('todos')}
          />
        );
      case 'todos':
        return (
          <TodoList 
            onCreateTodo={handleCreateTodo}
            onEditTodo={handleEditTodo}
          />
        );
      case 'categories':
        return (
          <div className="coming-soon">
            <h2>Gestión de Categorías</h2>
            <p>Esta funcionalidad estará disponible próximamente.</p>
          </div>
        );
      default:
        return <Dashboard onCreateTodo={handleCreateTodo} />;
    }
  };

  return (
    <QueryClientProvider client={queryClient}>
      <div className="App">
        <Layout 
          currentView={currentView}
          onNavigate={setCurrentView}
        >
          {renderContent()}
        </Layout>

        {/* Todo Form Modal */}
        {showTodoForm && (
          <TodoForm
            todo={editingTodo}
            onClose={handleCloseTodoForm}
          />
        )}
      </div>
    </QueryClientProvider>
  );
}

export default App;
