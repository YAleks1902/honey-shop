import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Heart, ChevronLeft, ChevronRight } from 'lucide-react';
import { useProduct, usePopularProducts } from '@/features/products/useProducts';
import { useCartStore } from '@/features/cart/cartStore';
import { useFavoritesStore } from '@/features/favorites/favoritesStore';
import { useAuthStore } from '@/features/auth/authStore';
import ProductCard from '@/components/shared/ProductCard';
import Button from '@/components/ui/Button';
import QuantityControl from '@/components/ui/QuantityControl';
import SEO from '@/components/shared/SEO';
import { formatPrice, getProductImage, cn } from '@/lib/utils';
import { ROUTES } from '@/constants';
import { ProductVariant } from '@/types';

export default function ProductPage() {
  const { slug = '' } = useParams();
  const { data: product, isLoading } = useProduct(slug);
  const { data: popular } = usePopularProducts();
  const { addItem } = useCartStore();
  const { isFavorite, toggle } = useFavoritesStore();
  const { isLoggedIn } = useAuthStore();

  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [reviewPage, setReviewPage] = useState(0);

  const variant = selectedVariant ?? product?.variants[0] ?? null;
  const isFav = product ? isFavorite(product.id) : false;

  const reviewsPerPage = 2;
  const reviews = product?.reviews ?? [];
  const totalReviewPages = Math.ceil(reviews.length / reviewsPerPage);
  const visibleReviews = reviews.slice(reviewPage * reviewsPerPage, reviewPage * reviewsPerPage + reviewsPerPage);

  const handleAddToCart = () => {
    if (!product || !variant) return;
    addItem({
      productId: product.id,
      variantId: variant.id,
      name: product.name,
      imageUrl: product.imageUrl ?? undefined,
      volume: variant.volume,
      harvestDate: product.harvestDate ?? undefined,
      state: product.state ?? undefined,
      priceCents: variant.priceCents,
      quantity,
    });
  };

  if (isLoading) {
    return (
      <div className="container py-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <div className="aspect-square animate-pulse rounded bg-gray-200" />
          <div className="space-y-4">
            <div className="h-8 animate-pulse rounded bg-gray-200" />
            <div className="h-4 w-2/3 animate-pulse rounded bg-gray-200" />
            <div className="h-4 animate-pulse rounded bg-gray-200" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container py-20 text-center">
        <p className="text-gray-500">Товар не найден</p>
        <Link to={ROUTES.CATALOG} className="mt-4 inline-block text-[#F5A623] hover:underline">
          Вернуться в каталог
        </Link>
      </div>
    );
  }

  return (
    <>
      <SEO
        title={product.name}
        description={product.shortDescription ?? `Купить ${product.name} — натуральный мёд из Кадымки. Доставка по России.`}
        image={getProductImage(product.imageUrl, product.id)}
      />
    <div>
      <div className="container py-8">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm text-gray-400">
          <Link to="/" className="hover:text-[#F5A623]">Главная</Link>
          {' › '}
          <Link to="/catalog" className="hover:text-[#F5A623]">Каталог</Link>
          {' › '}
          {product.category && (
            <>
              <Link to={`/catalog?category=${product.category.slug}`} className="hover:text-[#F5A623]">
                {product.category.name}
              </Link>
              {' › '}
            </>
          )}
          <span className="text-gray-600">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
          {/* Image */}
          <div className="relative">
            <button
              onClick={() => toggle(product.id, isLoggedIn)}
              className="absolute right-3 top-3 z-10 rounded-full bg-white p-2 shadow"
              aria-label={isFav ? 'Убрать из избранного' : 'Добавить в избранное'}
            >
              <Heart size={18} className={cn(isFav ? 'fill-[#F5A623] text-[#F5A623]' : 'text-gray-300')} />
            </button>
            <img
              src={getProductImage(product.imageUrl, product.id)}
              alt={product.name}
              className="aspect-square w-full rounded object-cover"
            />
          </div>

          {/* Info */}
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">{product.name}</h1>
            {product.shortDescription && (
              <p className="mt-2 text-sm text-gray-500">{product.shortDescription}</p>
            )}

            {/* Properties */}
            <div className="mt-4 space-y-1">
              {product.harvestDate && (
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Дата качки:</span> {product.harvestDate}
                </p>
              )}
              {product.state && (
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Состояние:</span> {product.state}
                </p>
              )}
              {product.crystalSize && (
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Размер кристаллов:</span> {product.crystalSize}
                </p>
              )}
            </div>

            {/* Volume selector */}
            {product.variants.length > 0 && (
              <div className="mt-5 flex flex-wrap gap-2">
                {product.variants.map((v) => (
                  <button
                    key={v.id}
                    onClick={() => setSelectedVariant(v)}
                    className={cn(
                      'rounded border px-4 py-2 text-sm transition-colors',
                      (selectedVariant?.id ?? product.variants[0]?.id) === v.id
                        ? 'border-[#F5A623] bg-[#F5A623] text-white'
                        : 'border-gray-300 hover:border-[#F5A623]',
                    )}
                  >
                    {v.volume}
                  </button>
                ))}
              </div>
            )}

            {/* Price + quantity */}
            {variant && (
              <div className="mt-5">
                <div className="flex items-baseline gap-2">
                  {variant.oldPriceCents && (
                    <span className="text-sm text-gray-400 line-through">{formatPrice(variant.oldPriceCents)}</span>
                  )}
                  {variant.discountPercent && (
                    <span className="text-sm font-medium text-[#F5A623]">-{variant.discountPercent}%</span>
                  )}
                </div>
                <p className="mt-1 text-2xl font-bold text-gray-900">{formatPrice(variant.priceCents)}</p>
                <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center">
                  <QuantityControl value={quantity} onChange={setQuantity} />
                  <Button onClick={handleAddToCart} size="lg" className="w-full sm:w-auto">
                    Купить
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Full description */}
        {product.fullDescription && (
          <div className="mt-10 border-t border-gray-100 pt-8">
            <p className="text-sm text-gray-600 leading-relaxed">{product.fullDescription}</p>
          </div>
        )}
      </div>

      {/* Popular products */}
      {popular && popular.length > 0 && (
        <section className="py-10 bg-gray-50">
          <div className="container">
            <h2 className="mb-6 text-center text-lg font-semibold text-gray-900">Популярные товары</h2>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
              {popular.filter((p) => p.id !== product.id).slice(0, 3).map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Reviews */}
      <section className="py-10">
        <div className="container">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-semibold text-gray-900">Отзывы</h2>
            <div className="flex gap-2">
              <button
                onClick={() => setReviewPage((p) => Math.max(0, p - 1))}
                disabled={reviewPage === 0}
                className="flex h-8 w-8 items-center justify-center border border-gray-300 rounded hover:border-[#F5A623] disabled:opacity-40"
              >
                <ChevronLeft size={14} />
              </button>
              <button
                onClick={() => setReviewPage((p) => Math.min(totalReviewPages - 1, p + 1))}
                disabled={reviewPage >= totalReviewPages - 1}
                className="flex h-8 w-8 items-center justify-center border border-gray-300 rounded hover:border-[#F5A623] disabled:opacity-40"
              >
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
          {reviews.length === 0 ? (
            <p className="text-sm text-gray-400">Отзывов пока нет. Будьте первым!</p>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {visibleReviews.map((review) => (
                <div key={review.id} className="rounded border border-gray-100 bg-gray-50 p-5">
                  <p className="text-sm font-medium text-gray-900">
                    {review.authorName}{review.authorCity && `, ${review.authorCity}`}
                  </p>
                  <p className="mt-2 text-sm text-gray-600 leading-relaxed">{review.comment}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
    </>
  );
}
