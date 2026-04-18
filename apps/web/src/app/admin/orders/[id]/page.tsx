'use client';
import { useParams, useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth.store';
import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowLeft, Printer, FileText, MapPin, Phone, User } from 'lucide-react';
import { useAdminOrder, PaymentStatus, PaymentMethod } from '@/lib/api/orders';
import { formatPrice, formatDate, getOrderStatusColor } from '@/lib/utils';
import OrderStatusUpdate from '@/components/admin/OrderStatusUpdate';
import OrderStatusTimeline from '@/components/admin/OrderStatusTimeline';

const PAYMENT_STATUS_COLOR: Record<PaymentStatus, string> = {
  UNPAID: 'bg-gray-100 text-gray-700',
  PAID: 'bg-green-100 text-green-700',
  FAILED: 'bg-red-100 text-red-700',
  REFUNDED: 'bg-purple-100 text-purple-700',
};

const PAYMENT_METHOD_LABEL: Record<PaymentMethod, string> = {
  COD: 'Cash on Delivery',
  BKASH: 'bKash',
  SSLCOMMERZ: 'SSLCommerz',
};

export default function AdminOrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const user = useAuthStore((s) => s.user);
  const router = useRouter();
  const printRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (user && user.role !== 'ADMIN' && user.role !== 'PHARMACIST') router.push('/');
  }, [user, router]);

  const { data: order, isLoading } = useAdminOrder(id);

  const handlePrint = () => window.print();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="space-y-4 w-full max-w-3xl p-6">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="bg-white rounded-xl border p-6 animate-pulse h-24" />
          ))}
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-4">Order not found</p>
          <Link href="/admin/orders" className="text-brand-700 hover:underline text-sm">
            ← Back to Orders
          </Link>
        </div>
      </div>
    );
  }

  const addr = order.addressSnapshot;

  return (
    <>
      {/* Print styles injected inline */}
      <style>{`
        @media print {
          .no-print { display: none !important; }
          .print-only { display: block !important; }
          body { background: white !important; }
          .print-area { box-shadow: none !important; border: none !important; }
        }
        .print-only { display: none; }
      `}</style>

      <div className="min-h-screen bg-gray-50 no-print">
        {/* Header */}
        <header className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between no-print">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-brand-700 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">A</span>
            </div>
            <span className="font-bold text-gray-900">Admin Panel</span>
          </div>
          <Link href="/" className="text-sm text-brand-700 hover:underline">← Back to Store</Link>
        </header>

        <div className="p-6 max-w-7xl mx-auto">
          {/* Breadcrumb + actions */}
          <div className="flex items-center justify-between mb-6 no-print">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Link href="/admin" className="hover:text-gray-800">Dashboard</Link>
              <span>/</span>
              <Link href="/admin/orders" className="hover:text-gray-800">Orders</Link>
              <span>/</span>
              <span className="text-gray-800 font-mono font-medium">{order.orderNumber}</span>
            </div>
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <Printer className="w-4 h-4" />
              Print Invoice
            </button>
          </div>

          {/* Print header (only visible when printing) */}
          <div className="print-only mb-8 text-center">
            <h1 className="text-2xl font-bold">Pharmaci</h1>
            <p className="text-gray-500 text-sm">Tax Invoice / Order Receipt</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" ref={printRef}>
            {/* LEFT: main content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Order header */}
              <div className="bg-white rounded-xl border border-gray-100 p-6 print-area">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Order Number</p>
                    <h2 className="text-xl font-bold font-mono text-gray-900">{order.orderNumber}</h2>
                    <p className="text-sm text-gray-500 mt-1">{formatDate(order.createdAt)}</p>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getOrderStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${PAYMENT_STATUS_COLOR[order.paymentStatus]}`}>
                      {order.paymentStatus}
                    </span>
                  </div>
                </div>
              </div>

              {/* Customer info */}
              <div className="bg-white rounded-xl border border-gray-100 p-6 print-area">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <User className="w-4 h-4 text-gray-400" />
                  Customer
                </h3>
                <div className="space-y-2 text-sm">
                  <p className="font-medium text-gray-800">{order.user.name || '(No name)'}</p>
                  <div className="flex items-center gap-2 text-gray-500">
                    <Phone className="w-3.5 h-3.5" />
                    {order.user.phone}
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-50">
                  <p className="text-xs font-medium text-gray-500 mb-2 flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> Delivery Address
                  </p>
                  {addr.label && <p className="text-sm font-medium text-gray-700">{addr.label}</p>}
                  <p className="text-sm text-gray-600">{addr.address}</p>
                  {(addr.area || addr.city) && (
                    <p className="text-sm text-gray-500">{[addr.area, addr.city].filter(Boolean).join(', ')}</p>
                  )}
                  {addr.phone && <p className="text-sm text-gray-500 mt-1">{addr.phone}</p>}
                </div>
              </div>

              {/* Items table */}
              <div className="bg-white rounded-xl border border-gray-100 overflow-hidden print-area">
                <div className="px-6 py-4 border-b border-gray-50">
                  <h3 className="font-semibold text-gray-900">Items ({order.items.length})</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="text-left px-6 py-2 text-xs text-gray-500 font-medium">Product</th>
                        <th className="text-center px-4 py-2 text-xs text-gray-500 font-medium">Qty</th>
                        <th className="text-right px-4 py-2 text-xs text-gray-500 font-medium">Unit Price</th>
                        <th className="text-right px-6 py-2 text-xs text-gray-500 font-medium">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {order.items.map((item) => (
                        <tr key={item.id}>
                          <td className="px-6 py-3">
                            <p className="font-medium text-gray-800">{item.productName}</p>
                            <p className="text-xs text-gray-400">{item.productSku}</p>
                          </td>
                          <td className="px-4 py-3 text-center text-gray-700">{item.quantity}</td>
                          <td className="px-4 py-3 text-right text-gray-700">{formatPrice(item.sellingPrice)}</td>
                          <td className="px-6 py-3 text-right font-semibold text-gray-800">{formatPrice(item.total)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Order summary */}
                <div className="px-6 py-4 border-t border-gray-100 space-y-2">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Subtotal</span>
                    <span>{formatPrice(order.subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Delivery Charge</span>
                    <span>{formatPrice(order.deliveryCharge)}</span>
                  </div>
                  {Number(order.discount) > 0 && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span>Discount {order.couponCode ? `(${order.couponCode})` : ''}</span>
                      <span>−{formatPrice(order.discount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-base font-bold text-gray-900 border-t border-gray-100 pt-2 mt-2">
                    <span>Total</span>
                    <span>{formatPrice(order.total)}</span>
                  </div>
                </div>
              </div>

              {/* Payment info */}
              <div className="bg-white rounded-xl border border-gray-100 p-6 print-area">
                <h3 className="font-semibold text-gray-900 mb-4">Payment</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Method</span>
                    <span className="font-medium text-gray-800">{PAYMENT_METHOD_LABEL[order.paymentMethod]}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Status</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${PAYMENT_STATUS_COLOR[order.paymentStatus]}`}>
                      {order.paymentStatus}
                    </span>
                  </div>
                  {order.payment?.transactionId && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Transaction ID</span>
                      <span className="font-mono text-xs text-gray-700">{order.payment.transactionId}</span>
                    </div>
                  )}
                  {order.payment?.paidAt && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Paid At</span>
                      <span className="text-gray-700">{formatDate(order.payment.paidAt)}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Prescription link */}
              {order.prescriptionId && (
                <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 flex items-center gap-3 print-area">
                  <FileText className="w-5 h-5 text-amber-600 shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-amber-800">Prescription required</p>
                    <p className="text-xs text-amber-600">ID: {order.prescriptionId}</p>
                  </div>
                  <Link
                    href={`/admin/prescriptions/${order.prescriptionId}`}
                    className="text-sm text-amber-700 font-medium hover:underline no-print"
                  >
                    Review →
                  </Link>
                </div>
              )}

              {/* Notes */}
              {order.notes && (
                <div className="bg-white rounded-xl border border-gray-100 p-6 print-area">
                  <h3 className="font-semibold text-gray-900 mb-2">Order Notes</h3>
                  <p className="text-sm text-gray-600">{order.notes}</p>
                </div>
              )}
            </div>

            {/* RIGHT: status management */}
            <div className="space-y-6 no-print">
              {/* Status update */}
              <div className="bg-white rounded-xl border border-gray-100 p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Update Status</h3>
                <OrderStatusUpdate orderId={order.id} currentStatus={order.status} />
              </div>

              {/* Timeline */}
              <div className="bg-white rounded-xl border border-gray-100 p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Status History</h3>
                <OrderStatusTimeline logs={order.statusLogs ?? []} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
