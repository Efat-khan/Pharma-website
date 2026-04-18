'use client';
import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth.store';
import { useEffect } from 'react';
import Link from 'next/link';
import {
  ShoppingBag, Search, ChevronLeft, ChevronRight as ChevronRightIcon,
  TrendingUp, Clock, Filter,
} from 'lucide-react';
import { useAdminOrders, useAdminOrderStats, OrderFilters, OrderStatus } from '@/lib/api/orders';
import OrdersTable from '@/components/admin/OrdersTable';
import { formatPrice } from '@/lib/utils';

const ORDER_STATUSES: { value: string; label: string }[] = [
  { value: '', label: 'All Statuses' },
  { value: 'PENDING', label: 'Pending' },
  { value: 'CONFIRMED', label: 'Confirmed' },
  { value: 'PROCESSING', label: 'Processing' },
  { value: 'SHIPPED', label: 'Shipped' },
  { value: 'DELIVERED', label: 'Delivered' },
  { value: 'CANCELLED', label: 'Cancelled' },
  { value: 'REFUNDED', label: 'Refunded' },
];

const PAYMENT_METHODS = [
  { value: '', label: 'All Methods' },
  { value: 'COD', label: 'Cash on Delivery' },
  { value: 'BKASH', label: 'bKash' },
  { value: 'SSLCOMMERZ', label: 'SSLCommerz' },
];

export default function AdminOrdersPage() {
  const user = useAuthStore((s) => s.user);
  const router = useRouter();

  useEffect(() => {
    if (user && user.role !== 'ADMIN' && user.role !== 'PHARMACIST') router.push('/');
  }, [user, router]);

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [status, setStatus] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');

  const filters: OrderFilters = {
    page,
    limit: 25,
    ...(search && { search }),
    ...(status && { status }),
    ...(paymentMethod && { paymentMethod }),
    ...(from && { from }),
    ...(to && { to }),
  };

  const { data, isLoading } = useAdminOrders(filters);
  const { data: stats } = useAdminOrderStats();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch(searchInput.trim());
    setPage(1);
  };

  const handleFilterChange = useCallback(() => setPage(1), []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-brand-700 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">A</span>
          </div>
          <span className="font-bold text-gray-900">Admin Panel</span>
        </div>
        <Link href="/" className="text-sm text-brand-700 hover:underline">← Back to Store</Link>
      </header>

      <div className="p-6 max-w-7xl mx-auto space-y-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Link href="/admin" className="hover:text-gray-800">Dashboard</Link>
          <span>/</span>
          <span className="text-gray-800 font-medium">Orders</span>
        </div>

        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
        </div>

        {/* Stats bar */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white rounded-xl border border-gray-100 p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
              <ShoppingBag className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Today's Orders</p>
              <p className="text-xl font-bold text-gray-900">{stats?.todayOrders ?? '—'}</p>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-yellow-50 flex items-center justify-center">
              <Clock className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Pending</p>
              <p className="text-xl font-bold text-gray-900">{stats?.pendingOrders ?? '—'}</p>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Today's Revenue</p>
              <p className="text-xl font-bold text-gray-900">
                {stats?.todayRevenue != null ? formatPrice(stats.todayRevenue) : '—'}
              </p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl border border-gray-100 p-4 space-y-3">
          <div className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
            <Filter className="w-4 h-4" />
            Filters
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Search */}
            <form onSubmit={handleSearch} className="flex gap-2 sm:col-span-2 lg:col-span-1">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Order # or phone…"
                  className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
              <button
                type="submit"
                className="px-3 py-2 bg-brand-700 text-white rounded-lg text-sm hover:bg-brand-800 transition-colors"
              >
                Go
              </button>
            </form>

            {/* Status */}
            <select
              value={status}
              onChange={(e) => { setStatus(e.target.value); handleFilterChange(); }}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              {ORDER_STATUSES.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>

            {/* Payment method */}
            <select
              value={paymentMethod}
              onChange={(e) => { setPaymentMethod(e.target.value); handleFilterChange(); }}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              {PAYMENT_METHODS.map((m) => (
                <option key={m.value} value={m.value}>{m.label}</option>
              ))}
            </select>

            {/* Date range */}
            <div className="flex gap-2 items-center">
              <input
                type="date"
                value={from}
                onChange={(e) => { setFrom(e.target.value); handleFilterChange(); }}
                className="flex-1 border border-gray-200 rounded-lg px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
              <span className="text-gray-400 text-xs">to</span>
              <input
                type="date"
                value={to}
                onChange={(e) => { setTo(e.target.value); handleFilterChange(); }}
                className="flex-1 border border-gray-200 rounded-lg px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>

          {/* Active filters chips */}
          {(search || status || paymentMethod || from || to) && (
            <div className="flex flex-wrap gap-2 pt-1">
              {search && (
                <Chip label={`Search: ${search}`} onRemove={() => { setSearch(''); setSearchInput(''); setPage(1); }} />
              )}
              {status && (
                <Chip label={`Status: ${status}`} onRemove={() => { setStatus(''); setPage(1); }} />
              )}
              {paymentMethod && (
                <Chip label={`Method: ${paymentMethod}`} onRemove={() => { setPaymentMethod(''); setPage(1); }} />
              )}
              {(from || to) && (
                <Chip
                  label={`Date: ${from || '…'} → ${to || '…'}`}
                  onRemove={() => { setFrom(''); setTo(''); setPage(1); }}
                />
              )}
            </div>
          )}
        </div>

        {/* Table */}
        <OrdersTable orders={data?.data ?? []} isLoading={isLoading} />

        {/* Pagination */}
        {data && data.totalPages > 1 && (
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">
              {(page - 1) * 25 + 1}–{Math.min(page * 25, data.total)} of {data.total} orders
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="flex items-center px-3 text-sm text-gray-700">
                Page {page} of {data.totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(data.totalPages, p + 1))}
                disabled={page === data.totalPages}
                className="p-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronRightIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Chip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="inline-flex items-center gap-1 bg-brand-50 text-brand-700 text-xs px-2 py-1 rounded-full font-medium">
      {label}
      <button onClick={onRemove} className="hover:text-brand-900">×</button>
    </span>
  );
}
