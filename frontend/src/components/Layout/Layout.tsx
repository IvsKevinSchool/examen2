import React from 'react';
import { 
  LayoutDashboard, 
  CheckSquare, 
  FolderOpen,
  Menu,
  X 
} from 'lucide-react';
import './Layout.css';

type View = 'dashboard' | 'todos' | 'categories';

interface LayoutProps {
  children: React.ReactNode;
  currentView?: View;
  onNavigate?: (view: View) => void;
}

const Layout: React.FC<LayoutProps> = ({ 
  children, 
  currentView = 'dashboard',
  onNavigate 
}) => {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="layout">
      {/* Header */}
      <header className="header">
        <div className="header-content">
          <button 
            className="menu-button"
            onClick={toggleSidebar}
            aria-label="Toggle menu"
          >
            {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <h1 className="app-title">ToDo Manager</h1>
        </div>
      </header>

      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? 'sidebar-open' : ''}`}>
        <nav className="sidebar-nav">
          <ul className="nav-list">
            <li>
              <button 
                className={`nav-link ${currentView === 'dashboard' ? 'active' : ''}`}
                onClick={() => {
                  onNavigate?.('dashboard');
                  setSidebarOpen(false);
                }}
              >
                <LayoutDashboard size={20} />
                Dashboard
              </button>
            </li>
            <li>
              <button 
                className={`nav-link ${currentView === 'todos' ? 'active' : ''}`}
                onClick={() => {
                  onNavigate?.('todos');
                  setSidebarOpen(false);
                }}
              >
                <CheckSquare size={20} />
                Todas las Tareas
              </button>
            </li>
            <li>
              <button 
                className={`nav-link ${currentView === 'categories' ? 'active' : ''}`}
                onClick={() => {
                  onNavigate?.('categories');
                  setSidebarOpen(false);
                }}
              >
                <FolderOpen size={20} />
                Categorías
              </button>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div 
          className="sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="main-content">
        {children}
      </main>
    </div>
  );
};

export default Layout;
