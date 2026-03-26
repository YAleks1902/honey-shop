import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCartStore } from '@/features/cart/cartStore';
import { useAuthStore } from '@/features/auth/authStore';
import { useCreateOrder } from '@/features/orders/useOrders';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { formatPrice, getProductImage } from '@/lib/utils';
import { ROUTES, SHIPPING_METHODS, PAYMENT_METHODS } from '@/constants';

const guestSchema = z.object({
  email: z.string().email('Некорректный email'),
  password: z.string().min(6).optional().or(z.literal('')),
  confirmPassword: z.string().optional(),
  shippingName: z.string().min(1, 'Укажите имя'),
  shippingPhone: z.string().min(1, 'Укажите телефон'),
  shippingAddress: z.string().optional(),
  orderComment: z.string().optional(),
});

type FormData = z.infer<typeof guestSchema>;

const DELIVERY_PRICE = 30000;

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCartStore();
  const { isLoggedIn, user } = useAuthStore();
  const { mutate: createOrder, isPending } = useCreateOrder();
  const navigate = useNavigate();

  const [formTab, setFormTab] = useState<'guest' | 'register'>(isLoggedIn ? 'guest' : 'guest');
  const [shippingMethod, setShippingMethod] = useState<'courier' | 'warehouse' | 'store'>('courier');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'qiwi' | 'apple_pay'>('card');

  const deliveryCents = shippingMethod === 'courier' ? DELIVERY_PRICE : 0;
  const subtotal = totalPrice();

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(guestSchema),
    defaultValues: {
      shippingName: user ? `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim() : '',
      shippingPhone: user?.phone ?? '',
      shippingAddress: user?.address ? `${user.country ?? ''}, ${user.city ?? ''}, ${user.address}` : '',
      orderComment: user?.courierComment ?? '',
    },
  });

  const onSubmit = (data: FormData) => {
    if (items.length === 0) return;

    createOrder(
      {
        items: items.map((i) => ({
          productId: i.productId,
          variantId: i.variantId,
          quantity: i.quantity,
          priceCents: i.priceCents,
        })),
        shippingMethod,
        paymentMethod,
        shippingName: data.shippingName,
        shippingPhone: data.shippingPhone,
        shippingAddress: data.shippingAddress,
        orderComment: data.orderComment,
      },
      {
        onSuccess: () => {
          clearCart();
          navigate(ROUTES.ACCOUNT_ORDERS);
        },
      },
    );
  };

  if (items.length === 0) {
    return (
      <div className="container py-16 text-center">
        <p className="text-gray-500">Корзина пуста</p>
        <Link to={ROUTES.CATALOG} className="mt-4 inline-block text-[#F5A623] hover:underline">
          Перейти в каталог
        </Link>
      </div>
    );
  }

  return (
    <div className="container py-8">
      {/* Order summary */}
      <h1 className="mb-4 text-xl font-semibold text-gray-900 md:text-2xl">Ваш заказ</h1>

      {/* Mobile card layout */}
      <div className="mb-4 divide-y divide-gray-100 rounded-lg border bg-white md:hidden">
        {items.map((item) => (
          <div key={`${item.productId}-${item.variantId}`} className="flex items-center gap-3 p-3">
            <img src={getProductImage(item.imageUrl, item.productId)} alt={item.name} className="h-14 w-14 shrink-0 rounded object-cover" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{item.name}</p>
              <p className="text-xs text-gray-400">{item.quantity} × {formatPrice(item.priceCents)}</p>
            </div>
            <p className="text-sm font-semibold text-gray-900 shrink-0">{formatPrice(item.priceCents * item.quantity)}</p>
          </div>
        ))}
      </div>

      {/* Desktop table */}
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 text-left text-xs uppercase tracking-wider text-gray-400">
              <th className="pb-2 font-medium">Товар</th>
              <th className="pb-2 font-medium">Цена</th>
              <th className="pb-2 font-medium">Количество</th>
              <th className="pb-2 text-right font-medium">Подытог</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {items.map((item) => (
              <tr key={`${item.productId}-${item.variantId}`}>
                <td className="py-3">
                  <div className="flex items-center gap-3">
                    <img src={getProductImage(item.imageUrl, item.productId)} alt={item.name} className="h-14 w-14 rounded object-cover" />
                    <div>
                      <p className="font-medium text-gray-900">{item.name}</p>
                      {item.harvestDate && <p className="text-xs text-gray-400">Дата качки: {item.harvestDate}</p>}
                      {item.state && <p className="text-xs text-gray-400">Состояние: {item.state}</p>}
                    </div>
                  </div>
                </td>
                <td className="py-3 text-gray-700">{formatPrice(item.priceCents)}</td>
                <td className="py-3">
                  <span className="flex items-center gap-2">
                    <span className="flex h-7 w-7 items-center justify-center rounded bg-[#F5A623] text-white text-xs">−</span>
                    <span>{item.quantity}</span>
                    <span className="flex h-7 w-7 items-center justify-center rounded bg-[#F5A623] text-white text-xs">+</span>
                  </span>
                </td>
                <td className="py-3 text-right font-medium text-gray-900">
                  {formatPrice(item.priceCents * item.quantity)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-10">
        {/* Personal info / form */}
        <div className="rounded bg-gray-50 p-6">
          <h2 className="mb-5 text-center text-xl font-semibold text-gray-900">Оформление</h2>

          {isLoggedIn && user ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <h3 className="mb-2 text-sm font-medium text-gray-700">Личные данные</h3>
                <p className="text-sm text-gray-600">{user.firstName} {user.lastName}</p>
                {user.country && <p className="text-sm text-gray-600">{user.country}, {user.city}</p>}
                {user.address && <p className="text-sm text-gray-600">{user.address}</p>}
                {user.phone && <p className="text-sm text-gray-600">тел. {user.phone}</p>}
              </div>
              <div>
                <label className="mb-1 block text-sm text-gray-700">Комментарии к заказу:</label>
                <textarea
                  {...register('orderComment')}
                  rows={4}
                  className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-[#F5A623] focus:outline-none resize-none"
                  placeholder="Пожалуйста, доставка до 13:00."
                />
                <input type="hidden" {...register('shippingName')} value={`${user.firstName ?? ''} ${user.lastName ?? ''}`.trim()} />
                <input type="hidden" {...register('shippingPhone')} value={user.phone ?? ''} />
              </div>
            </div>
          ) : (
            <>
              <div className="mb-5 flex justify-center gap-8">
                {(['guest', 'register'] as const).map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setFormTab(tab)}
                    className={`border-b-2 pb-1 text-sm transition-colors ${
                      formTab === tab ? 'border-gray-900 text-gray-900 font-medium' : 'border-transparent text-gray-400'
                    }`}
                  >
                    {tab === 'guest' ? 'Без регистрации' : 'Регистрация'}
                  </button>
                ))}
              </div>
              <div className="mx-auto max-w-sm space-y-4">
                <Input label="Email:" {...register('email')} error={errors.email?.message} />
                {formTab === 'register' && (
                  <>
                    <Input label="Пароль:" type="password" {...register('password')} />
                    <Input label="Повторите пароль:" type="password" {...register('confirmPassword')} />
                  </>
                )}
                <Input label="Имя:" {...register('shippingName')} error={errors.shippingName?.message} />
                <Input label="Телефон:" {...register('shippingPhone')} error={errors.shippingPhone?.message} />
                <Input label="Адрес доставки:" {...register('shippingAddress')} />
              </div>
            </>
          )}
        </div>

        {/* Shipping + Payment */}
        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <h2 className="mb-4 text-lg font-semibold text-gray-900">Способ доставки</h2>
            <div className="space-y-3">
              {SHIPPING_METHODS.map((method) => (
                <label
                  key={method.id}
                  className={`flex cursor-pointer items-start gap-3 rounded border p-4 transition-colors ${
                    shippingMethod === method.id ? 'border-[#F5A623] bg-orange-50' : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="shipping"
                    value={method.id}
                    checked={shippingMethod === method.id}
                    onChange={() => setShippingMethod(method.id as typeof shippingMethod)}
                    className="mt-0.5 accent-[#F5A623]"
                  />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{method.label}</p>
                    <p className="text-xs text-gray-500">{method.sub}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div>
            <h2 className="mb-4 text-lg font-semibold text-gray-900">Оплата</h2>
            <div className="space-y-3">
              {PAYMENT_METHODS.map((method) => (
                <label
                  key={method.id}
                  className={`flex cursor-pointer items-start gap-3 rounded border p-4 transition-colors ${
                    paymentMethod === method.id ? 'border-[#F5A623] bg-orange-50' : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value={method.id}
                    checked={paymentMethod === method.id}
                    onChange={() => setPaymentMethod(method.id as typeof paymentMethod)}
                    className="mt-0.5 accent-[#F5A623]"
                  />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{method.label}</p>
                    <p className="text-xs text-gray-500">{method.sub}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Order summary */}
        <div className="mt-10">
          <h2 className="mb-4 text-center text-lg font-semibold text-gray-900">Завершение заказа</h2>
          <div className="mx-auto max-w-sm rounded border border-gray-200 p-6">
            <div className="flex justify-between text-sm text-gray-700">
              <span>Сумма заказа</span>
              <span className="font-medium">{formatPrice(subtotal)}</span>
            </div>
            <div className="mt-2 flex justify-between text-sm text-gray-700">
              <span>Доставка</span>
              <span className="font-medium">
                {deliveryCents === 0 ? 'Бесплатно' : formatPrice(deliveryCents)}
              </span>
            </div>
            {shippingMethod === 'courier' && (
              <p className="mt-1 text-xs text-gray-400">Срок доставки 3-4 дня</p>
            )}
            <div className="mt-4 border-t border-gray-100 pt-4 flex justify-between font-semibold text-gray-900">
              <span>Итого</span>
              <span>{formatPrice(subtotal + deliveryCents)}</span>
            </div>
            <Button type="submit" size="lg" className="mt-5 w-full" loading={isPending}>
              Оформить заказ
            </Button>
            <p className="mt-3 text-center text-xs text-gray-400">
              Я согласен с{' '}
              <a href="/privacy" className="text-[#F5A623] hover:underline">
                политикой конфиденциальности
              </a>
            </p>
          </div>
        </div>
      </form>
    </div>
  );
}
