'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Pencil, Trash2, Package } from 'lucide-react';
import { cn, formatPrice } from '@/lib/utils';
import { Product } from '@/types';
import { useToggleProductActive, useDeleteProduct } from '@/lib/api/products';

interface ProductsTableProps {
  products: Product[];
  isLoading: boolean;
}

export default function ProductsTable({ products, isLoading }: ProductsTableProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const toggleActive = useToggleProductActive();
  const deleteProduct = useDeleteProduct();

  function handleDelete(id: string) {
    setDeletingId(id);
  }

  function confirmDelete() {
    if (!deletingId) return;
    deleteProduct.mutate(deletingId, {
      onSettled: () => setDeletingId(null),
    });
  }

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="px-4 py-3 border-b border-gray-50 animate-pulse flex gap-4">
            <div className="w-12 h-12 bg-gray-100 rounded-lg flex-shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-100 rounded w-1/3" />
              <div className="h-3 bg-gray-100 rounded w-1/4" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-100 p-16 text-center">
        <Package className="w-12 h-12 text-gray-200 mx-auto mb-3" />
        <p className="text-gray-400 font-medium">No products found</p>
        <p className="text-sm text-gray-300 mt-1">Try adjusting your filters or add a new product</p>
      </div>
    );
  }

  return (
    <>
      {/* Desktop table */}
      <div className="hidden md:block bg-white rounded-xl border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-50 bg-gray-50/50">
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Product</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Category</th>
              <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Price / MRP</th>
              <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Stock</th>
              <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Rx</th>
              <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Active</th>
              <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {products.map((product) => {
              const primaryImage = product.images?.find((img) => img.isPrimary) ?? product.images?.[0];
              return (
                <tr key={product.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg border border-gray-100 overflow-hidden bg-gray-50 flex-shrink-0">
                        {primaryImage ? (
                          <img src={primaryImage.url} alt={product.name} className="w-full h-full object-cover" />
                        ) : (
                          <Package className="w-5 h-5 text-gray-300 m-3.5" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-gray-800 line-clamp-1">{product.name}</p>
                        {product.genericName && (
                          <p className="text-xs text-gray-400">{product.genericName}</p>
                        )}
                        <p className="text-[11px] text-gray-300 font-mono">{product.sku}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                      {product.category?.name ?? '—'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <p className="font-semibold text-gray-800">{formatPrice(product.sellingPrice)}</p>
                    {Number(product.mrp) > Number(product.sellingPrice) && (
                      <p className="text-xs text-gray-400 line-through">{formatPrice(product.mrp)}</p>
                    )}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span
                      className={cn(
                        'text-xs font-semibold px-2 py-1 rounded-full',
                        product.stock < 10
                          ? 'bg-red-50 text-red-600'
                          : 'bg-green-50 text-green-700',
                      )}
                    >
                      {product.stock}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    {product.requiresPrescription && (
                      <span className="text-xs bg-orange-50 text-orange-600 px-2 py-1 rounded-full font-medium">Rx</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      type="button"
                      disabled={toggleActive.isPending}
                      onClick={() =>
                        toggleActive.mutate({ id: product.id, isActive: !product.isActive })
                      }
                      className={cn(
                        'relative w-9 h-5 rounded-full transition-colors',
                        product.isActive ? 'bg-brand-500' : 'bg-gray-200',
                      )}
                    >
                      <span
                        className={cn(
                          'absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform',
                          product.isActive ? 'translate-x-4' : 'translate-x-0.5',
                        )}
                      />
                    </button>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Link
                        href={`/admin/products/${product.id}/edit`}
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:bg-brand-50 hover:text-brand-600 transition-colors"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleDelete(product.id)}
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden space-y-3">
        {products.map((product) => {
          const primaryImage = product.images?.find((img) => img.isPrimary) ?? product.images?.[0];
          return (
            <div key={product.id} className="bg-white rounded-xl border border-gray-100 p-4">
              <div className="flex items-start gap-3">
                <div className="w-14 h-14 rounded-lg border border-gray-100 overflow-hidden bg-gray-50 flex-shrink-0">
                  {primaryImage ? (
                    <img src={primaryImage.url} alt={product.name} className="w-full h-full object-cover" />
                  ) : (
                    <Package className="w-6 h-6 text-gray-300 m-4" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-800 truncate">{product.name}</p>
                  {product.genericName && <p className="text-xs text-gray-400">{product.genericName}</p>}
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-sm font-semibold text-gray-800">{formatPrice(product.sellingPrice)}</span>
                    <span className={cn('text-xs font-medium px-1.5 py-0.5 rounded-full', product.stock < 10 ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-700')}>
                      Stock: {product.stock}
                    </span>
                    {product.requiresPrescription && (
                      <span className="text-xs bg-orange-50 text-orange-600 px-1.5 py-0.5 rounded-full">Rx</span>
                    )}
                  </div>
                </div>
                <div className="flex gap-1">
                  <Link href={`/admin/products/${product.id}/edit`} className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:bg-brand-50 hover:text-brand-600 transition-colors">
                    <Pencil className="w-3.5 h-3.5" />
                  </Link>
                  <button type="button" onClick={() => handleDelete(product.id)} className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Delete confirmation dialog */}
      {deletingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm mx-4">
            <h3 className="font-bold text-gray-900 text-lg mb-2">Delete Product?</h3>
            <p className="text-sm text-gray-500 mb-6">
              This will mark the product as inactive. It won&apos;t be visible in the store.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                type="button"
                onClick={() => setDeletingId(null)}
                className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                disabled={deleteProduct.isPending}
                className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-600 disabled:opacity-60 transition-colors"
              >
                {deleteProduct.isPending ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
