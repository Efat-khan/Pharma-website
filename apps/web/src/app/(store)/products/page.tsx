'use client';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import api from '@/lib/axios';
import ProductCard from '@/components/product/ProductCard';
import { cn } from '@/lib/utils';

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [page, setPage] = useState(1);

  const categoryId = searchParams.get('categoryId') || undefined;
  const brandId = searchParams.get('brandId') || undefined;
  const isFeatured = searchParams.get('isFeatured') || undefined;

  const { data, isLoading } = useQuery({
    queryKey: ['products', { search, categoryId, brandId, isFeatured, page }],
    queryFn: () =>
      api.get('/products', {
        params: { search: search || undefined, categoryId, brandId, isFeatured, page, limit: 20 },
      }).then(r => r.data),
    keepPreviousData: true,
  } as any);

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: () => api.get('/categories').then(r => r.data),
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    setPage(1);
  }, [search, categoryId]);

  return (
    <div className="container-custom py-6">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar */}
        <aside className="w-full md:w-56 flex-shrink-0">
          <div className="bg-white rounded-xl border border-gray-100 p-4 sticky top-20">
            <h3 className="font-semibold text-gray-800 mb-3">Categories</h3>
            <ul className="space-y-1">
              <li>
                <button
                  onClick={() => router.push('/products')}
                  className={cn(
                    'w-full text-left px-3 py-2 rounded-lg text-sm transition-colors',
                    !categoryId ? 'bg-brand-50 text-brand-700 font-medium' : 'text-gray-600 hover:bg-gray-50',
                  )}
                >
                  All Products
                </button>
              </li>
              {categories?.map((cat: any) => (
                <li key={cat.id}>
                  <button
                    onClick={() => router.push(`/products?categoryId=${cat.id}`)}
                    className={cn(
                      'w-full text-left px-3 py-2 rounded-lg text-sm transition-colors',
                      categoryId === cat.id ? 'bg-brand-50 text-brand-700 font-medium' : 'text-gray-600 hover:bg-gray-50',
                    )}
                  >
                    {cat.name}
                    {cat._count?.products > 0 && (
                      <span className="ml-1 text-xs text-gray-400">({cat._count.products})</span>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* Main */}
        <div className="flex-1">
          {/* Search bar */}
          <div className="flex gap-3 mb-5">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                type="search"
                placeholder="Search products..."
                className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-50"
              />
              {search && (
                <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Results */}
          {isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="bg-white rounded-xl border border-gray-100 overflow-hidden animate-pulse">
                  <div className="aspect-square bg-gray-100" />
                  <div className="p-3 space-y-2">
                    <div className="h-4 bg-gray-100 rounded" />
                    <div className="h-3 bg-gray-100 rounded w-2/3" />
                    <div className="h-8 bg-gray-100 rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : data?.data?.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-4xl mb-3">🔍</p>
              <p className="text-gray-500">No products found. Try a different search.</p>
            </div>
          ) : (
            <>
              <p className="text-sm text-gray-500 mb-4">
                {data?.meta?.total || 0} products found
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {data?.data?.map((product: any) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {/* Pagination */}
              {data?.meta?.totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-8">
                  {Array.from({ length: data.meta.totalPages }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={cn(
                        'w-9 h-9 rounded-lg text-sm font-medium transition-colors',
                        p === page ? 'bg-brand-700 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-brand-300',
                      )}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
