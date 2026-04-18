'use client';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import api from '@/lib/axios';
import ProductCard from '@/components/product/ProductCard';
import { cn } from '@/lib/utils';

export default function CategoryPage() {
  const { slug } = useParams<{ slug: string }>();
  const [page, setPage] = useState(1);

  const { data: category } = useQuery({
    queryKey: ['category', slug],
    queryFn: () => api.get(`/categories/${slug}`).then(r => r.data),
  });

  const { data, isLoading } = useQuery({
    queryKey: ['products', 'category', slug, page],
    queryFn: () => api.get(`/products/category/${slug}?page=${page}&limit=20`).then(r => r.data),
  });

  return (
    <div className="container-custom py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{category?.name || slug}</h1>
        {data?.meta?.total != null && (
          <p className="text-sm text-gray-500 mt-1">{data.meta.total} products</p>
        )}
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-100 overflow-hidden animate-pulse">
              <div className="aspect-square bg-gray-100" />
              <div className="p-3 space-y-2">
                <div className="h-4 bg-gray-100 rounded" />
                <div className="h-8 bg-gray-100 rounded" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {data?.data?.map((product: any) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          {data?.meta?.totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              {Array.from({ length: data.meta.totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={cn('w-9 h-9 rounded-lg text-sm font-medium transition-colors',
                    p === page ? 'bg-brand-700 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-brand-300')}
                >
                  {p}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
