import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { Product } from '@/types';
import { formatPrice, getProductImage, cn } from '@/lib/utils';
import { ROUTES } from '@/constants';
import { useCartStore } from '@/features/cart/cartStore';
import { useFavoritesStore } from '@/features/favorites/favoritesStore';
import { useAuthStore } from '@/features/auth/authStore';
import Button from '@/components/ui/Button';
import QuantityControl from '@/components/ui/QuantityControl';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem, items, updateQuantity, removeItem } = useCartStore();
  const { isFavorite, toggle } = useFavoritesStore();
  const { isLoggedIn } = useAuthStore();

  const firstVariant = product.variants[0];
  const cartItem = items.find(
    (i) => i.productId === product.id && i.variantId === firstVariant?.id,
  );
  const inCart = !!cartItem;
  const isFav = isFavorite(product.id);

  const handleAddToCart = () => {
    if (!firstVariant) return;
    addItem({
      productId: product.id,
      variantId: firstVariant.id,
      name: product.name,
      imageUrl: product.imageUrl ?? undefined,
      volume: firstVariant.volume,
      harvestDate: product.harvestDate ?? undefined,
      state: product.state ?? undefined,
      priceCents: firstVariant.priceCents,
      quantity: 1,
    });
  };

  const handleQuantityChange = (qty: number) => {
    if (qty === 0) removeItem(product.id, firstVariant?.id);
    else updateQuantity(product.id, firstVariant?.id, qty);
  };

  return (
    <div className="group flex flex-col">
      <div className="relative">
        <button
          onClick={() => toggle(product.id, isLoggedIn)}
          className="absolute right-2 top-2 z-10 rounded-full bg-white p-1.5 shadow-sm"
          aria-label={isFav ? 'Убрать из избранного' : 'Добавить в избранное'}
        >
          <Heart
            size={16}
            className={cn('transition-colors', isFav ? 'fill-[#F5A623] text-[#F5A623]' : 'text-gray-300 group-hover:text-gray-400')}
          />
        </button>
        <Link to={ROUTES.PRODUCT(product.slug)}>
          <img
            src={getProductImage(product.imageUrl, product.id)}
            alt={product.name}
            className="aspect-square w-full object-cover"
            loading="lazy"
          />
        </Link>
      </div>

      <div className="flex flex-1 flex-col pt-3">
        <Link to={ROUTES.PRODUCT(product.slug)} className="text-sm font-medium text-gray-900 hover:text-[#F5A623] leading-tight">
          {product.name}
        </Link>
        {firstVariant && (
          <p className="mt-0.5 text-xs text-gray-500">{firstVariant.volume}</p>
        )}
        {product.shortDescription && (
          <p className="mt-1 text-xs text-gray-500 line-clamp-2">{product.shortDescription}</p>
        )}

        <div className="mt-auto pt-3">
          {firstVariant && (
            <div className="flex items-baseline gap-2">
              {firstVariant.oldPriceCents && (
                <span className="text-xs text-gray-400 line-through">{formatPrice(firstVariant.oldPriceCents)}</span>
              )}
              {firstVariant.discountPercent && (
                <span className="text-xs font-medium text-[#F5A623]">-{firstVariant.discountPercent}%</span>
              )}
            </div>
          )}
          {firstVariant && (
            <p className="text-base font-semibold text-gray-900">{formatPrice(firstVariant.priceCents)}</p>
          )}

          <div className="mt-2">
            {inCart ? (
              <QuantityControl
                value={cartItem.quantity}
                onChange={handleQuantityChange}
                min={0}
              />
            ) : (
              <Button onClick={handleAddToCart} size="sm" className="w-full" disabled={!firstVariant}>
                В корзину
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
