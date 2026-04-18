'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { useAuthStore } from '@/store/auth.store';
import { useCreateProduct } from '@/lib/api/products';
import ProductForm from '@/components/admin/ProductForm';

interface UploadedImage {
  url: string;
  publicId?: string;
  isPrimary: boolean;
  sortOrder: number;
}

export default function NewProductPage() {
  const user = useAuthStore((s) => s.user);
  const router = useRouter();
  const [images, setImages] = useState<UploadedImage[]>([]);
  const createProduct = useCreateProduct();

  useEffect(() => {
    if (user && user.role !== 'ADMIN') router.push('/admin');
  }, [user, router]);

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
          <Link href="/admin/products" className="text-gray-500 text-sm hover:text-gray-700">Products</Link>
          <span className="text-gray-300">/</span>
          <span className="text-gray-600 text-sm">New Product</span>
        </div>
        <Link href="/" className="text-sm text-brand-700 hover:underline">← Back to Store</Link>
      </header>

      <div className="p-6 max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <Link
            href="/admin/products"
            className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Add New Product</h1>
            <p className="text-sm text-gray-400">Fill in the details below to create a new product</p>
          </div>
        </div>

        <ProductForm
          images={images}
          onImagesChange={setImages}
          onSubmit={(data) => createProduct.mutate(data)}
          isSubmitting={createProduct.isPending}
          onCancel={() => router.push('/admin/products')}
        />
      </div>
    </div>
  );
}
