import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';
import { Product, Category, Brand, ApiResponse } from '@/types';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

export interface ProductFilters {
  search?: string;
  categoryId?: string;
  brandId?: string;
  isActive?: string;
  requiresPrescription?: string;
  page?: number;
  limit?: number;
}

export interface ProductFormData {
  name: string;
  slug: string;
  genericName?: string;
  description?: string;
  shortDescription?: string;
  sku: string;
  mrp: number;
  sellingPrice: number;
  stock: number;
  unit?: string;
  packSize?: string;
  requiresPrescription: boolean;
  isActive: boolean;
  isFeatured: boolean;
  categoryId: string;
  brandId?: string;
  images?: { url: string; publicId?: string; isPrimary: boolean; sortOrder: number }[];
}

export function useAdminProducts(filters: ProductFilters = {}) {
  return useQuery<ApiResponse<Product[]>>({
    queryKey: ['admin-products', filters],
    queryFn: () =>
      api
        .get('/admin/products', { params: filters })
        .then((r) => r.data),
  });
}

export function useAdminProduct(id: string) {
  return useQuery<Product>({
    queryKey: ['admin-product', id],
    queryFn: () => api.get(`/admin/products/${id}`).then((r) => r.data),
    enabled: !!id,
  });
}

export function useAdminCategories() {
  return useQuery<Category[]>({
    queryKey: ['admin-categories'],
    queryFn: () => api.get('/admin/categories').then((r) => r.data),
    staleTime: 5 * 60 * 1000,
  });
}

export function useAdminBrands() {
  return useQuery<Brand[]>({
    queryKey: ['admin-brands'],
    queryFn: () => api.get('/admin/brands').then((r) => r.data),
    staleTime: 5 * 60 * 1000,
  });
}

export function useCreateProduct() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (data: ProductFormData) =>
      api.post('/admin/products', data).then((r) => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      toast.success('Product created successfully');
      router.push('/admin/products');
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || 'Failed to create product');
    },
  });
}

export function useUpdateProduct(id: string) {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (data: Partial<ProductFormData>) =>
      api.patch(`/admin/products/${id}`, data).then((r) => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      queryClient.invalidateQueries({ queryKey: ['admin-product', id] });
      toast.success('Product updated successfully');
      router.push('/admin/products');
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || 'Failed to update product');
    },
  });
}

export function useToggleProductActive() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      api.patch(`/admin/products/${id}`, { isActive }).then((r) => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || 'Failed to update product');
    },
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      api.delete(`/admin/products/${id}`).then((r) => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      toast.success('Product deleted successfully');
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || 'Failed to delete product');
    },
  });
}
