'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, ShoppingCart, User, MapPin, ChevronDown, Menu, X, Heart } from 'lucide-react';
import { useState, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/store/auth.store';
import { useCartStore } from '@/store/cart.store';
import { useLogout } from '@/hooks/useAuth';
import api from '@/lib/axios';
import { cn } from '@/lib/utils';

export default function Navbar() {
  const [search, setSearch] = useState('');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const itemCount = useCartStore((s) => s.itemCount);
  const logout = useLogout();

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: () => api.get('/categories').then(r => r.data),
    staleTime: 5 * 60 * 1000,
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) router.push(`/products?search=${encodeURIComponent(search.trim())}`);
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      {/* Top bar */}
      <div className="bg-brand-700 text-white text-xs py-1.5">
        <div className="container-custom flex items-center justify-between">
          <span>🚀 Free delivery on orders above ৳500</span>
          <div className="flex items-center gap-4">
            <Link href="/track-order" className="hover:underline">Track Order</Link>
            <Link href="/become-seller" className="hover:underline">Become a Seller</Link>
          </div>
        </div>
      </div>

      {/* Main navbar */}
      <div className="container-custom py-3">
        <div className="flex items-center gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="w-9 h-9 bg-brand-700 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-base">A</span>
            </div>
            <span className="text-xl font-bold text-brand-800 hidden sm:block">pharmaci</span>
          </Link>

          {/* Delivery location */}
          <button className="hidden md:flex items-center gap-1.5 text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors flex-shrink-0">
            <MapPin className="w-4 h-4 text-brand-600" />
            <span className="max-w-24 truncate">Delivery To Bangladesh</span>
            <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
          </button>

          {/* Search */}
          <form onSubmit={handleSearch} className="flex-1 max-w-2xl">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                type="search"
                placeholder="Search medicines, health products..."
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-50 transition-colors bg-gray-50 focus:bg-white"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-brand-700 text-white px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-brand-800 transition-colors"
              >
                Search
              </button>
            </div>
          </form>

          {/* Actions */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Cart */}
            <Link
              href="/cart"
              className="relative flex items-center gap-1.5 px-3 py-2 bg-brand-50 hover:bg-brand-100 rounded-xl transition-colors"
            >
              <ShoppingCart className="w-5 h-5 text-brand-700" />
              <span className="hidden sm:block text-sm font-medium text-brand-700">Cart</span>
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {itemCount > 9 ? '9+' : itemCount}
                </span>
              )}
            </Link>

            {/* User */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  <div className="w-8 h-8 bg-brand-100 rounded-full flex items-center justify-center">
                    <span className="text-brand-700 font-semibold text-sm">
                      {user?.name?.[0]?.toUpperCase() || user?.phone?.[9]}
                    </span>
                  </div>
                  <div className="hidden md:block text-left">
                    <p className="text-xs text-gray-500">Hello,</p>
                    <p className="text-sm font-semibold text-gray-800 leading-tight">
                      {user?.name || 'Account'}
                    </p>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-gray-400 hidden md:block" />
                </button>

                {userMenuOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setUserMenuOpen(false)} />
                    <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-20 animate-fade-in">
                      <div className="px-4 py-3 border-b border-gray-50">
                        <p className="text-sm font-semibold text-gray-800">{user?.name || 'User'}</p>
                        <p className="text-xs text-gray-500">{user?.phone}</p>
                      </div>
                      {[
                        { href: '/account', label: 'My Account' },
                        { href: '/orders', label: 'My Orders' },
                        { href: '/account/addresses', label: 'Addresses' },
                        { href: '/prescriptions', label: 'Prescriptions' },
                      ].map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setUserMenuOpen(false)}
                          className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          {item.label}
                        </Link>
                      ))}
                      {user?.role === 'ADMIN' && (
                        <Link
                          href="/admin"
                          onClick={() => setUserMenuOpen(false)}
                          className="block px-4 py-2.5 text-sm text-brand-700 font-medium hover:bg-brand-50 transition-colors"
                        >
                          Admin Panel
                        </Link>
                      )}
                      <button
                        onClick={() => { setUserMenuOpen(false); logout(); }}
                        className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors border-t border-gray-50 mt-1"
                      >
                        Sign Out
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                className="flex items-center gap-2 px-4 py-2 bg-brand-700 hover:bg-brand-800 text-white text-sm font-medium rounded-xl transition-colors"
              >
                <User className="w-4 h-4" />
                <span>Login</span>
              </Link>
            )}

            {/* Mobile menu */}
            <button
              className="md:hidden p-2 rounded-lg hover:bg-gray-50"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Category nav */}
      <div className="hidden md:block border-t border-gray-100 bg-white">
        <div className="container-custom">
          <nav className="flex items-center gap-1 overflow-x-auto py-1.5 scrollbar-hide">
            {categories?.slice(0, 10).map((cat: any) => (
              <Link
                key={cat.id}
                href={`/products/category/${cat.slug}`}
                className="flex-shrink-0 px-3 py-1.5 text-sm text-gray-600 hover:text-brand-700 hover:bg-brand-50 rounded-lg transition-colors whitespace-nowrap"
              >
                {cat.name}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {mobileOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white py-4">
          <div className="container-custom space-y-2">
            {categories?.slice(0, 8).map((cat: any) => (
              <Link
                key={cat.id}
                href={`/products/category/${cat.slug}`}
                onClick={() => setMobileOpen(false)}
                className="block py-2 text-sm text-gray-700 hover:text-brand-700"
              >
                {cat.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
