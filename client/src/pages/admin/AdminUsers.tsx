import { useAdminUsers } from '@/features/admin/useAdmin';
import { formatDate } from '@/lib/utils';
import { Crown, ShoppingBag } from 'lucide-react';

export default function AdminUsers() {
  const { data, isLoading } = useAdminUsers();
  const users = data?.users ?? [];

  return (
    <div className="p-4 md:p-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Пользователи</h1>
        <p className="text-sm text-gray-500">Всего: {data?.pagination?.total ?? 0}</p>
      </div>

      <div className="rounded-lg border bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
        <table className="w-full min-w-[560px] text-sm">
          <thead className="bg-gray-50 text-xs uppercase text-gray-500">
            <tr>
              <th className="px-4 py-3 text-left">Пользователь</th>
              <th className="px-4 py-3 text-left">Email</th>
              <th className="px-4 py-3 text-left">Заказов</th>
              <th className="px-4 py-3 text-left">Роль</th>
              <th className="px-4 py-3 text-left">Дата регистрации</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i}>{Array.from({ length: 5 }).map((__, j) => (
                  <td key={j} className="px-4 py-3"><div className="h-4 animate-pulse rounded bg-gray-200" /></td>
                ))}</tr>
              ))
            ) : users.map((user: {
              id: string; email: string; firstName?: string; lastName?: string;
              isAdmin: boolean; createdAt: string; _count?: { orders: number };
            }) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <p className="font-medium text-gray-900">
                    {user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : '—'}
                  </p>
                </td>
                <td className="px-4 py-3 text-gray-600">{user.email}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1 text-gray-600">
                    <ShoppingBag size={13} />
                    {user._count?.orders ?? 0}
                  </div>
                </td>
                <td className="px-4 py-3">
                  {user.isAdmin ? (
                    <span className="flex items-center gap-1 text-xs font-medium text-amber-700 bg-amber-50 rounded-full px-2 py-0.5 w-fit">
                      <Crown size={11} /> Администратор
                    </span>
                  ) : (
                    <span className="text-xs text-gray-500">Пользователь</span>
                  )}
                </td>
                <td className="px-4 py-3 text-gray-500 text-xs">{formatDate(user.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
        {!isLoading && users.length === 0 && (
          <p className="py-10 text-center text-sm text-gray-400">Пользователей нет</p>
        )}
      </div>
    </div>
  );
}
