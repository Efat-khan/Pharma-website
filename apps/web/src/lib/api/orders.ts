import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import api from '@/lib/axios';

export type OrderStatus =
  | 'PENDING' | 'CONFIRMED' | 'PROCESSING'
  | 'SHIPPED' | 'DELIVERED' | 'CANCELLED' | 'REFUNDED';

export type PaymentStatus = 'UNPAID' | 'PAID' | 'FAILED' | 'REFUNDED';
export type PaymentMethod = 'COD' | 'BKASH' | 'SSLCOMMERZ';

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  productSku: string;
  quantity: number;
  mrp: number;
  sellingPrice: number;
  total: number;
}

export interface OrderStatusLog {
  id: string;
  status: OrderStatus;
  note: string | null;
  createdAt: string;
  createdBy: string | null;
}

export interface AddressSnapshot {
  label?: string;
  address: string;
  area?: string;
  city?: string;
  phone?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  subtotal: number;
  deliveryCharge: number;
  discount: number;
  total: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  notes: string | null;
  couponCode: string | null;
  cancelReason: string | null;
  addressSnapshot: AddressSnapshot;
  prescriptionId: string | null;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    name: string | null;
    phone: string;
  };
  items: OrderItem[];
  statusLogs: OrderStatusLog[];
  payment?: {
    id: string;
    transactionId: string | null;
    status: PaymentStatus;
    amount: number;
    paidAt: string | null;
  };
}

export interface OrderFilters {
  status?: string;
  paymentStatus?: string;
  paymentMethod?: string;
  search?: string;
  from?: string;
  to?: string;
  page?: number;
  limit?: number;
}

export interface OrdersResponse {
  data: Order[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface DailyStats {
  todayOrders: number;
  pendingOrders: number;
  todayRevenue: number;
}

export function useAdminOrders(filters: OrderFilters = {}) {
  const params = new URLSearchParams();
  if (filters.status) params.set('status', filters.status);
  if (filters.paymentStatus) params.set('paymentStatus', filters.paymentStatus);
  if (filters.paymentMethod) params.set('paymentMethod', filters.paymentMethod);
  if (filters.search) params.set('search', filters.search);
  if (filters.from) params.set('from', filters.from);
  if (filters.to) params.set('to', filters.to);
  params.set('page', String(filters.page ?? 1));
  params.set('limit', String(filters.limit ?? 25));

  return useQuery<OrdersResponse>({
    queryKey: ['admin-orders', filters],
    queryFn: () => api.get(`/admin/orders?${params}`).then((r) => r.data),
    staleTime: 30_000,
  });
}

export function useAdminOrder(id: string) {
  return useQuery<Order>({
    queryKey: ['admin-order', id],
    queryFn: () => api.get(`/admin/orders/${id}`).then((r) => r.data),
    enabled: !!id,
  });
}

export function useAdminOrderStats() {
  return useQuery<DailyStats>({
    queryKey: ['admin-order-stats'],
    queryFn: () => api.get('/admin/orders/stats').then((r) => r.data),
    staleTime: 60_000,
  });
}

export function useUpdateOrderStatus(id: string) {
  const qc = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (payload: { status: OrderStatus; note?: string }) =>
      api.patch(`/admin/orders/${id}/status`, payload).then((r) => r.data),
    onSuccess: () => {
      toast.success('Order status updated');
      qc.invalidateQueries({ queryKey: ['admin-order', id] });
      qc.invalidateQueries({ queryKey: ['admin-orders'] });
      qc.invalidateQueries({ queryKey: ['admin-order-stats'] });
    },
    onError: () => toast.error('Failed to update status'),
  });
}
