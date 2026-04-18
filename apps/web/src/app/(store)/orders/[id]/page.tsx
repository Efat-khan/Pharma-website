'use client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { CheckCircle, Clock, Truck, Package, XCircle, ChevronLeft } from 'lucide-react';
import api from '@/lib/axios';
import { formatPrice, formatDate, getOrderStatusColor } from '@/lib/utils';
import toast from 'react-hot-toast';

const STATUS_ICONS: Record<string, any> = {
  PENDING: Clock, CONFIRMED: CheckCircle, PROCESSING: Package,
  SHIPPED: Truck, DELIVERED: CheckCircle, CANCELLED: XCircle,
};

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const qc = useQueryClient();

  const { data: order, isLoading } = useQuery({
    queryKey: ['order', id],
    queryFn: () => api.get(`/orders/${id}`).then(r => r.data),
  });

  const cancelMutation = useMutation({
    mutationFn: () => api.patch(`/orders/${id}/cancel`, { reason: 'Cancelled by customer' }),
    onSuccess: () => {
      toast.success('Order cancelled');
      qc.invalidateQueries({ queryKey: ['order', id] });
      qc.invalidateQueries({ queryKey: ['orders'] });
    },
    onError: (e: any) => toast.error(e.response?.data?.message || 'Failed to cancel'),
  });

  if (isLoading) return (
    <div className="container-custom py-8 animate-pulse">
      <div className="h-6 bg-gray-100 rounded w-1/3 mb-6" />
      <div className="bg-white rounded-xl border p-5 space-y-3">
        {[1, 2, 3].map(i => <div key={i} className="h-4 bg-gray-100 rounded" />)}
      </div>
    </div>
  );

  if (!order) return <div className="container-custom py-20 text-center text-gray-500">Order not found</div>;

  const canCancel = ['PENDING', 'CONFIRMED'].includes(order.status);

  return (
    <div className="container-custom py-6 max-w-3xl">
      <button onClick={() => router.back()} className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-5">
        <ChevronLeft className="w-4 h-4" /> Back to Orders
      </button>

      {/* Header */}
      <div className="bg-white rounded-xl border border-gray-100 p-5 mb-4">
        <div className="flex items-start justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-xl font-bold text-gray-900">{order.orderNumber}</h1>
            <p className="text-sm text-gray-500 mt-1">Placed on {formatDate(order.createdAt)}</p>
          </div>
          <div className="flex items-center gap-3">
            <span className={`text-sm font-semibold px-3 py-1 rounded-full ${getOrderStatusColor(order.status)}`}>
              {order.status}
            </span>
            {canCancel && (
              <button
                onClick={() => cancelMutation.mutate()}
                disabled={cancelMutation.isPending}
                className="text-sm text-red-600 hover:text-red-700 font-medium border border-red-200 px-3 py-1 rounded-lg hover:bg-red-50 transition-colors"
              >
                Cancel Order
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Status Timeline */}
      {order.statusLogs?.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-100 p-5 mb-4">
          <h2 className="font-semibold text-gray-900 mb-4">Order Timeline</h2>
          <div className="space-y-3">
            {order.statusLogs.map((log: any) => {
              const Icon = STATUS_ICONS[log.status] || Clock;
              return (
                <div key={log.id} className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-brand-50 rounded-full flex items-center justify-center flex-shrink-0">
                    <Icon className="w-4 h-4 text-brand-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">{log.status}</p>
                    {log.note && <p className="text-xs text-gray-500">{log.note}</p>}
                    <p className="text-xs text-gray-400">{formatDate(log.createdAt)}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Items */}
      <div className="bg-white rounded-xl border border-gray-100 p-5 mb-4">
        <h2 className="font-semibold text-gray-900 mb-4">Order Items</h2>
        <div className="space-y-3">
          {order.items.map((item: any) => {
            const image = item.product?.images?.[0]?.url;
            return (
              <div key={item.id} className="flex gap-3 pb-3 border-b border-gray-50 last:border-0 last:pb-0">
                <div className="w-14 h-14 bg-gray-50 rounded-lg overflow-hidden flex-shrink-0">
                  {image ? (
                    <Image src={image} alt={item.productName} width={56} height={56} className="object-contain p-1" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xl">💊</div>
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-800">{item.productName}</p>
                  <p className="text-xs text-gray-400">{item.productSku}</p>
                  <p className="text-sm text-gray-600 mt-1">
                    {formatPrice(item.sellingPrice)} × {item.quantity}
                    <span className="ml-2 font-semibold text-gray-800">{formatPrice(item.total)}</span>
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Totals */}
        <div className="border-t border-gray-100 mt-4 pt-4 space-y-2 text-sm">
          <div className="flex justify-between text-gray-600">
            <span>Subtotal</span><span>{formatPrice(order.subtotal)}</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>Delivery</span>
            <span>{Number(order.deliveryCharge) === 0 ? 'FREE' : formatPrice(order.deliveryCharge)}</span>
          </div>
          {Number(order.discount) > 0 && (
            <div className="flex justify-between text-green-600">
              <span>Discount</span><span>- {formatPrice(order.discount)}</span>
            </div>
          )}
          <div className="flex justify-between font-bold text-base text-gray-900 pt-2 border-t border-gray-100">
            <span>Total</span><span>{formatPrice(order.total)}</span>
          </div>
        </div>
      </div>

      {/* Delivery address */}
      <div className="bg-white rounded-xl border border-gray-100 p-5">
        <h2 className="font-semibold text-gray-900 mb-3">Delivery Address</h2>
        <p className="text-sm font-medium text-gray-800">{order.addressSnapshot.recipientName}</p>
        <p className="text-sm text-gray-600">{order.addressSnapshot.phone}</p>
        <p className="text-sm text-gray-600">
          {order.addressSnapshot.line1}{order.addressSnapshot.line2 ? `, ${order.addressSnapshot.line2}` : ''},
          {' '}{order.addressSnapshot.thana}, {order.addressSnapshot.district}
        </p>
        <p className="text-sm text-gray-500 mt-2">
          Payment: <span className="font-medium text-gray-700">{order.paymentMethod}</span>
          {order.payment && (
            <> · Status: <span className="font-medium text-gray-700">{order.payment.status}</span></>
          )}
        </p>
      </div>
    </div>
  );
}
