import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { useAuthStore } from '@/features/auth/authStore';
import { useOrders } from '@/features/orders/useOrders';
import { useFavoritesStore } from '@/features/favorites/favoritesStore';
import { useCartStore } from '@/features/cart/cartStore';
import AccountSidebar from '@/components/layout/AccountSidebar';
import Button from '@/components/ui/Button';
import QuantityControl from '@/components/ui/QuantityControl';
import { formatPrice, getProductImage, cn } from '@/lib/utils';
import { ROUTES } from '@/constants';

export default function OrdersPage() {
  const { user, isLoggedIn } = useAuthStore();
  const { data: orders, isLoading } = useOrders(isLoggedIn);
  const { isFavorite, toggle } = useFavoritesStore();
  const { items, addItem, updateQuantity, removeItem } = useCartStore();

  const cartItemsFromOrders = items;

  return (
    <div className="container py-8">
      {/* Account header */}
      <div className="mb-6 flex gap-8 border-b border-gray-200 pb-3">
        <Link to={ROUTES.ACCOUNT_ORDERS} className="border-b-2 border-gray-900 pb-3 text-sm font-medium text-gray-900">
          Личный кабинет
        </Link>
        <button onClick={() => useAuthStore.getState().logout()} className="text-sm text-gray-400 hover:text-gray-700">
          Выйти
        </button>
      </div>

      <div className="flex gap-10">
        <AccountSidebar />

        <div className="flex-1">
          <h2 className="mb-6 text-xl font-semibold text-gray-900">
            Привет {user?.firstName ?? user?.email?.split('@')[0] ?? 'USERNAME'}
          </h2>

          {isLoading ? (
            <div className="grid grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-40 animate-pulse rounded bg-gray-200" />
              ))}
            </div>
          ) : !orders || orders.length === 0 ? (
            <div>
              <p className="text-sm text-gray-500">
                Пока еще ты ничего не добавил в корзину,{' '}
                <Link to={ROUTES.CATALOG} className="text-[#F5A623] hover:underline">
                  выбери что-то в нашем каталоге
                </Link>
                .
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {orders.flatMap((order) =>
                  order.items.map((item) => {
                    const cartItem = cartItemsFromOrders.find(
                      (ci) => ci.productId === item.product.id,
                    );
                    const inCart = !!cartItem;
                    const isFav = isFavorite(item.product.id);

                    return (
                      <div key={item.id} className="rounded border border-gray-200 p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-start gap-3">
                            <img
                              src={getProductImage(item.product.imageUrl, item.product.id)}
                              alt={item.product.name}
                              className="h-16 w-16 rounded object-cover"
                            />
                            <div>
                              <Link to={ROUTES.PRODUCT(item.product.slug)} className="text-sm font-medium text-gray-900 hover:text-[#F5A623]">
                                {item.product.name}
                              </Link>
                              {item.variant?.volume && <p className="text-xs text-gray-400">{item.variant.volume}</p>}
                              {item.priceCents && (
                                <p className="mt-1 text-xs text-gray-400 line-through">{formatPrice(item.priceCents)}</p>
                              )}
                              <p className="text-base font-semibold text-gray-900">{formatPrice(item.priceCents)}</p>
                            </div>
                          </div>
                          <button
                            onClick={() => toggle(item.product.id, isLoggedIn)}
                            className="mt-0.5 text-gray-300 hover:text-[#F5A623]"
                            aria-label="Избранное"
                          >
                            <Heart size={16} className={cn(isFav ? 'fill-[#F5A623] text-[#F5A623]' : '')} />
                          </button>
                        </div>

                        <div className="mt-3 flex justify-end">
                          {inCart ? (
                            <QuantityControl
                              value={cartItem.quantity}
                              onChange={(qty) => {
                                if (qty === 0) removeItem(item.product.id, undefined);
                                else updateQuantity(item.product.id, undefined, qty);
                              }}
                              min={0}
                            />
                          ) : (
                            <QuantityControl
                              value={1}
                              onChange={() => {}}
                            />
                          )}
                        </div>
                      </div>
                    );
                  }),
                )}
              </div>
              <div className="mt-6 flex justify-end">
                <Link to={ROUTES.CHECKOUT}>
                  <Button size="lg">Оформить заказ</Button>
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
