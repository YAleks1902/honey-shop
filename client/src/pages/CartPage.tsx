import { Link } from 'react-router-dom';
import { useCartStore } from '@/features/cart/cartStore';
import { useAuthStore } from '@/features/auth/authStore';
import QuantityControl from '@/components/ui/QuantityControl';
import Button from '@/components/ui/Button';
import { formatPrice, getProductImage } from '@/lib/utils';
import { ROUTES } from '@/constants';

export default function CartPage() {
  const { items, removeItem, updateQuantity, totalPrice } = useCartStore();
  const { isLoggedIn, openModal } = useAuthStore();

  if (items.length === 0) {
    return (
      <div className="min-h-[50vh] bg-gray-50">
        <div className="container py-16 text-center">
          <h1 className="text-xl font-semibold text-gray-900">Ваша корзина пуста</h1>
          {!isLoggedIn && (
            <p className="mt-2 text-sm text-gray-500">
              Если в вашей корзине были товары —{' '}
              <button onClick={() => openModal('login')} className="text-[#F5A623] hover:underline">
                войдите
              </button>
              , чтобы просмотреть их.
            </p>
          )}
          <Link to={ROUTES.CATALOG}>
            <Button className="mt-6">Вернуться в каталог</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <h1 className="mb-6 text-2xl font-semibold text-gray-900">Ваш заказ</h1>

      {/* Table header */}
      <div className="hidden grid-cols-4 gap-4 border-b border-gray-200 pb-2 text-xs font-medium uppercase tracking-wider text-gray-400 md:grid">
        <span className="col-span-2">Товар</span>
        <span className="text-center">Количество</span>
        <span className="text-right">Подытог</span>
      </div>

      {/* Cart items */}
      <div className="divide-y divide-gray-100">
        {items.map((item) => (
          <div key={`${item.productId}-${item.variantId}`} className="py-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-4 md:items-center">
              {/* Product */}
              <div className="col-span-2 flex items-center gap-4">
                <img
                  src={getProductImage(item.imageUrl, item.productId)}
                  alt={item.name}
                  className="h-20 w-20 flex-shrink-0 rounded object-cover"
                />
                <div>
                  <p className="text-sm font-medium text-gray-900">{item.name}</p>
                  {item.harvestDate && (
                    <p className="text-xs text-gray-500">Дата качки: {item.harvestDate}</p>
                  )}
                  {item.state && (
                    <p className="text-xs text-gray-500">Состояние: {item.state}</p>
                  )}
                  {item.volume && (
                    <p className="text-xs text-gray-500">{item.volume}</p>
                  )}
                  <p className="mt-1 text-sm font-medium text-gray-700">{formatPrice(item.priceCents)}</p>
                </div>
              </div>

              {/* Quantity */}
              <div className="flex items-center justify-start md:justify-center">
                <QuantityControl
                  value={item.quantity}
                  onChange={(qty) => {
                    if (qty === 0) removeItem(item.productId, item.variantId);
                    else updateQuantity(item.productId, item.variantId, qty);
                  }}
                  min={0}
                />
              </div>

              {/* Subtotal */}
              <div className="text-right">
                <p className="font-semibold text-gray-900">{formatPrice(item.priceCents * item.quantity)}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Total + checkout */}
      <div className="mt-6 flex flex-col items-end gap-4">
        <div className="text-right">
          <p className="text-sm text-gray-500">Итого</p>
          <p className="text-2xl font-bold text-gray-900">{formatPrice(totalPrice())}</p>
        </div>
        <Link to={ROUTES.CHECKOUT}>
          <Button size="lg">Оформить заказ</Button>
        </Link>
      </div>
    </div>
  );
}
