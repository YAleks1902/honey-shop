import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Heart, User, Search, Menu, X } from 'lucide-react';
import { useCartStore } from '@/features/cart/cartStore';
import { useAuthStore } from '@/features/auth/authStore';
import { ROUTES, CONTACT_INFO } from '@/constants';
import { useState } from 'react';

const NAV_LINKS = [
  { to: ROUTES.HOME, label: 'Главная' },
  { to: '/catalog', label: 'Каталог' },
  { to: '/delivery', label: 'Доставка и Оплата' },
  { to: '/blog', label: 'Блог' },
  { to: '/about', label: 'О нас' },
  { to: '/contacts', label: 'Контакты' },
];

export default function Header() {
  const totalItems = useCartStore((s) => s.totalItems());
  const { isLoggedIn, user, logout, openModal } = useAuthStore();
  const navigate = useNavigate();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchValue.trim()) {
      navigate(`${ROUTES.CATALOG}?search=${encodeURIComponent(searchValue.trim())}`);
      setSearchOpen(false);
      setSearchValue('');
    }
  };

  const closeMobile = () => setMobileOpen(false);

  return (
    <>
      <header className="sticky top-0 z-40 bg-white shadow-sm">
        {/* Top bar — hidden on mobile */}
        <div className="hidden border-b border-gray-100 md:block">
          <div className="container flex items-center justify-end gap-6 py-1.5">
            <a href={`mailto:${CONTACT_INFO.email}`} className="text-xs text-gray-500 hover:text-gray-700">
              {CONTACT_INFO.email}
            </a>
            <a href={`tel:${CONTACT_INFO.phone}`} className="text-xs text-gray-500 hover:text-gray-700">
              {CONTACT_INFO.phone}
            </a>
          </div>
        </div>

        {/* Main nav */}
        <div className="container flex h-14 items-center gap-4 md:h-16 md:gap-6">
          {/* Logo */}
          <Link to={ROUTES.HOME} className="flex items-center shrink-0" aria-label="На главную">
            <img src="/logo.png" alt="Мёд из Кадымки" className="h-9 w-auto md:h-10" />
          </Link>

          {/* Catalog CTA — desktop only */}
          <Link
            to={ROUTES.CATALOG}
            className="hidden shrink-0 rounded bg-[#F5A623] px-5 py-2 text-sm font-medium text-white hover:bg-[#d4890a] transition-colors md:block"
          >
            Каталог
          </Link>

          {/* Nav links — desktop */}
          <nav className="hidden md:flex items-center gap-5">
            {NAV_LINKS.slice(0, 4).map((l) => (
              <Link key={l.to} to={l.to} className="text-sm text-gray-700 hover:text-[#F5A623] transition-colors">
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-3 md:gap-4">
            {/* Search — desktop */}
            <div className="relative hidden md:block">
              {searchOpen && (
                <form onSubmit={handleSearch} className="absolute right-0 top-0 flex items-center">
                  <input
                    autoFocus
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    onBlur={() => !searchValue && setSearchOpen(false)}
                    placeholder="Поиск..."
                    className="w-48 rounded border border-gray-300 px-3 py-1.5 text-sm focus:border-[#F5A623] focus:outline-none"
                  />
                </form>
              )}
              <button
                onClick={() => setSearchOpen((v) => !v)}
                className="flex flex-col items-center gap-0.5 p-2 text-gray-600 hover:text-[#F5A623]"
                aria-label="Поиск"
              >
                <Search size={18} />
                <span className="text-xs">Поиск</span>
              </button>
            </div>

            {/* Favorites */}
            <Link
              to={ROUTES.ACCOUNT_ORDERS}
              className="flex flex-col items-center gap-0.5 p-2 text-gray-600 hover:text-[#F5A623]"
              aria-label="Избранное"
            >
              <Heart size={18} />
              <span className="hidden text-xs md:block">Избранное</span>
            </Link>

            {/* Admin link — desktop */}
            {isLoggedIn && user?.isAdmin && (
              <Link to="/admin" className="hidden text-xs font-medium text-[#F5A623] md:block hover:underline">
                Админ
              </Link>
            )}

            {/* Account */}
            {isLoggedIn ? (
              <Link
                to={ROUTES.ACCOUNT_ORDERS}
                className="flex flex-col items-center gap-0.5 p-2 text-gray-600 hover:text-[#F5A623]"
                aria-label="Личный кабинет"
              >
                <User size={18} />
                <span className="hidden text-xs md:block">{user?.firstName ?? 'Кабинет'}</span>
              </Link>
            ) : (
              <button
                onClick={() => openModal('login')}
                className="flex flex-col items-center gap-0.5 p-2 text-gray-600 hover:text-[#F5A623]"
                aria-label="Войти"
              >
                <User size={18} />
                <span className="hidden text-xs md:block">Войти</span>
              </button>
            )}

            {/* Cart */}
            <Link
              to={ROUTES.CART}
              className="relative flex flex-col items-center gap-0.5 p-2 text-gray-600 hover:text-[#F5A623]"
              aria-label={`Корзина, ${totalItems} товаров`}
            >
              <div className="relative">
                <ShoppingCart size={18} />
                {totalItems > 0 && (
                  <span className="absolute -right-2 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#F5A623] text-[10px] font-bold text-white">
                    {totalItems > 9 ? '9+' : totalItems}
                  </span>
                )}
              </div>
              <span className="hidden text-xs md:block">Корзина</span>
            </Link>

            {/* Hamburger — mobile only */}
            <button
              onClick={() => setMobileOpen(true)}
              className="flex items-center justify-center p-2 text-gray-700 md:hidden"
              aria-label="Открыть меню"
            >
              <Menu size={22} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile drawer overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/40 md:hidden"
          onClick={closeMobile}
        />
      )}

      {/* Mobile drawer */}
      <aside
        className={`fixed left-0 top-0 bottom-0 z-50 w-72 bg-white shadow-2xl transition-transform duration-300 md:hidden flex flex-col ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Drawer header */}
        <div className="flex items-center justify-between border-b px-5 py-4">
          <Link to={ROUTES.HOME} onClick={closeMobile}>
            <img src="/logo.png" alt="Мёд из Кадымки" className="h-8 w-auto" />
          </Link>
          <button onClick={closeMobile} aria-label="Закрыть меню" className="p-1 text-gray-500">
            <X size={22} />
          </button>
        </div>

        {/* Search in drawer */}
        <div className="border-b px-5 py-3">
          <form onSubmit={(e) => { handleSearch(e); closeMobile(); }} className="flex items-center gap-2">
            <input
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="Поиск..."
              className="flex-1 rounded border border-gray-200 px-3 py-2 text-sm focus:border-[#F5A623] focus:outline-none"
            />
            <button type="submit" className="rounded bg-[#F5A623] p-2 text-white" aria-label="Найти">
              <Search size={15} />
            </button>
          </form>
        </div>

        {/* Nav links */}
        <nav className="flex-1 overflow-y-auto py-2">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              onClick={closeMobile}
              className="flex items-center px-5 py-3.5 text-sm font-medium text-gray-800 hover:bg-amber-50 hover:text-[#F5A623] transition-colors"
            >
              {l.label}
            </Link>
          ))}
          {isLoggedIn && user?.isAdmin && (
            <Link
              to="/admin"
              onClick={closeMobile}
              className="flex items-center px-5 py-3.5 text-sm font-medium text-[#F5A623] hover:bg-amber-50"
            >
              Панель администратора
            </Link>
          )}
        </nav>

        {/* Drawer footer */}
        <div className="border-t px-5 py-4">
          {isLoggedIn ? (
            <div className="space-y-2">
              <Link
                to={ROUTES.ACCOUNT_ORDERS}
                onClick={closeMobile}
                className="flex w-full items-center gap-2 rounded-lg bg-gray-100 px-4 py-2.5 text-sm font-medium text-gray-800"
              >
                <User size={16} /> {user?.firstName ?? 'Мой кабинет'}
              </Link>
              <button
                onClick={() => { logout(); closeMobile(); }}
                className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm text-gray-500"
              >
                Выйти
              </button>
            </div>
          ) : (
            <button
              onClick={() => { openModal('login'); closeMobile(); }}
              className="w-full rounded-lg bg-[#F5A623] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#d4890a]"
            >
              Войти / Зарегистрироваться
            </button>
          )}
          <div className="mt-3 text-center text-xs text-gray-400">
            <a href={`tel:${CONTACT_INFO.phone}`}>{CONTACT_INFO.phone}</a>
          </div>
        </div>
      </aside>
    </>
  );
}
