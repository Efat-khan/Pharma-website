'use client';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { ArrowRight, Zap, Shield, Clock, Truck } from 'lucide-react';
import api from '@/lib/axios';
import ProductCard from '@/components/product/ProductCard';
import CategoryStrip from '@/components/product/CategoryStrip';
import HeroBanner from '@/components/product/HeroBanner';

export default function HomePage() {
  const { data: featured } = useQuery({
    queryKey: ['products', 'featured'],
    queryFn: () => api.get('/products/featured?limit=10').then(r => r.data),
  });

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: () => api.get('/categories').then(r => r.data),
    staleTime: 5 * 60 * 1000,
  });

  const { data: banners } = useQuery({
    queryKey: ['banners'],
    queryFn: () => api.get('/admin/banners').then(r => r.data).catch(() => []),
  });

  return (
    <div className="space-y-8 pb-12">
      {/* Hero */}
      <HeroBanner banners={banners || []} />

      {/* Trust badges */}
      <div className="container-custom">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { icon: <Shield className="w-5 h-5" />, title: '100% Authentic', desc: 'Sourced from authorized distributors' },
            { icon: <Truck className="w-5 h-5" />, title: 'Fast Delivery', desc: 'Same-day delivery in Dhaka' },
            { icon: <Clock className="w-5 h-5" />, title: '24/7 Support', desc: 'Talk to our pharmacists anytime' },
            { icon: <Zap className="w-5 h-5" />, title: 'Best Prices', desc: 'Lowest prices guaranteed' },
          ].map((item) => (
            <div key={item.title} className="bg-white rounded-xl p-4 flex items-center gap-3 border border-gray-100 shadow-sm">
              <div className="w-10 h-10 bg-brand-50 rounded-lg flex items-center justify-center text-brand-600 flex-shrink-0">
                {item.icon}
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-800">{item.title}</p>
                <p className="text-xs text-gray-500">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Categories */}
      {categories?.length > 0 && (
        <div className="container-custom">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Shop by Category</h2>
            <Link href="/products" className="text-sm text-brand-700 hover:text-brand-800 flex items-center gap-1">
              View all <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <CategoryStrip categories={categories} />
        </div>
      )}

      {/* Featured Products */}
      {featured?.length > 0 && (
        <div className="container-custom">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Featured Products</h2>
            <Link href="/products?isFeatured=true" className="text-sm text-brand-700 hover:text-brand-800 flex items-center gap-1">
              See all <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {featured.map((product: any) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      )}

      {/* Flash sale placeholder */}
      <div className="container-custom">
        <div className="bg-gradient-to-r from-red-500 to-orange-500 rounded-2xl p-6 text-white text-center">
          <p className="text-lg font-bold">⚡ Flash Sale Coming Soon</p>
          <p className="text-sm opacity-80 mt-1">Add products and configure flash sale from Admin panel</p>
        </div>
      </div>
    </div>
  );
}
