import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';

// ── Dashboard ────────────────────────────────────────────────────────────────

export function useAdminDashboard() {
  return useQuery({
    queryKey: ['admin', 'dashboard'],
    queryFn: async () => {
      const { data } = await api.get('/admin/dashboard');
      return data.data;
    },
  });
}

// ── Products ─────────────────────────────────────────────────────────────────

export function useAdminProducts() {
  return useQuery({
    queryKey: ['admin', 'products'],
    queryFn: async () => {
      const { data } = await api.get('/admin/products');
      return data.data;
    },
  });
}

export function useAdminProduct(id: string) {
  return useQuery({
    queryKey: ['admin', 'product', id],
    queryFn: async () => {
      const { data } = await api.get(`/admin/products/${id}`);
      return data.data;
    },
    enabled: !!id,
  });
}

export function useAdminCreateProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (body: unknown) => {
      const { data } = await api.post('/admin/products', body);
      return data.data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'products'] }),
  });
}

export function useAdminUpdateProduct(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (body: unknown) => {
      const { data } = await api.put(`/admin/products/${id}`, body);
      return data.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'products'] });
      qc.invalidateQueries({ queryKey: ['admin', 'product', id] });
    },
  });
}

export function useAdminDeleteProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/admin/products/${id}`);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'products'] }),
  });
}

// ── Orders ───────────────────────────────────────────────────────────────────

export function useAdminOrders(params: { status?: string; page?: number } = {}) {
  return useQuery({
    queryKey: ['admin', 'orders', params],
    queryFn: async () => {
      const { data } = await api.get('/admin/orders', { params });
      return data.data;
    },
  });
}

export function useAdminUpdateOrderStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status, paymentStatus }: { id: string; status?: string; paymentStatus?: string }) => {
      const { data } = await api.patch(`/admin/orders/${id}/status`, { status, paymentStatus });
      return data.data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'orders'] }),
  });
}

// ── Categories ───────────────────────────────────────────────────────────────

export function useAdminCategories() {
  return useQuery({
    queryKey: ['admin', 'categories'],
    queryFn: async () => {
      const { data } = await api.get('/admin/categories');
      return data.data;
    },
  });
}

export function useAdminCreateCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (body: unknown) => {
      const { data } = await api.post('/admin/categories', body);
      return data.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'categories'] });
      qc.invalidateQueries({ queryKey: ['categories'] });
    },
  });
}

export function useAdminDeleteCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/admin/categories/${id}`);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'categories'] }),
  });
}

// ── Blog ─────────────────────────────────────────────────────────────────────

export function useAdminBlogPosts() {
  return useQuery({
    queryKey: ['admin', 'blog'],
    queryFn: async () => {
      const { data } = await api.get('/admin/blog');
      return data.data;
    },
  });
}

export function useAdminCreateBlogPost() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (body: unknown) => {
      const { data } = await api.post('/admin/blog', body);
      return data.data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'blog'] }),
  });
}

export function useAdminUpdateBlogPost(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (body: unknown) => {
      const { data } = await api.put(`/admin/blog/${id}`, body);
      return data.data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'blog'] }),
  });
}

export function useAdminDeleteBlogPost() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/admin/blog/${id}`);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'blog'] }),
  });
}

// ── Users ─────────────────────────────────────────────────────────────────────

export function useAdminUsers() {
  return useQuery({
    queryKey: ['admin', 'users'],
    queryFn: async () => {
      const { data } = await api.get('/admin/users');
      return data.data;
    },
  });
}
