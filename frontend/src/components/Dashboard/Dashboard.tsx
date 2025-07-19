import React from 'react';
import { 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  Plus,
  TrendingUp,
  Calendar
} from 'lucide-react';
import { useTodoStats, useHighPriorityTodos, useOverdueTodos } from '../../hooks/useApi';
import LoadingSpinner from '../UI/LoadingSpinner';
import './Dashboard.css';

interface DashboardProps {
  onCreateTodo?: () => void;
  onViewTodos?: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onCreateTodo, onViewTodos }) => {
  const { data: stats, isLoading: statsLoading, error: statsError } = useTodoStats();
  const { data: highPriorityTodos, isLoading: highPriorityLoading } = useHighPriorityTodos();
  const { data: overdueTodos, isLoading: overdueLoading } = useOverdueTodos();

  if (statsLoading) {
    return (
      <div className="dashboard">
        <LoadingSpinner />
      </div>
    );
  }

  if (statsError) {
    return (
      <div className="dashboard">
        <div className="error-message">
          Error loading dashboard data
        </div>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total de Tareas',
      value: stats?.total_tasks || 0,
      icon: <CheckCircle size={24} />,
      color: 'blue',
    },
    {
      title: 'Pendientes',
      value: stats?.pending_tasks || 0,
      icon: <Clock size={24} />,
      color: 'yellow',
    },
    {
      title: 'Completadas',
      value: stats?.completed_tasks || 0,
      icon: <CheckCircle size={24} />,
      color: 'green',
    },
    {
      title: 'Vencidas',
      value: stats?.overdue_tasks || 0,
      icon: <AlertTriangle size={24} />,
      color: 'red',
    },
  ];

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <button onClick={onCreateTodo} className="btn btn-primary">
          <Plus size={20} />
          Nueva Tarea
        </button>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        {statCards.map((card, index) => (
          <div key={index} className={`stat-card stat-card-${card.color}`}>
            <div className="stat-icon">
              {card.icon}
            </div>
            <div className="stat-content">
              <h3 className="stat-value">{card.value}</h3>
              <p className="stat-title">{card.title}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Completion Rate */}
      {stats && (
        <div className="completion-section">
          <div className="completion-card">
            <div className="completion-header">
              <TrendingUp size={24} />
              <h3>Tasa de Completado</h3>
            </div>
            <div className="completion-rate">
              <span className="completion-percentage">{stats.completion_rate}%</span>
              <div className="completion-bar">
                <div 
                  className="completion-fill"
                  style={{ width: `${stats.completion_rate}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="dashboard-grid">
        {/* High Priority Tasks */}
        <div className="dashboard-section">
          <div className="section-header">
            <h2>Tareas de Alta Prioridad</h2>
            <button onClick={onViewTodos} className="view-all-link">
              Ver todas
            </button>
          </div>
          <div className="tasks-list">
            {highPriorityLoading ? (
              <LoadingSpinner size="small" />
            ) : highPriorityTodos && highPriorityTodos.length > 0 ? (
              highPriorityTodos.slice(0, 5).map((todo) => (
                <div key={todo.id} className="task-item" onClick={onViewTodos}>
                  <div className="task-content">
                    <h4 className="task-title">{todo.title}</h4>
                    <span className={`task-status status-${todo.status}`}>
                      {todo.status_display}
                    </span>
                  </div>
                  <div className="task-meta">
                    <span className={`priority-badge priority-${todo.priority}`}>
                      {todo.priority_display}
                    </span>
                    {todo.due_date && (
                      <span className="due-date">
                        <Calendar size={14} />
                        {new Date(todo.due_date).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p className="empty-state">No hay tareas de alta prioridad</p>
            )}
          </div>
        </div>

        {/* Overdue Tasks */}
        <div className="dashboard-section">
          <div className="section-header">
            <h2>Tareas Vencidas</h2>
            <button onClick={onViewTodos} className="view-all-link">
              Ver todas
            </button>
          </div>
          <div className="tasks-list">
            {overdueLoading ? (
              <LoadingSpinner size="small" />
            ) : overdueTodos && overdueTodos.length > 0 ? (
              overdueTodos.slice(0, 5).map((todo) => (
                <div key={todo.id} className="task-item overdue" onClick={onViewTodos}>
                  <div className="task-content">
                    <h4 className="task-title">{todo.title}</h4>
                    <span className={`task-status status-${todo.status}`}>
                      {todo.status_display}
                    </span>
                  </div>
                  <div className="task-meta">
                    <span className="overdue-badge">
                      <AlertTriangle size={14} />
                      Vencida
                    </span>
                    {todo.due_date && (
                      <span className="due-date">
                        <Calendar size={14} />
                        {new Date(todo.due_date).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p className="empty-state">No hay tareas vencidas</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
