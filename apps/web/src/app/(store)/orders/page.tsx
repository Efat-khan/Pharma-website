'use client';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Package, ChevronRight } from 'lucide-react';
import api from '@/lib/axios';
import { useAuthStore } from '@/store/auth.store';
import { formatPrice, formatDate, getOrderStatusColor } from '@/lib/utils';

export default function OrdersPage() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const router = useRouter();

  const { data, isLoading } = useQuery({
    queryKey: ['orders'],
    queryFn: () => api.get('/orders').then(r => r.data),
    enabled: isAuthenticated,
  });

  if (!isAuthenticated) {
    return (
      <div className="container-custom py-20 text-center">
        <p className="text-gray-500 mb-4">Please login to view your orders.</p>
        <Link href="/login" className="bg-brand-700 text-white px-6 py-3 rounded-xl font-medium">Login</Link>
      </div>
    );
  }

  if (isLoading) return (
    <div className="container-custom py-8 space-y-3">
      {[1, 2, 3].map(i => (
        <div key={i} className="bg-white rounded-xl border border-gray-100 p-5 animate-pulse">
          <div className="flex justify-between mb-3">
            <div className="h-4 bg-gray-100 rounded w-32" />
            <div className="h-4 bg-gray-100 rounded w-20" />
          </div>
          <div className="h-4 bg-gray-100 rounded w-1/2" />
        </div>
      ))}
    </div>
  );

  if (!data?.data?.length) return (
    <div className="container-custom py-20 text-center">
      <Package className="w-16 h-16 text-gray-200 mx-auto mb-4" />
      <h2 className="text-xl font-bold text-gray-800 mb-2">No orders yet</h2>
      <p className="text-gray-500 mb-6">Start shopping to place your first order.</p>
      <Link href="/products" className="bg-brand-700 text-white px-6 py-3 rounded-xl font-medium">Shop Now</Link>
    </div>
  );

  return (
    <div className="container-custom py-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">My Orders</h1>
      <div className="space-y-3">
        {data.data.map((order: any) => (
          <Link
            key={order.id}
            href={`/orders/${order.id}`}
            className="block bg-white rounded-xl border border-gray-100 p-5 hover:shadow-md hover:border-brand-100 transition-all"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="font-bold text-gray-900">{order.orderNumber}</span>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${getOrderStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </div>
                <p className="text-sm text-gray-500 mb-1">
                  {order.items.length} item{order.items.length > 1 ? 's' : ''} ·{' '}
                  <span className="font-semibold text-gray-700">{formatPrice(order.total)}</span>
                </p>
                <p className="text-xs text-gray-400">{formatDate(order.createdAt)}</p>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-300 flex-shrink-0 mt-0.5" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
