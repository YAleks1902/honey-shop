import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Plus, Trash2, ArrowLeft } from 'lucide-react';
import { useAdminProduct, useAdminCreateProduct, useAdminUpdateProduct, useAdminCategories } from '@/features/admin/useAdmin';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

interface Variant { id?: string; volume: string; priceCents: number; oldPriceCents?: number; discountPercent?: number; }

export default function AdminProductForm() {
  const { id } = useParams<{ id: string }>();
  const isEdit = id && id !== 'new';
  const navigate = useNavigate();

  const { data: product } = useAdminProduct(isEdit ? id! : '');
  const { data: categories } = useAdminCategories();
  const { mutate: createProduct, isPending: creating, error: createError } = useAdminCreateProduct();
  const { mutate: updateProduct, isPending: updating, error: updateError } = useAdminUpdateProduct(isEdit ? id! : '');

  const [form, setForm] = useState({
    name: '', slug: '', shortDescription: '', fullDescription: '',
    imageUrl: '', categoryId: '', harvestDate: '', state: '', crystalSize: '',
    isFeatured: false, isActive: true, stock: 0,
  });
  const [variants, setVariants] = useState<Variant[]>([{ volume: '0.5 л', priceCents: 0 }]);

  useEffect(() => {
    if (product) {
      setForm({
        name: product.name ?? '',
        slug: product.slug ?? '',
        shortDescription: product.shortDescription ?? '',
        fullDescription: product.fullDescription ?? '',
        imageUrl: product.imageUrl ?? '',
        categoryId: product.categoryId ?? '',
        harvestDate: product.harvestDate ?? '',
        state: product.state ?? '',
        crystalSize: product.crystalSize ?? '',
        isFeatured: product.isFeatured ?? false,
        isActive: product.isActive ?? true,
        stock: product.stock ?? 0,
      });
      if (product.variants?.length) setVariants(product.variants);
    }
  }, [product]);

  const autoSlug = (name: string) =>
    name.toLowerCase().replace(/ё/g, 'e').replace(/[^a-z0-9а-яё\s-]/g, '')
      .replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '').slice(0, 80);

  const handleNameChange = (name: string) => {
    setForm((f) => ({ ...f, name, slug: f.slug || autoSlug(name) }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const body = { ...form, stock: Number(form.stock), variants: variants.map((v) => ({ ...v, priceCents: Number(v.priceCents), oldPriceCents: v.oldPriceCents ? Number(v.oldPriceCents) : undefined, discountPercent: v.discountPercent ? Number(v.discountPercent) : undefined })) };
    const onSuccess = () => navigate('/admin/products');
    if (isEdit) updateProduct(body, { onSuccess });
    else createProduct(body, { onSuccess });
  };

  const err = createError ?? updateError;

  return (
    <div className="p-4 md:p-8 max-w-3xl">
      <button onClick={() => navigate('/admin/products')} className="mb-5 flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900">
        <ArrowLeft size={16} /> Назад к товарам
      </button>
      <h1 className="mb-6 text-2xl font-bold text-gray-900">{isEdit ? 'Редактировать товар' : 'Новый товар'}</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <Input label="Название *" value={form.name} onChange={(e) => handleNameChange(e.target.value)} required />
          </div>
          <Input label="Slug (URL) *" value={form.slug} onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))} required />
          <div>
            <label className="mb-1 block text-sm text-gray-700">Категория *</label>
            <select
              value={form.categoryId}
              onChange={(e) => setForm((f) => ({ ...f, categoryId: e.target.value }))}
              className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-[#F5A623] focus:outline-none"
              required
            >
              <option value="">Выберите категорию</option>
              {(categories ?? []).map((c: { id: string; name: string }) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <Input label="URL изображения" value={form.imageUrl} onChange={(e) => setForm((f) => ({ ...f, imageUrl: e.target.value }))} placeholder="https://..." />
          <Input label="Остаток на складе" type="number" min={0} value={form.stock} onChange={(e) => setForm((f) => ({ ...f, stock: parseInt(e.target.value) || 0 }))} />
          <Input label="Дата качки" value={form.harvestDate} onChange={(e) => setForm((f) => ({ ...f, harvestDate: e.target.value }))} placeholder="17/05/2021" />
          <Input label="Состояние" value={form.state} onChange={(e) => setForm((f) => ({ ...f, state: e.target.value }))} placeholder="жидкий, кремовый..." />
          <Input label="Размер кристаллов" value={form.crystalSize} onChange={(e) => setForm((f) => ({ ...f, crystalSize: e.target.value }))} />
        </div>

        <div>
          <label className="mb-1 block text-sm text-gray-700">Краткое описание</label>
          <textarea value={form.shortDescription} onChange={(e) => setForm((f) => ({ ...f, shortDescription: e.target.value }))} rows={2} className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-[#F5A623] focus:outline-none resize-none" />
        </div>

        <div>
          <label className="mb-1 block text-sm text-gray-700">Полное описание</label>
          <textarea value={form.fullDescription} onChange={(e) => setForm((f) => ({ ...f, fullDescription: e.target.value }))} rows={5} className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-[#F5A623] focus:outline-none" />
        </div>

        <div className="flex gap-6">
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.isFeatured} onChange={(e) => setForm((f) => ({ ...f, isFeatured: e.target.checked }))} className="accent-[#F5A623]" />
            Товар недели (на главной)
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.isActive} onChange={(e) => setForm((f) => ({ ...f, isActive: e.target.checked }))} className="accent-[#F5A623]" />
            Активен (виден в каталоге)
          </label>
        </div>

        {/* Variants */}
        <div>
          <div className="mb-3 flex items-center justify-between">
            <h3 className="font-medium text-gray-900">Варианты (объём / цена) *</h3>
            <button type="button" onClick={() => setVariants((v) => [...v, { volume: '', priceCents: 0 }])} className="flex items-center gap-1 text-sm text-[#F5A623] hover:underline">
              <Plus size={14} /> Добавить вариант
            </button>
          </div>
          <div className="space-y-2">
            {variants.map((v, i) => (
              <div key={i} className="flex items-center gap-2">
                <Input placeholder="0.5 л" value={v.volume} onChange={(e) => setVariants((vs) => vs.map((x, j) => j === i ? { ...x, volume: e.target.value } : x))} className="w-24" />
                <Input placeholder="Цена (коп.)" type="number" value={v.priceCents || ''} onChange={(e) => setVariants((vs) => vs.map((x, j) => j === i ? { ...x, priceCents: parseInt(e.target.value) || 0 } : x))} className="w-36" />
                <Input placeholder="Старая цена" type="number" value={v.oldPriceCents || ''} onChange={(e) => setVariants((vs) => vs.map((x, j) => j === i ? { ...x, oldPriceCents: parseInt(e.target.value) || undefined } : x))} className="w-36" />
                <Input placeholder="Скидка %" type="number" min={0} max={100} value={v.discountPercent || ''} onChange={(e) => setVariants((vs) => vs.map((x, j) => j === i ? { ...x, discountPercent: parseInt(e.target.value) || undefined } : x))} className="w-24" />
                {variants.length > 1 && (
                  <button type="button" onClick={() => setVariants((vs) => vs.filter((_, j) => j !== i))} className="text-gray-400 hover:text-red-500">
                    <Trash2 size={15} />
                  </button>
                )}
              </div>
            ))}
          </div>
          <p className="mt-1 text-xs text-gray-400">Цена в копейках: 11125 руб = 1112500 коп</p>
        </div>

        {err && (
          <p className="text-sm text-red-500">
            {(err as { response?: { data?: { error?: string } } }).response?.data?.error ?? 'Ошибка сохранения'}
          </p>
        )}

        <div className="flex gap-3">
          <Button type="submit" loading={creating || updating} size="lg">
            {isEdit ? 'Сохранить изменения' : 'Создать товар'}
          </Button>
          <Button type="button" variant="outline" size="lg" onClick={() => navigate('/admin/products')}>
            Отмена
          </Button>
        </div>
      </form>
    </div>
  );
}
