'use client';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCart, Plus, FileText } from 'lucide-react';
import { useAuthStore } from '@/store/auth.store';
import { useAddToCart } from '@/hooks/useCart';
import { formatPrice, formatDiscount } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import type { Product } from '@/types';

interface Props {
  product: Product & { images?: { url: string; isPrimary: boolean }[] };
}

export default function ProductCard({ product }: Props) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const addToCart = useAddToCart();
  const router = useRouter();

  const image = product.images?.find((i) => i.isPrimary)?.url || product.images?.[0]?.url;
  const discount = formatDiscount(Number(product.mrp), Number(product.sellingPrice));

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isAuthenticated) { router.push('/login'); return; }
    addToCart.mutate({ productId: product.id, quantity: 1 });
  };

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-md hover:border-brand-100 transition-all duration-200 flex flex-col"
    >
      {/* Image */}
      <div className="relative aspect-square bg-gray-50 overflow-hidden">
        {image ? (
          <Image
            src={image}
            alt={product.name}
            fill
            className="object-contain p-2 group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl bg-brand-50">
            💊
          </div>
        )}
        {discount && (
          <span className="absolute top-2 left-2 badge-discount">{discount}% OFF</span>
        )}
        {product.requiresPrescription && (
          <span className="absolute top-2 right-2 bg-blue-100 text-blue-700 text-xs px-1.5 py-0.5 rounded flex items-center gap-0.5">
            <FileText className="w-3 h-3" />Rx
          </span>
        )}
      </div>

      {/* Info */}
      <div className="p-3 flex flex-col flex-1">
        <h3 className="text-sm font-medium text-gray-800 line-clamp-2 leading-snug mb-1 group-hover:text-brand-700 transition-colors">
          {product.name}
        </h3>
        {product.genericName && (
          <p className="text-xs text-gray-400 line-clamp-1 mb-2">{product.genericName}</p>
        )}

        <div className="mt-auto">
          <div className="flex items-baseline gap-1.5 mb-2">
            <span className="text-base font-bold text-brand-700">
              {formatPrice(product.sellingPrice)}
            </span>
            {discount && (
              <span className="text-xs text-gray-400 line-through">{formatPrice(product.mrp)}</span>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            disabled={addToCart.isPending || product.stock === 0}
            className="w-full btn-add-to-cart flex items-center justify-center gap-1.5 disabled:opacity-50"
          >
            {product.stock === 0 ? (
              'Out of Stock'
            ) : addToCart.isPending ? (
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <Plus className="w-3.5 h-3.5" />
                Add
              </>
            )}
          </button>
        </div>
      </div>
    </Link>
  );
}
