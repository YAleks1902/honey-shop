import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { useAdminCategories, useAdminCreateCategory, useAdminDeleteCategory } from '@/features/admin/useAdmin';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

export default function AdminCategories() {
  const { data: categories, isLoading } = useAdminCategories();
  const { mutate: createCategory, isPending } = useAdminCreateCategory();
  const { mutate: deleteCategory } = useAdminDeleteCategory();

  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createCategory({ name, slug, imageUrl: imageUrl || undefined }, {
      onSuccess: () => { setName(''); setSlug(''); setImageUrl(''); },
    });
  };

  const autoSlug = (n: string) => n.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

  return (
    <div className="p-4 md:p-8 max-w-2xl">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Категории</h1>

      {/* Add form */}
      <div className="mb-8 rounded-lg border bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-sm font-semibold text-gray-900">Новая категория</h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <Input label="Название *" value={name} onChange={(e) => { setName(e.target.value); setSlug(autoSlug(e.target.value)); }} required />
          <Input label="Slug (URL) *" value={slug} onChange={(e) => setSlug(e.target.value)} required />
          <Input label="URL изображения" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="https://..." />
          <Button type="submit" size="sm" loading={isPending}>
            <Plus size={15} className="mr-1" /> Добавить
          </Button>
        </form>
      </div>

      {/* List */}
      <div className="rounded-lg border bg-white shadow-sm divide-y">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="p-4 flex items-center gap-3">
              <div className="h-10 w-10 animate-pulse rounded bg-gray-200" />
              <div className="flex-1 space-y-1">
                <div className="h-4 w-32 animate-pulse rounded bg-gray-200" />
                <div className="h-3 w-20 animate-pulse rounded bg-gray-200" />
              </div>
            </div>
          ))
        ) : (categories ?? []).map((cat: { id: string; name: string; slug: string; imageUrl?: string; _count?: { products: number } }) => (
          <div key={cat.id} className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              {cat.imageUrl && (
                <img src={cat.imageUrl} alt={cat.name} className="h-10 w-10 rounded object-cover" />
              )}
              <div>
                <p className="font-medium text-gray-900">{cat.name}</p>
                <p className="text-xs text-gray-400">{cat.slug} · {cat._count?.products ?? 0} товаров</p>
              </div>
            </div>
            <button
              onClick={() => {
                if (confirm(`Удалить категорию "${cat.name}"?`)) deleteCategory(cat.id);
              }}
              className="rounded p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-600"
            >
              <Trash2 size={15} />
            </button>
          </div>
        ))}
        {!isLoading && (!categories || categories.length === 0) && (
          <p className="py-8 text-center text-sm text-gray-400">Категорий нет</p>
        )}
      </div>
    </div>
  );
}
