'use client';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/store/auth.store';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import { ShoppingBag, Users, Package, FileText, TrendingUp, Clock } from 'lucide-react';
import api from '@/lib/axios';
import { formatPrice } from '@/lib/utils';
import { usePendingPrescriptionCount } from '@/lib/api/prescriptions';

export default function AdminDashboard() {
  const user = useAuthStore((s) => s.user);
  const router = useRouter();

  useEffect(() => {
    if (user && user.role !== 'ADMIN' && user.role !== 'PHARMACIST') router.push('/');
  }, [user, router]);

  const { data: stats, isLoading } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: () => api.get('/admin/dashboard').then(r => r.data),
    enabled: user?.role === 'ADMIN',
  });

  const { data: orders } = useQuery({
    queryKey: ['admin-orders'],
    queryFn: () => api.get('/admin/orders?limit=5').then(r => r.data),
  });

  const { data: pendingRxCount } = usePendingPrescriptionCount();

  const statCards = [
    { label: 'Total Orders', value: stats?.totalOrders ?? '—', icon: ShoppingBag, color: 'bg-blue-50 text-blue-600' },
    { label: "Today's Orders", value: stats?.todayOrders ?? '—', icon: TrendingUp, color: 'bg-green-50 text-green-600' },
    { label: 'Pending Orders', value: stats?.pendingOrders ?? '—', icon: Clock, color: 'bg-yellow-50 text-yellow-600' },
    { label: 'Total Revenue', value: stats?.totalRevenue ? formatPrice(stats.totalRevenue) : '—', icon: TrendingUp, color: 'bg-purple-50 text-purple-600' },
    { label: 'Products', value: stats?.totalProducts ?? '—', icon: Package, color: 'bg-indigo-50 text-indigo-600' },
    { label: 'Customers', value: stats?.totalUsers ?? '—', icon: Users, color: 'bg-pink-50 text-pink-600' },
    { label: 'Pending Rx', value: stats?.pendingPrescriptions ?? '—', icon: FileText, color: 'bg-orange-50 text-orange-600' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Navbar */}
      <header className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-brand-700 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">A</span>
          </div>
          <span className="font-bold text-gray-900">Admin Panel</span>
        </div>
        <Link href="/" className="text-sm text-brand-700 hover:underline">← Back to Store</Link>
      </header>

      <div className="p-6 max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>

        {/* Stats */}
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {Array.from({ length: 7 }).map((_, i) => (
              <div key={i} className="bg-white rounded-xl border p-4 animate-pulse h-24" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {statCards.map((card) => {
              const Icon = card.icon;
              return (
                <div key={card.label} className="bg-white rounded-xl border border-gray-100 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-gray-500 font-medium">{card.label}</span>
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${card.color}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{card.value}</p>
                </div>
              );
            })}
          </div>
        )}

        {/* Quick Links */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          {[
            { href: '/admin/orders', label: 'Manage Orders', icon: ShoppingBag, desc: 'View and update order statuses' },
            { href: '/admin/products', label: 'Manage Products', icon: Package, desc: 'Add, edit, delete products' },
            { href: '/admin/prescriptions', label: 'Review Prescriptions', icon: FileText, desc: `${pendingRxCount ?? stats?.pendingPrescriptions ?? 0} pending review`, badge: pendingRxCount },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-md hover:border-brand-100 transition-all flex items-start gap-4"
              >
                <div className="relative w-12 h-12 bg-brand-50 rounded-xl flex items-center justify-center shrink-0">
                  <Icon className="w-6 h-6 text-brand-600" />
                  {'badge' in item && (item.badge ?? 0) > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center leading-none">
                      {(item.badge as number) > 99 ? '99+' : item.badge}
                    </span>
                  )}
                </div>
                <div>
                  <p className="font-semibold text-gray-800">{item.label}</p>
                  <p className="text-sm text-gray-500">{item.desc}</p>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <div className="p-4 border-b border-gray-50 flex items-center justify-between">
            <h2 className="font-bold text-gray-900">Recent Orders</h2>
            <Link href="/admin/orders" className="text-sm text-brand-700 hover:underline">View all</Link>
          </div>
          <div className="divide-y divide-gray-50">
            {orders?.data?.slice(0, 5).map((order: any) => (
              <div key={order.id} className="px-4 py-3 flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-gray-800">{order.orderNumber}</p>
                  <p className="text-xs text-gray-500">{order.user?.name || order.user?.phone}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-700">{formatPrice(order.total)}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
                    order.status === 'DELIVERED' ? 'bg-green-100 text-green-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
            {!orders?.data?.length && (
              <p className="text-sm text-gray-400 text-center py-8">No orders yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
