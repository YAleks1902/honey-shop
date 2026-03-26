import { useState } from 'react';
import { Link, useLocation, Outlet, Navigate } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingBag, Tag, FileText, Users, LogOut, Menu, X } from 'lucide-react';
import { useAuthStore } from '@/features/auth/authStore';
import { cn } from '@/lib/utils';

const navLinks = [
  { to: '/admin', label: 'Дашборд', icon: LayoutDashboard, exact: true },
  { to: '/admin/products', label: 'Товары', icon: Package },
  { to: '/admin/orders', label: 'Заказы', icon: ShoppingBag },
  { to: '/admin/categories', label: 'Категории', icon: Tag },
  { to: '/admin/blog', label: 'Блог', icon: FileText },
  { to: '/admin/users', label: 'Пользователи', icon: Users },
];

export default function AdminLayout() {
  const { user, isLoggedIn, logout } = useAuthStore();
  const { pathname } = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!isLoggedIn) return <Navigate to="/" replace />;

  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed left-0 top-0 bottom-0 z-50 flex w-56 shrink-0 flex-col bg-gray-900 text-white transition-transform duration-300',
          'md:relative md:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <div className="flex items-center justify-between px-5 py-5 border-b border-gray-700">
          <div>
            <Link to="/" className="text-sm text-[#F5A623] font-semibold" onClick={closeSidebar}>← На сайт</Link>
            <p className="mt-2 text-xs text-gray-400">Панель управления</p>
            <p className="text-sm font-medium">{user?.firstName ?? user?.email}</p>
          </div>
          <button onClick={closeSidebar} className="p-1 text-gray-400 hover:text-white md:hidden" aria-label="Закрыть">
            <X size={18} />
          </button>
        </div>

        <nav className="flex-1 py-4">
          {navLinks.map(({ to, label, icon: Icon, exact }) => {
            const active = exact ? pathname === to : pathname.startsWith(to);
            return (
              <Link
                key={to}
                to={to}
                onClick={closeSidebar}
                className={cn(
                  'flex items-center gap-3 px-5 py-2.5 text-sm transition-colors',
                  active ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800',
                )}
              >
                <Icon size={16} />
                {label}
              </Link>
            );
          })}
        </nav>

        <button
          onClick={logout}
          className="flex items-center gap-3 px-5 py-4 text-sm text-gray-400 hover:text-white border-t border-gray-700 transition-colors"
        >
          <LogOut size={16} /> Выйти
        </button>
      </aside>

      {/* Main content */}
      <div className="flex flex-1 flex-col min-w-0">
        {/* Mobile top bar */}
        <div className="sticky top-0 z-30 flex h-12 items-center gap-3 border-b bg-white px-4 shadow-sm md:hidden">
          <button
            onClick={() => setSidebarOpen(true)}
            aria-label="Открыть меню"
            className="rounded p-1.5 text-gray-700 hover:bg-gray-100"
          >
            <Menu size={20} />
          </button>
          <span className="text-sm font-semibold text-gray-800">Панель управления</span>
        </div>

        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
