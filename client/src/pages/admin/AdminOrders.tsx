import { useState } from 'react';
import { useAdminOrders, useAdminUpdateOrderStatus } from '@/features/admin/useAdmin';
import { formatPrice, formatDate } from '@/lib/utils';

const STATUS_LABELS: Record<string, string> = {
  pending: 'Новый', processing: 'В обработке', shipped: 'Отправлен', delivered: 'Доставлен', cancelled: 'Отменён',
};
const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800', processing: 'bg-blue-100 text-blue-800',
  shipped: 'bg-purple-100 text-purple-800', delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
};
const STATUSES = Object.keys(STATUS_LABELS);

export default function AdminOrders() {
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const { data, isLoading } = useAdminOrders({ status: statusFilter || undefined, page });
  const { mutate: updateStatus } = useAdminUpdateOrderStatus();

  const orders = data?.orders ?? [];
  const pagination = data?.pagination ?? { total: 0, pages: 1 };

  return (
    <div className="p-4 md:p-8">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Заказы</h1>

      {/* Filter tabs */}
      <div className="mb-5 flex flex-wrap gap-2">
        <button onClick={() => { setStatusFilter(''); setPage(1); }} className={`rounded-full px-3 py-1 text-sm font-medium transition-colors ${!statusFilter ? 'bg-[#F5A623] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
          Все ({pagination.total})
        </button>
        {STATUSES.map((s) => (
          <button key={s} onClick={() => { setStatusFilter(s); setPage(1); }} className={`rounded-full px-3 py-1 text-sm font-medium transition-colors ${statusFilter === s ? 'bg-[#F5A623] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
            {STATUS_LABELS[s]}
          </button>
        ))}
      </div>

      <div className="rounded-lg border bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-sm">
          <thead className="bg-gray-50 text-xs uppercase text-gray-500">
            <tr>
              <th className="px-4 py-3 text-left">Заказ</th>
              <th className="px-4 py-3 text-left">Покупатель</th>
              <th className="px-4 py-3 text-left">Товары</th>
              <th className="px-4 py-3 text-left">Сумма</th>
              <th className="px-4 py-3 text-left">Статус</th>
              <th className="px-4 py-3 text-left">Дата</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i}>
                  {Array.from({ length: 6 }).map((__, j) => (
                    <td key={j} className="px-4 py-4"><div className="h-4 animate-pulse rounded bg-gray-200" /></td>
                  ))}
                </tr>
              ))
            ) : orders.map((order: {
              id: string; shippingName: string; shippingEmail?: string;
              user?: { email: string; firstName?: string };
              items: Array<{ product: { name: string }; variant?: { volume: string }; quantity: number }>;
              totalCents: number; status: string; createdAt: string;
            }) => (
              <tr key={order.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-mono text-xs text-gray-600">
                  #{order.id.slice(0, 8).toUpperCase()}
                </td>
                <td className="px-4 py-3">
                  <p className="font-medium text-gray-900">{order.shippingName}</p>
                  <p className="text-xs text-gray-400">{order.shippingEmail ?? order.user?.email ?? '—'}</p>
                </td>
                <td className="px-4 py-3 max-w-xs">
                  <p className="truncate text-gray-700">
                    {order.items.map((i) => `${i.product.name}${i.variant ? ` (${i.variant.volume})` : ''} × ${i.quantity}`).join(', ')}
                  </p>
                </td>
                <td className="px-4 py-3 font-semibold text-gray-900">{formatPrice(order.totalCents)}</td>
                <td className="px-4 py-3">
                  <select
                    value={order.status}
                    onChange={(e) => updateStatus({ id: order.id, status: e.target.value })}
                    className={`rounded-full px-2 py-0.5 text-xs font-medium cursor-pointer border-0 focus:outline-none ${STATUS_COLORS[order.status] ?? 'bg-gray-100'}`}
                  >
                    {STATUSES.map((s) => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
                  </select>
                </td>
                <td className="px-4 py-3 text-gray-500 text-xs">{formatDate(order.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
        {!isLoading && orders.length === 0 && (
          <p className="py-10 text-center text-sm text-gray-400">Заказов нет</p>
        )}
      </div>

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="mt-4 flex justify-center gap-2">
          {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((p) => (
            <button key={p} onClick={() => setPage(p)} className={`rounded px-3 py-1 text-sm ${page === p ? 'bg-[#F5A623] text-white' : 'bg-gray-100 hover:bg-gray-200'}`}>
              {p}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
