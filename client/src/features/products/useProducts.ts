import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Product, Pagination } from '@/types';

interface ProductsResponse {
  products: Product[];
  pagination: Pagination;
}

interface ProductsParams {
  category?: string;
  search?: string;
  sort?: string;
  page?: number;
  limit?: number;
  minPrice?: number;
  maxPrice?: number;
}

export function useProducts(params: ProductsParams = {}) {
  return useQuery<ProductsResponse>({
    queryKey: ['products', params],
    queryFn: async () => {
      const { data } = await api.get('/products', { params });
      return data.data;
    },
  });
}

export function useFeaturedProducts() {
  return useQuery<Product[]>({
    queryKey: ['products', 'featured'],
    queryFn: async () => {
      const { data } = await api.get('/products/featured');
      return data.data;
    },
  });
}

export function usePopularProducts() {
  return useQuery<Product[]>({
    queryKey: ['products', 'popular'],
    queryFn: async () => {
      const { data } = await api.get('/products/popular');
      return data.data;
    },
  });
}

export function useProduct(slug: string) {
  return useQuery<Product>({
    queryKey: ['product', slug],
    queryFn: async () => {
      const { data } = await api.get(`/products/${slug}`);
      return data.data;
    },
    enabled: !!slug,
  });
}
