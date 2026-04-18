'use client';
import { useQuery } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { useState } from 'react';
import { ShoppingCart, Plus, Minus, Shield, Truck, RotateCcw, FileText, Star } from 'lucide-react';
import api from '@/lib/axios';
import { useAuthStore } from '@/store/auth.store';
import { useAddToCart } from '@/hooks/useCart';
import { formatPrice, formatDiscount } from '@/lib/utils';
import { cn } from '@/lib/utils';

export default function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const router = useRouter();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const addToCart = useAddToCart();
  const [qty, setQty] = useState(1);
  const [activeImage, setActiveImage] = useState(0);

  const { data: product, isLoading } = useQuery({
    queryKey: ['product', slug],
    queryFn: () => api.get(`/products/${slug}`).then(r => r.data),
  });

  if (isLoading) return (
    <div className="container-custom py-8">
      <div className="grid md:grid-cols-2 gap-8 animate-pulse">
        <div className="aspect-square bg-gray-100 rounded-2xl" />
        <div className="space-y-4">
          <div className="h-8 bg-gray-100 rounded w-3/4" />
          <div className="h-4 bg-gray-100 rounded w-1/2" />
          <div className="h-12 bg-gray-100 rounded w-1/3" />
          <div className="h-12 bg-gray-100 rounded" />
        </div>
      </div>
    </div>
  );

  if (!product) return <div className="container-custom py-20 text-center text-gray-500">Product not found</div>;

  const primaryImage = product.images?.find((i: any) => i.isPrimary)?.url || product.images?.[activeImage]?.url;
  const discount = formatDiscount(Number(product.mrp), Number(product.sellingPrice));

  const handleAddToCart = () => {
    if (!isAuthenticated) { router.push('/login'); return; }
    addToCart.mutate({ productId: product.id, quantity: qty });
  };

  return (
    <div className="container-custom py-6">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 mb-6 flex items-center gap-2">
        <span className="hover:text-brand-700 cursor-pointer" onClick={() => router.push('/')}>Home</span>
        <span>/</span>
        <span className="hover:text-brand-700 cursor-pointer" onClick={() => router.push('/products')}>Products</span>
        <span>/</span>
        <span className="text-gray-800 font-medium line-clamp-1">{product.name}</span>
      </nav>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Images */}
        <div>
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden aspect-square mb-3 relative">
            {primaryImage ? (
              <Image src={primaryImage} alt={product.name} fill className="object-contain p-4" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-6xl bg-brand-50">💊</div>
            )}
            {discount && (
              <span className="absolute top-3 left-3 badge-discount text-sm px-2 py-1">{discount}% OFF</span>
            )}
          </div>
          {product.images?.length > 1 && (
            <div className="flex gap-2">
              {product.images.map((img: any, i: number) => (
                <button
                  key={img.id}
                  onClick={() => setActiveImage(i)}
                  className={cn(
                    'w-16 h-16 rounded-xl border-2 overflow-hidden bg-white',
                    i === activeImage ? 'border-brand-500' : 'border-gray-100',
                  )}
                >
                  <Image src={img.url} alt="" width={64} height={64} className="object-contain p-1" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div>
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            {product.brand && (
              <p className="text-xs font-semibold text-brand-600 uppercase tracking-wide mb-2">{product.brand.name}</p>
            )}
            <h1 className="text-2xl font-bold text-gray-900 mb-1 leading-tight">{product.name}</h1>
            {product.genericName && (
              <p className="text-gray-500 text-sm mb-4">{product.genericName}</p>
            )}

            {product.requiresPrescription && (
              <div className="flex items-center gap-2 bg-blue-50 text-blue-700 text-sm px-3 py-2 rounded-lg mb-4">
                <FileText className="w-4 h-4 flex-shrink-0" />
                <span>Prescription required for this medicine</span>
              </div>
            )}

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-1">
              <span className="text-3xl font-bold text-brand-700">{formatPrice(product.sellingPrice)}</span>
              {discount && (
                <span className="text-lg text-gray-400 line-through">{formatPrice(product.mrp)}</span>
              )}
              {discount && (
                <span className="bg-green-50 text-green-700 text-sm font-semibold px-2 py-0.5 rounded-lg">
                  Save {formatPrice(Number(product.mrp) - Number(product.sellingPrice))}
                </span>
              )}
            </div>
            <p className="text-xs text-gray-400 mb-5">MRP: {formatPrice(product.mrp)} (inclusive of all taxes)</p>

            {/* Stock */}
            <div className="flex items-center gap-2 mb-5">
              <span className={cn(
                'w-2 h-2 rounded-full',
                product.stock > 10 ? 'bg-green-500' : product.stock > 0 ? 'bg-yellow-500' : 'bg-red-500',
              )} />
              <span className={cn(
                'text-sm font-medium',
                product.stock > 10 ? 'text-green-600' : product.stock > 0 ? 'text-yellow-600' : 'text-red-600',
              )}>
                {product.stock > 10 ? 'In Stock' : product.stock > 0 ? `Only ${product.stock} left` : 'Out of Stock'}
              </span>
            </div>

            {/* Qty + Add */}
            {product.stock > 0 && (
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setQty(Math.max(1, qty - 1))}
                    className="w-10 h-10 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-10 text-center font-semibold text-gray-800">{qty}</span>
                  <button
                    onClick={() => setQty(Math.min(product.stock, qty + 1))}
                    className="w-10 h-10 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <button
                  onClick={handleAddToCart}
                  disabled={addToCart.isPending}
                  className="flex-1 bg-brand-700 hover:bg-brand-800 text-white font-semibold py-2.5 px-6 rounded-xl flex items-center justify-center gap-2 transition-colors disabled:opacity-60"
                >
                  {addToCart.isPending ? (
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <><ShoppingCart className="w-4 h-4" /> Add to Cart</>
                  )}
                </button>
              </div>
            )}

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-2 pt-4 border-t border-gray-50">
              {[
                { icon: <Shield className="w-4 h-4" />, text: '100% Authentic' },
                { icon: <Truck className="w-4 h-4" />, text: 'Fast Delivery' },
                { icon: <RotateCcw className="w-4 h-4" />, text: 'Easy Returns' },
              ].map((b) => (
                <div key={b.text} className="flex flex-col items-center gap-1 text-center">
                  <div className="text-brand-600">{b.icon}</div>
                  <span className="text-xs text-gray-500">{b.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Description */}
          {product.description && (
            <div className="bg-white rounded-2xl border border-gray-100 p-6 mt-4">
              <h2 className="text-base font-bold text-gray-900 mb-3">Product Description</h2>
              <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">{product.description}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
