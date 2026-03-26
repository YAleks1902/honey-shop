import { Link } from 'react-router-dom';
import { Package, ShoppingBag, Users, TrendingUp } from 'lucide-react';
import { useAdminDashboard } from '@/features/admin/useAdmin';
import { formatPrice, formatDate } from '@/lib/utils';

const STATUS_LABELS: Record<string, string> = {
  pending: 'Новый',
  processing: 'В обработке',
  shipped: 'Отправлен',
  delivered: 'Доставлен',
  cancelled: 'Отменён',
};

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  processing: 'bg-blue-100 text-blue-800',
  shipped: 'bg-purple-100 text-purple-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
};

export default function AdminDashboard() {
  const { data, isLoading } = useAdminDashboard();

  if (isLoading) {
    return (
        <div className="p-4 md:p-8">
        <div className="grid grid-cols-4 gap-4 mb-8">
          {[1,2,3,4].map(i => <div key={i} className="h-28 animate-pulse rounded-lg bg-gray-200" />)}
        </div>
      </div>
    );
  }

  const stats = [
    { label: 'Заказов', value: data?.totalOrders ?? 0, icon: ShoppingBag, color: 'text-blue-600', bg: 'bg-blue-50', link: '/admin/orders' },
    { label: 'Товаров', value: data?.totalProducts ?? 0, icon: Package, color: 'text-green-600', bg: 'bg-green-50', link: '/admin/products' },
    { label: 'Пользователей', value: data?.totalUsers ?? 0, icon: Users, color: 'text-purple-600', bg: 'bg-purple-50', link: '/admin/users' },
    { label: 'Выручка', value: formatPrice(data?.totalRevenueCents ?? 0), icon: TrendingUp, color: 'text-orange-600', bg: 'bg-orange-50', link: '/admin/orders' },
  ];

  return (
    <div className="p-4 md:p-8">
      <h1 className="mb-6 text-xl font-bold text-gray-900 md:text-2xl">Дашборд</h1>

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-4 mb-8 lg:grid-cols-4">
        {stats.map((stat) => (
          <Link key={stat.label} to={stat.link} className="rounded-lg border bg-white p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">{stat.label}</p>
              <div className={`rounded-full p-2 ${stat.bg}`}>
                <stat.icon size={18} className={stat.color} />
              </div>
            </div>
            <p className="mt-3 text-2xl font-bold text-gray-900">{stat.value}</p>
          </Link>
        ))}
      </div>

      {/* Recent orders */}
      <div className="rounded-lg border bg-white shadow-sm">
        <div className="flex items-center justify-between border-b p-4">
          <h2 className="font-semibold text-gray-900">Последние заказы</h2>
          <Link to="/admin/orders" className="text-sm text-[#F5A623] hover:underline">Все заказы →</Link>
        </div>
        <div className="divide-y">
          {(data?.recentOrders ?? []).map((order: {
            id: string; status: string; totalCents: number; shippingName: string; createdAt: string;
            items: Array<{ product: { name: string } }>;
          }) => (
            <div key={order.id} className="flex items-center justify-between p-4">
              <div>
                <p className="text-sm font-medium text-gray-900">
                  #{order.id.slice(0, 8).toUpperCase()} — {order.shippingName}
                </p>
                <p className="text-xs text-gray-400">
                  {order.items.map((i) => i.product.name).join(', ')} · {formatDate(order.createdAt)}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_COLORS[order.status] ?? 'bg-gray-100 text-gray-700'}`}>
                  {STATUS_LABELS[order.status] ?? order.status}
                </span>
                <span className="font-semibold text-gray-900 text-sm">{formatPrice(order.totalCents)}</span>
              </div>
            </div>
          ))}
          {(!data?.recentOrders || data.recentOrders.length === 0) && (
            <p className="p-6 text-center text-sm text-gray-400">Заказов пока нет</p>
          )}
        </div>
      </div>
    </div>
  );
}
