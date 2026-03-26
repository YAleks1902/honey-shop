import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Pencil, Trash2, Search } from 'lucide-react';
import { useAdminProducts, useAdminDeleteProduct } from '@/features/admin/useAdmin';
import { formatPrice, getProductImage } from '@/lib/utils';
import Button from '@/components/ui/Button';

export default function AdminProducts() {
  const { data: products, isLoading } = useAdminProducts();
  const { mutate: deleteProduct } = useAdminDeleteProduct();
  const [search, setSearch] = useState('');

  const filtered = (products ?? []).filter((p: { name: string }) =>
    p.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="p-4 md:p-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Товары</h1>
        <Link to="/admin/products/new">
          <Button size="sm">
            <Plus size={16} className="mr-1" /> Добавить товар
          </Button>
        </Link>
      </div>

      <div className="mb-4 relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Поиск по названию..."
          className="w-full rounded border border-gray-200 py-2 pl-9 pr-4 text-sm focus:border-[#F5A623] focus:outline-none"
        />
      </div>

      <div className="rounded-lg border bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
        <table className="w-full min-w-[600px] text-sm">
          <thead className="bg-gray-50 text-xs uppercase text-gray-500">
            <tr>
              <th className="px-4 py-3 text-left">Товар</th>
              <th className="px-4 py-3 text-left">Категория</th>
              <th className="px-4 py-3 text-left">Цена</th>
              <th className="px-4 py-3 text-left">Остаток</th>
              <th className="px-4 py-3 text-left">Статус</th>
              <th className="px-4 py-3 text-right">Действия</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i}>
                  {Array.from({ length: 6 }).map((__, j) => (
                    <td key={j} className="px-4 py-3"><div className="h-4 animate-pulse rounded bg-gray-200" /></td>
                  ))}
                </tr>
              ))
            ) : filtered.map((product: {
              id: string; name: string; imageUrl?: string; slug: string;
              category?: { name: string }; variants: Array<{ priceCents: number }>;
              stock: number; isActive: boolean; isFeatured: boolean;
            }) => (
              <tr key={product.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={getProductImage(product.imageUrl, product.id)}
                      alt={product.name}
                      className="h-10 w-10 rounded object-cover"
                    />
                    <div>
                      <p className="font-medium text-gray-900">{product.name}</p>
                      <p className="text-xs text-gray-400">{product.slug}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-gray-600">{product.category?.name ?? '—'}</td>
                <td className="px-4 py-3 font-medium">
                  {product.variants[0] ? formatPrice(product.variants[0].priceCents) : '—'}
                </td>
                <td className="px-4 py-3">
                  <span className={product.stock === 0 ? 'text-red-500' : 'text-gray-700'}>{product.stock}</span>
                </td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${product.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-500'}`}>
                    {product.isActive ? 'Активен' : 'Скрыт'}
                  </span>
                  {product.isFeatured && (
                    <span className="ml-1 rounded-full bg-orange-100 px-2 py-0.5 text-xs font-medium text-orange-800">Топ</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <Link to={`/admin/products/${product.id}`} className="rounded p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700">
                      <Pencil size={15} />
                    </Link>
                    <button
                      onClick={() => {
                        if (confirm(`Скрыть товар "${product.name}"?`)) deleteProduct(product.id);
                      }}
                      className="rounded p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-600"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
        {!isLoading && filtered.length === 0 && (
          <p className="py-10 text-center text-sm text-gray-400">Товары не найдены</p>
        )}
      </div>
    </div>
  );
}
