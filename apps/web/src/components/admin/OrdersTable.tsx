'use client';
import Link from 'next/link';
import { Order, OrderStatus, PaymentStatus, PaymentMethod } from '@/lib/api/orders';
import { formatPrice, formatDate, getOrderStatusColor } from '@/lib/utils';
import { ChevronRight, ShoppingBag } from 'lucide-react';

const PAYMENT_STATUS_COLOR: Record<PaymentStatus, string> = {
  UNPAID: 'bg-gray-100 text-gray-700',
  PAID: 'bg-green-100 text-green-700',
  FAILED: 'bg-red-100 text-red-700',
  REFUNDED: 'bg-purple-100 text-purple-700',
};

const PAYMENT_METHOD_COLOR: Record<PaymentMethod, string> = {
  COD: 'bg-amber-100 text-amber-700',
  BKASH: 'bg-pink-100 text-pink-700',
  SSLCOMMERZ: 'bg-blue-100 text-blue-700',
};

interface Props {
  orders: Order[];
  isLoading: boolean;
}

export default function OrdersTable({ orders, isLoading }: Props) {
  if (isLoading) {
    return (
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="px-6 py-4 border-b border-gray-50 animate-pulse flex gap-4">
            <div className="h-4 bg-gray-100 rounded w-28" />
            <div className="h-4 bg-gray-100 rounded w-36" />
            <div className="h-4 bg-gray-100 rounded w-12 ml-auto" />
          </div>
        ))}
      </div>
    );
  }

  if (!orders.length) {
    return (
      <div className="bg-white rounded-xl border border-gray-100 flex flex-col items-center justify-center py-20 gap-3">
        <ShoppingBag className="w-10 h-10 text-gray-200" />
        <p className="text-gray-400 text-sm">No orders found</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
      {/* Desktop table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Order</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Customer</th>
              <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Items</th>
              <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Total</th>
              <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Payment</th>
              <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
              <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Date</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {orders.map((order) => (
              <tr
                key={order.id}
                className="hover:bg-gray-50 transition-colors cursor-pointer group"
                onClick={() => {
                  if (typeof window !== 'undefined') {
                    window.location.href = `/admin/orders/${order.id}`;
                  }
                }}
              >
                <td className="px-4 py-3">
                  <span className="font-mono font-semibold text-gray-800 text-xs">{order.orderNumber}</span>
                </td>
                <td className="px-4 py-3">
                  <p className="font-medium text-gray-800">{order.user.name || '—'}</p>
                  <p className="text-xs text-gray-400">{order.user.phone}</p>
                </td>
                <td className="px-4 py-3 text-center text-gray-600">{order.items.length}</td>
                <td className="px-4 py-3 text-right font-semibold text-gray-800">
                  {formatPrice(order.total)}
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-col items-center gap-1">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${PAYMENT_METHOD_COLOR[order.paymentMethod]}`}>
                      {order.paymentMethod}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${PAYMENT_STATUS_COLOR[order.paymentStatus]}`}>
                      {order.paymentStatus}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3 text-center">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${getOrderStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-right text-xs text-gray-400 whitespace-nowrap">
                  {formatDate(order.createdAt)}
                </td>
                <td className="px-4 py-3">
                  <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-gray-500 ml-auto" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden divide-y divide-gray-50">
        {orders.map((order) => (
          <Link
            key={order.id}
            href={`/admin/orders/${order.id}`}
            className="flex items-start gap-3 px-4 py-4 hover:bg-gray-50 transition-colors"
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-mono font-semibold text-xs text-gray-800">{order.orderNumber}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${getOrderStatusColor(order.status)}`}>
                  {order.status}
                </span>
              </div>
              <p className="text-sm text-gray-700">{order.user.name || order.user.phone}</p>
              <p className="text-xs text-gray-400 mt-0.5">{order.items.length} items · {formatDate(order.createdAt)}</p>
            </div>
            <div className="text-right shrink-0">
              <p className="font-semibold text-gray-800">{formatPrice(order.total)}</p>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${PAYMENT_STATUS_COLOR[order.paymentStatus]}`}>
                {order.paymentStatus}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
