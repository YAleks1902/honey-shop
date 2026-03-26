export function formatPrice(cents: number): string {
  return new Intl.NumberFormat('ru-RU').format(Math.round(cents / 100)) + ' ₽';
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('ru-RU');
}

export function cn(...classes: (string | undefined | false | null)[]): string {
  return classes.filter(Boolean).join(' ');
}

const LOCAL_PRODUCT_IMAGE = '/product-honey.png';

export function getProductImage(imageUrl?: string | null, _seed?: string): string {
  if (!imageUrl || imageUrl.startsWith('/uploads/') || imageUrl.startsWith('http')) {
    return LOCAL_PRODUCT_IMAGE;
  }
  return imageUrl;
}

export const HONEY_PLACEHOLDER = LOCAL_PRODUCT_IMAGE;
export const HONEY_PLACEHOLDER_SM = LOCAL_PRODUCT_IMAGE;
