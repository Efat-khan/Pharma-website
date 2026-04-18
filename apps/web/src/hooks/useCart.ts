'use client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import api from '@/lib/axios';
import { useCartStore } from '@/store/cart.store';
import { useAuthStore } from '@/store/auth.store';
import { useEffect } from 'react';

export function useCart() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const setCart = useCartStore((s) => s.setCart);

  const query = useQuery({
    queryKey: ['cart'],
    queryFn: () => api.get('/cart').then(r => r.data),
    enabled: isAuthenticated,
  });

  useEffect(() => {
    if (query.data) setCart(query.data);
  }, [query.data, setCart]);

  return query;
}

export function useAddToCart() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: { productId: string; quantity: number }) =>
      api.post('/cart/items', data).then(r => r.data),
    onSuccess: (data) => {
      qc.setQueryData(['cart'], data);
      toast.success('Added to cart');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to add to cart');
    },
  });
}

export function useUpdateCartItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ productId, quantity }: { productId: string; quantity: number }) =>
      api.patch(`/cart/items/${productId}`, { quantity }).then(r => r.data),
    onSuccess: (data) => qc.setQueryData(['cart'], data),
    onError: (error: any) => toast.error(error.response?.data?.message || 'Update failed'),
  });
}

export function useRemoveFromCart() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (productId: string) =>
      api.delete(`/cart/items/${productId}`).then(r => r.data),
    onSuccess: (data) => {
      qc.setQueryData(['cart'], data);
      toast.success('Removed from cart');
    },
  });
}
