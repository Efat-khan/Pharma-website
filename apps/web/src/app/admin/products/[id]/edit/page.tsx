'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { useAuthStore } from '@/store/auth.store';
import { useAdminProduct, useUpdateProduct } from '@/lib/api/products';
import ProductForm from '@/components/admin/ProductForm';

interface UploadedImage {
  url: string;
  publicId?: string;
  isPrimary: boolean;
  sortOrder: number;
}

export default function EditProductPage() {
  const user = useAuthStore((s) => s.user);
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const { data: product, isLoading } = useAdminProduct(id);
  const updateProduct = useUpdateProduct(id);

  const [images, setImages] = useState<UploadedImage[]>([]);

  useEffect(() => {
    if (user && user.role !== 'ADMIN') router.push('/admin');
  }, [user, router]);

  useEffect(() => {
    if (product?.images) {
      setImages(
        product.images.map((img) => ({
          url: img.url,
          publicId: (img as any).publicId,
          isPrimary: img.isPrimary,
          sortOrder: img.sortOrder,
        })),
      );
    }
  }, [product]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-brand-500 animate-spin" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-4">Product not found</p>
          <Link href="/admin/products" className="text-brand-600 hover:underline text-sm">
            ← Back to Products
          </Link>
        </div>
      </div>
    );
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
          <Link href="/admin/products" className="text-gray-500 text-sm hover:text-gray-700">Products</Link>
          <span className="text-gray-300">/</span>
          <span className="text-gray-600 text-sm truncate max-w-[200px]">{product.name}</span>
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
            <h1 className="text-2xl font-bold text-gray-900">Edit Product</h1>
            <p className="text-sm text-gray-400 truncate">{product.name}</p>
          </div>
        </div>

        <ProductForm
          product={product}
          images={images}
          onImagesChange={setImages}
          onSubmit={(data) => updateProduct.mutate(data)}
          isSubmitting={updateProduct.isPending}
          onCancel={() => router.push('/admin/products')}
        />
      </div>
    </div>
  );
}
