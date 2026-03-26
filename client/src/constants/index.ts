export const ROUTES = {
  HOME: '/',
  CATALOG: '/catalog',
  PRODUCT: (slug: string) => `/catalog/${slug}`,
  CART: '/cart',
  CHECKOUT: '/checkout',
  ACCOUNT_ORDERS: '/account/orders',
  ACCOUNT_PROFILE: '/account/profile',
  ACCOUNT_ADDRESS: '/account/address',
};

export const SHIPPING_METHODS = [
  { id: 'courier', label: 'Курьерская доставка: 300 Р', sub: 'Бесплатная доставка при сумме заказа от 2500 рублей.' },
  { id: 'warehouse', label: 'Самовывоз со склада', sub: 'г. Москва, ул. Большая Новодмитровская, 5А' },
  { id: 'store', label: 'Самовывоз из магазина «Золотой купец»', sub: 'г. Москва, ул. Большая Новодмитровская, 32' },
] as const;

export const PAYMENT_METHODS = [
  { id: 'card', label: 'Банковские карты', sub: 'Visa, Mastercard' },
  { id: 'qiwi', label: 'Qiwi', sub: 'Кэшбэк 5% от суммы заказа без доставки' },
  { id: 'apple_pay', label: 'Apple Pay', sub: 'Быстрый платёж мобильным телефоном' },
] as const;

export const CONTACT_INFO = {
  email: 'info@kadmed.ru',
  phone: '8 800 222-33-22',
  address: '103021 Москва, ул. Пушкинская 29-22',
};
