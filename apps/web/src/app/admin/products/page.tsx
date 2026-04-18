'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Plus, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAuthStore } from '@/store/auth.store';
import { useAdminProducts, useAdminCategories, useAdminBrands } from '@/lib/api/products';
import ProductsTable from '@/components/admin/ProductsTable';

const LIMIT = 20;

export default function AdminProductsPage() {
  const user = useAuthStore((s) => s.user);
  const router = useRouter();

  useEffect(() => {
    if (user && user.role !== 'ADMIN' && user.role !== 'PHARMACIST') router.push('/');
  }, [user, router]);

  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [brandId, setBrandId] = useState('');
  const [isActive, setIsActive] = useState('');
  const [requiresPrescription, setRequiresPrescription] = useState('');
  const [page, setPage] = useState(1);

  // Debounce search input
  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 350);
    return () => clearTimeout(t);
  }, [search]);

  const filters = {
    ...(debouncedSearch && { search: debouncedSearch }),
    ...(categoryId && { categoryId }),
    ...(brandId && { brandId }),
    ...(isActive !== '' && { isActive }),
    ...(requiresPrescription !== '' && { requiresPrescription }),
    page,
    limit: LIMIT,
  };

  const { data, isLoading } = useAdminProducts(filters);
  const { data: categories = [] } = useAdminCategories();
  const { data: brands = [] } = useAdminBrands();

  const products = data?.data ?? [];
  const meta = data?.meta;
  const totalPages = meta?.totalPages ?? 1;

  function resetFilters() {
    setSearch('');
    setDebouncedSearch('');
    setCategoryId('');
    setBrandId('');
    setIsActive('');
    setRequiresPrescription('');
    setPage(1);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Navbar */}
      <header className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/admin" className="flex items-center gap-3">
            <div className="w-8 h-8 bg-brand-700 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">A</span>
            </div>
            <span className="font-bold text-gray-900">Admin Panel</span>
          </Link>
          <span className="text-gray-300">/</span>
          <span className="text-gray-600 text-sm">Products</span>
        </div>
        <Link href="/" className="text-sm text-brand-700 hover:underline">← Back to Store</Link>
      </header>

      <div className="p-6 max-w-7xl mx-auto space-y-5">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Products</h1>
            {meta && (
              <p className="text-sm text-gray-400 mt-0.5">{meta.total} total products</p>
            )}
          </div>
          <Link
            href="/admin/products/new"
            className="flex items-center gap-2 bg-brand-600 text-white text-sm font-medium px-4 py-2.5 rounded-lg hover:bg-brand-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Product
          </Link>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <div className="flex flex-wrap gap-3">
            {/* Search */}
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name, generic name, SKU..."
                className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-50"
              />
            </div>

            <select
              value={categoryId}
              onChange={(e) => { setCategoryId(e.target.value); setPage(1); }}
              className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-brand-400 bg-white"
            >
              <option value="">All Categories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>

            <select
              value={brandId}
              onChange={(e) => { setBrandId(e.target.value); setPage(1); }}
              className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-brand-400 bg-white"
            >
              <option value="">All Brands</option>
              {brands.map((b) => (
                <option key={b.id} value={b.id}>{b.name}</option>
              ))}
            </select>

            <select
              value={isActive}
              onChange={(e) => { setIsActive(e.target.value); setPage(1); }}
              className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-brand-400 bg-white"
            >
              <option value="">All Status</option>
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>

            <select
              value={requiresPrescription}
              onChange={(e) => { setRequiresPrescription(e.target.value); setPage(1); }}
              className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-brand-400 bg-white"
            >
              <option value="">All Products</option>
              <option value="true">Requires Rx</option>
              <option value="false">No Rx Needed</option>
            </select>

            {(search || categoryId || brandId || isActive || requiresPrescription) && (
              <button
                type="button"
                onClick={resetFilters}
                className="px-3 py-2 text-sm text-gray-500 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Table */}
        <ProductsTable products={products} isLoading={isLoading} />

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between pt-2">
            <p className="text-sm text-gray-400">
              Page {page} of {totalPages}
              {meta && ` · ${meta.total} products`}
            </p>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pageNum = Math.max(1, Math.min(totalPages - 4, page - 2)) + i;
                return (
                  <button
                    key={pageNum}
                    type="button"
                    onClick={() => setPage(pageNum)}
                    className={`w-8 h-8 text-sm rounded-lg border transition-colors ${
                      pageNum === page
                        ? 'bg-brand-600 text-white border-brand-600'
                        : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
              <button
                type="button"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
