import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';

const navItems = [
  { path: '/', label: 'Dashboard', icon: '📊' },
  { path: '/pos', label: 'POS', icon: '🛒' },
  { path: '/products', label: 'Products', icon: '📦' },
  { path: '/brands', label: 'Brands', icon: '🏷️' },
  { path: '/stock', label: 'Stock', icon: '📊' },
  { path: '/suppliers', label: 'Suppliers', icon: '🚚' },
  { path: '/purchase-orders', label: 'Purchase Orders', icon: '📋' },
  { path: '/categories', label: 'Categories', icon: '📁' },
  { path: '/stores', label: 'Stores', icon: '🏪' },
  { path: '/customers', label: 'Customers', icon: '👥' },
];

export default function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h1 className="text-xl font-bold text-blue-600">CU Nepal</h1>
          <p className="text-sm text-gray-500 mt-1">{user?.store?.name || 'Convenience Store'}</p>
        </div>

        <nav className="flex-1 p-2 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                location.pathname === item.path
                  ? 'bg-blue-50 text-blue-700 font-medium'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <span>{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-700">{user?.name}</p>
              <p className="text-xs text-gray-400">{user?.role}</p>
            </div>
            <button
              onClick={handleLogout}
              className="text-sm text-red-500 hover:text-red-700"
            >
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto p-6">
        <Outlet />
      </main>
    </div>
  );
}
