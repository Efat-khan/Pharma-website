'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

const DEFAULT_BANNERS = [
  {
    id: '1',
    title: 'Your Health, Our Priority',
    imageUrl: null,
    linkUrl: '/products',
    gradient: 'from-brand-700 to-brand-500',
    subtitle: 'Authentic medicines delivered to your door',
    cta: 'Shop Now',
  },
  {
    id: '2',
    title: 'Baby & Mom Care',
    imageUrl: null,
    linkUrl: '/products/category/baby-mom-care',
    gradient: 'from-pink-600 to-rose-400',
    subtitle: 'Everything your family needs in one place',
    cta: 'Explore',
  },
];

export default function HeroBanner({ banners }: { banners: any[] }) {
  const items = banners.length > 0 ? banners : DEFAULT_BANNERS;
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setCurrent((c) => (c + 1) % items.length), 4000);
    return () => clearInterval(t);
  }, [items.length]);

  return (
    <div className="relative overflow-hidden rounded-none md:rounded-2xl md:mx-6 mt-4 h-48 sm:h-56 md:h-72 lg:h-80">
      {items.map((banner, i) => (
        <div
          key={banner.id}
          className={cn(
            'absolute inset-0 transition-opacity duration-700',
            i === current ? 'opacity-100' : 'opacity-0',
          )}
        >
          {banner.imageUrl ? (
            <Image src={banner.imageUrl} alt={banner.title} fill className="object-cover" priority={i === 0} />
          ) : (
            <div className={cn('w-full h-full bg-gradient-to-r', (banner as any).gradient || 'from-brand-700 to-brand-500', 'flex items-center px-10 md:px-16')}>
              <div className="text-white">
                <p className="text-xs font-medium uppercase tracking-widest opacity-80 mb-2">Online Pharmacy</p>
                <h2 className="text-2xl md:text-4xl font-bold leading-tight mb-3">{banner.title}</h2>
                {(banner as any).subtitle && (
                  <p className="text-sm md:text-base opacity-80 mb-5">{(banner as any).subtitle}</p>
                )}
                <Link
                  href={banner.linkUrl || '/products'}
                  className="inline-block bg-white text-brand-700 font-semibold px-5 py-2.5 rounded-xl text-sm hover:bg-gray-50 transition-colors"
                >
                  {(banner as any).cta || 'Shop Now'} →
                </Link>
              </div>
            </div>
          )}
        </div>
      ))}

      {/* Controls */}
      {items.length > 1 && (
        <>
          <button
            onClick={() => setCurrent((c) => (c - 1 + items.length) % items.length)}
            className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/20 hover:bg-white/40 text-white rounded-full flex items-center justify-center transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => setCurrent((c) => (c + 1) % items.length)}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/20 hover:bg-white/40 text-white rounded-full flex items-center justify-center transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
            {items.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={cn('w-2 h-2 rounded-full transition-all', i === current ? 'bg-white w-5' : 'bg-white/50')}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
