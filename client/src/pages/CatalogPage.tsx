import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { SlidersHorizontal, X, Check } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useProducts } from '@/features/products/useProducts';
import ProductCard from '@/components/shared/ProductCard';
import Button from '@/components/ui/Button';
import { Category } from '@/types';
import SEO from '@/components/shared/SEO';

const SORT_OPTIONS = [
  { label: 'Новинки', value: '' },
  { label: 'Цена ↑', value: 'price_asc' },
  { label: 'Цена ↓', value: 'price_desc' },
  { label: 'Название', value: 'name_asc' },
];

const PRICE_RANGES = [
  { label: 'Любая', min: undefined, max: undefined },
  { label: 'до 500 ₽', min: undefined, max: 50000 },
  { label: '500–1000 ₽', min: 50000, max: 100000 },
  { label: '1000–2000 ₽', min: 100000, max: 200000 },
  { label: 'от 2000 ₽', min: 200000, max: undefined },
];

export default function CatalogPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [page, setPage] = useState(1);
  const [allProducts, setAllProducts] = useState<ReturnType<typeof useProducts>['data']>(undefined);
  const [filterOpen, setFilterOpen] = useState(false);

  const category = searchParams.get('category') ?? '';
  const search = searchParams.get('search') ?? '';
  const sort = searchParams.get('sort') ?? '';
  const minPrice = searchParams.get('minPrice') ? parseInt(searchParams.get('minPrice')!) : undefined;
  const maxPrice = searchParams.get('maxPrice') ? parseInt(searchParams.get('maxPrice')!) : undefined;

  const { data, isLoading } = useProducts({ category, search, sort, page, limit: 9, minPrice, maxPrice });

  const { data: categories } = useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data } = await api.get('/categories');
      return data.data;
    },
  });

  useEffect(() => {
    setPage(1);
    setAllProducts(undefined);
  }, [category, search, sort, minPrice, maxPrice]);

  useEffect(() => {
    if (data) {
      if (page === 1) {
        setAllProducts(data);
      } else {
        setAllProducts((prev) =>
          prev
            ? { ...data, products: [...prev.products, ...data.products] }
            : data,
        );
      }
    }
  }, [data, page]);

  const setParam = (key: string, value: string) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (value) next.set(key, value);
      else next.delete(key);
      return next;
    });
  };

  const setPriceRange = (min?: number, max?: number) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (min !== undefined) next.set('minPrice', String(min));
      else next.delete('minPrice');
      if (max !== undefined) next.set('maxPrice', String(max));
      else next.delete('maxPrice');
      return next;
    });
    setFilterOpen(false);
  };

  const currentActivePriceRange = PRICE_RANGES.find(
    (r) => r.min === minPrice && r.max === maxPrice,
  );

  const activeFiltersCount = (minPrice !== undefined || maxPrice !== undefined) ? 1 : 0;
  const currentTitle = categories?.find((c) => c.slug === category)?.name ?? 'Каталог';

  return (
    <>
      <SEO
        title={currentTitle}
        description={`Купить ${currentTitle.toLowerCase()} — натуральный мёд из Кадымки. Доставка по всей России.`}
      />

      {/* Filter drawer overlay */}
      {filterOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/40"
          onClick={() => setFilterOpen(false)}
        />
      )}

      {/* Filter drawer */}
      <aside
        className={`fixed bottom-0 left-0 right-0 z-50 rounded-t-2xl bg-white shadow-2xl transition-transform duration-300 md:hidden ${filterOpen ? 'translate-y-0' : 'translate-y-full'}`}
      >
        <div className="flex items-center justify-between border-b px-5 py-4">
          <h2 className="font-semibold text-gray-900">Фильтры</h2>
          <button onClick={() => setFilterOpen(false)} aria-label="Закрыть">
            <X size={20} className="text-gray-500" />
          </button>
        </div>
        <div className="px-5 py-4">
          <p className="mb-3 text-sm font-medium text-gray-700">Цена (минимальная)</p>
          <div className="space-y-2">
            {PRICE_RANGES.map((r) => {
              const isActive = r.min === minPrice && r.max === maxPrice;
              return (
                <button
                  key={r.label}
                  onClick={() => setPriceRange(r.min, r.max)}
                  className={`flex w-full items-center justify-between rounded-lg border px-4 py-2.5 text-sm transition-colors ${
                    isActive ? 'border-[#F5A623] bg-amber-50 text-[#F5A623] font-medium' : 'border-gray-200 text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {r.label}
                  {isActive && <Check size={15} />}
                </button>
              );
            })}
          </div>
          <button
            onClick={() => { setPriceRange(undefined, undefined); setFilterOpen(false); }}
            className="mt-4 w-full rounded-lg border border-gray-200 py-2.5 text-sm text-gray-500 hover:bg-gray-50"
          >
            Сбросить фильтры
          </button>
        </div>
      </aside>

      <div className="container py-6 md:py-8">
        {/* Breadcrumb */}
        <nav className="mb-4 text-sm text-gray-400" aria-label="Хлебные крошки">
          <Link to="/" className="hover:text-[#F5A623]">Главная</Link>
          {' › '}
          <Link to="/catalog" className="hover:text-[#F5A623]">Каталог</Link>
          {category && <> {' › '} <span className="text-gray-600">{currentTitle}</span></>}
        </nav>

        <div className="flex items-center justify-between gap-2">
          <h1 className="text-xl font-semibold text-gray-900 md:text-2xl">{currentTitle}</h1>
          <button
            onClick={() => setFilterOpen(true)}
            className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-600 hover:border-[#F5A623] hover:text-[#F5A623] transition-colors md:hidden"
            aria-label="Открыть фильтры"
          >
            <SlidersHorizontal size={15} />
            Фильтр
            {activeFiltersCount > 0 && (
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#F5A623] text-[10px] font-bold text-white">
                {activeFiltersCount}
              </span>
            )}
          </button>
        </div>

        {/* Active price filter badge */}
        {currentActivePriceRange && currentActivePriceRange.label !== 'Любая' && (
          <div className="mt-2 flex flex-wrap gap-2">
            <span className="flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-[#F5A623]">
              {currentActivePriceRange.label}
              <button onClick={() => setPriceRange(undefined, undefined)} aria-label="Убрать фильтр">
                <X size={12} />
              </button>
            </span>
          </div>
        )}

        {/* Category tabs */}
        <div className="mt-4 flex gap-1 overflow-x-auto border-b border-gray-200 pb-px scrollbar-none">
          <button
            onClick={() => setParam('category', '')}
            className={`shrink-0 border-b-2 px-4 pb-2 pt-1 text-sm transition-colors ${
              !category ? 'border-gray-900 font-medium text-gray-900' : 'border-transparent text-gray-400 hover:text-gray-700'
            }`}
          >
            Все
          </button>
          {categories?.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setParam('category', cat.slug)}
              className={`shrink-0 border-b-2 px-4 pb-2 pt-1 text-sm transition-colors ${
                category === cat.slug ? 'border-gray-900 font-medium text-gray-900' : 'border-transparent text-gray-400 hover:text-gray-700'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Search + sort bar */}
        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
          <input
            type="search"
            defaultValue={search}
            onChange={(e) => setParam('search', e.target.value)}
            placeholder="Поиск по товарам"
            className="w-full rounded border border-gray-200 py-2.5 pl-4 pr-4 text-sm focus:border-[#F5A623] focus:outline-none sm:max-w-xs"
          />
          <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500">
            <span className="text-xs uppercase tracking-wider">Сортировка:</span>
            {SORT_OPTIONS.map((s) => (
              <button
                key={s.value}
                onClick={() => setParam('sort', s.value)}
                className={`rounded-full px-3 py-1 text-xs transition-colors ${
                  sort === s.value
                    ? 'bg-gray-900 text-white font-medium'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>

          {/* Desktop filter */}
          <div className="relative hidden md:block ml-auto">
            <button
              onClick={() => setFilterOpen((v) => !v)}
              className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-600 hover:border-[#F5A623] hover:text-[#F5A623] transition-colors"
            >
              <SlidersHorizontal size={15} />
              Фильтр
              {activeFiltersCount > 0 && (
                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#F5A623] text-[10px] font-bold text-white">
                  {activeFiltersCount}
                </span>
              )}
            </button>
            {filterOpen && (
              <div className="absolute right-0 top-full z-30 mt-2 w-52 rounded-xl border bg-white shadow-lg">
                <div className="flex items-center justify-between border-b px-4 py-3">
                  <p className="text-sm font-medium text-gray-900">Цена</p>
                  <button onClick={() => setFilterOpen(false)}><X size={15} className="text-gray-400" /></button>
                </div>
                <div className="p-3 space-y-1">
                  {PRICE_RANGES.map((r) => {
                    const isActive = r.min === minPrice && r.max === maxPrice;
                    return (
                      <button
                        key={r.label}
                        onClick={() => setPriceRange(r.min, r.max)}
                        className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors ${
                          isActive ? 'bg-amber-50 text-[#F5A623] font-medium' : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {r.label}
                        {isActive && <Check size={13} />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Product grid */}
        <div className="mt-6">
          {isLoading && page === 1 ? (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="aspect-square animate-pulse rounded bg-gray-200" />
              ))}
            </div>
          ) : (allProducts?.products.length ?? 0) === 0 ? (
            <div className="py-20 text-center text-gray-500">
              <p className="text-lg">Товары не найдены</p>
              <button onClick={() => setSearchParams({})} className="mt-3 text-[#F5A623] hover:underline text-sm">
                Сбросить фильтры
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-3 md:gap-4 md:grid-cols-3">
                {allProducts?.products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {allProducts && page < allProducts.pagination.pages && (
                <div className="mt-8 flex justify-center">
                  <button
                    onClick={() => setPage((p) => p + 1)}
                    disabled={isLoading}
                    className="flex items-center gap-2 text-sm text-[#F5A623] hover:text-[#d4890a] disabled:opacity-50"
                  >
                    {isLoading ? (
                      <span className="animate-spin">↻</span>
                    ) : (
                      <span className="text-lg">↻</span>
                    )}
                    показать ещё
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}
