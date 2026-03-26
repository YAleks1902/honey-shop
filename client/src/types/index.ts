export interface Category {
  id: string;
  name: string;
  slug: string;
  imageUrl?: string;
  createdAt: string;
}

export interface ProductVariant {
  id: string;
  volume: string;
  priceCents: number;
  oldPriceCents?: number;
  discountPercent?: number;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  shortDescription?: string;
  fullDescription?: string;
  imageUrl?: string;
  categoryId?: string;
  harvestDate?: string;
  state?: string;
  crystalSize?: string;
  isFeatured: boolean;
  stock: number;
  category?: Category;
  variants: ProductVariant[];
  reviews?: Review[];
}

export interface Review {
  id: string;
  authorName: string;
  authorCity?: string;
  comment: string;
  createdAt: string;
}

export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  country?: string;
  city?: string;
  address?: string;
  courierComment?: string;
  isAdmin?: boolean;
}

export interface Order {
  id: string;
  status: string;
  totalCents: number;
  deliveryCents: number;
  shippingMethod: string;
  paymentMethod: string;
  shippingName: string;
  shippingPhone: string;
  shippingAddress?: string;
  orderComment?: string;
  paymentStatus: string;
  createdAt: string;
  items: OrderItem[];
}

export interface OrderItem {
  id: string;
  quantity: number;
  priceCents: number;
  product: Pick<Product, 'id' | 'name' | 'imageUrl' | 'slug'>;
  variant?: Pick<ProductVariant, 'volume'>;
}

export interface CartItem {
  productId: string;
  variantId?: string;
  name: string;
  imageUrl?: string;
  volume?: string;
  harvestDate?: string;
  state?: string;
  priceCents: number;
  quantity: number;
}

export interface Pagination {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
}
