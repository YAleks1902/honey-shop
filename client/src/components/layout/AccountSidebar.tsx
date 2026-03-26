import { Link, useLocation } from 'react-router-dom';
import { ROUTES } from '@/constants';
import { useAuthStore } from '@/features/auth/authStore';
import { cn } from '@/lib/utils';

const navLinks = [
  { label: 'Заказы', to: ROUTES.ACCOUNT_ORDERS },
  { label: 'Профиль', to: ROUTES.ACCOUNT_PROFILE },
  { label: 'Адрес', to: ROUTES.ACCOUNT_ADDRESS },
];

export default function AccountSidebar() {
  const { pathname } = useLocation();
  const { logout } = useAuthStore();

  return (
    <div className="w-40 shrink-0">
      <nav className="flex flex-col gap-4">
        {navLinks.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className={cn(
              'text-sm transition-colors',
              pathname === link.to ? 'font-semibold text-gray-900' : 'text-gray-400 hover:text-gray-700',
            )}
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
