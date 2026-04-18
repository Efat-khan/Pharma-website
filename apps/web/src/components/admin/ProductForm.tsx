'use client';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import CloudinaryUpload from './CloudinaryUpload';
import { useAdminCategories, useAdminBrands, ProductFormData } from '@/lib/api/products';
import { Product } from '@/types';

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  slug: z.string().min(2, 'Slug is required').regex(/^[a-z0-9-]+$/, 'Slug: lowercase letters, numbers and hyphens only'),
  genericName: z.string().optional(),
  description: z.string().optional(),
  shortDescription: z.string().optional(),
  sku: z.string().min(1, 'SKU is required'),
  mrp: z.coerce.number().positive('MRP must be positive'),
  sellingPrice: z.coerce.number().positive('Price must be positive'),
  stock: z.coerce.number().int().min(0, 'Stock cannot be negative'),
  unit: z.string().optional(),
  packSize: z.string().optional(),
  requiresPrescription: z.boolean(),
  isActive: z.boolean(),
  isFeatured: z.boolean(),
  categoryId: z.string().min(1, 'Category is required'),
  brandId: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

interface ProductFormProps {
  product?: Product;
  images: { url: string; publicId?: string; isPrimary: boolean; sortOrder: number }[];
  onImagesChange: (imgs: { url: string; publicId?: string; isPrimary: boolean; sortOrder: number }[]) => void;
  onSubmit: (data: ProductFormData) => void;
  isSubmitting: boolean;
  onCancel: () => void;
}

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

export default function ProductForm({
  product,
  images,
  onImagesChange,
  onSubmit,
  isSubmitting,
  onCancel,
}: ProductFormProps) {
  const { data: categories = [] } = useAdminCategories();
  const { data: brands = [] } = useAdminBrands();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: product?.name ?? '',
      slug: product?.slug ?? '',
      genericName: product?.genericName ?? '',
      description: product?.description ?? '',
      shortDescription: product?.shortDescription ?? '',
      sku: product?.sku ?? '',
      mrp: product ? Number(product.mrp) : undefined,
      sellingPrice: product ? Number(product.sellingPrice) : undefined,
      stock: product?.stock ?? 0,
      unit: (product as any)?.unit ?? 'pcs',
      packSize: (product as any)?.packSize ?? '',
      requiresPrescription: product?.requiresPrescription ?? false,
      isActive: product?.isActive ?? true,
      isFeatured: product?.isFeatured ?? false,
      categoryId: product?.category?.id ?? '',
      brandId: product?.brand?.id ?? '',
    },
  });

  const nameValue = watch('name');

  useEffect(() => {
    if (!product) {
      setValue('slug', slugify(nameValue || ''));
    }
  }, [nameValue, product, setValue]);

  function handleFormSubmit(values: FormValues) {
    onSubmit({
      ...values,
      brandId: values.brandId || undefined,
      images,
    });
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-8">
      {/* Images */}
      <section className="bg-white rounded-xl border border-gray-100 p-6">
        <h2 className="font-semibold text-gray-800 mb-4">Product Images</h2>
        <CloudinaryUpload images={images} onChange={onImagesChange} />
      </section>

      {/* Basic Info */}
      <section className="bg-white rounded-xl border border-gray-100 p-6 space-y-5">
        <h2 className="font-semibold text-gray-800">Basic Information</h2>

        <div className="grid md:grid-cols-2 gap-5">
          <Field label="Product Name *" error={errors.name?.message}>
            <input {...register('name')} placeholder="e.g. Napa Extra 500mg" className={inputCls(!!errors.name)} />
          </Field>

          <Field label="Generic Name" error={errors.genericName?.message}>
            <input {...register('genericName')} placeholder="e.g. Paracetamol" className={inputCls(false)} />
          </Field>
        </div>

        <div className="grid md:grid-cols-2 gap-5">
          <Field label="Slug *" error={errors.slug?.message}>
            <input {...register('slug')} placeholder="napa-extra-500mg" className={inputCls(!!errors.slug)} />
          </Field>

          <Field label="SKU *" error={errors.sku?.message}>
            <input {...register('sku')} placeholder="e.g. NAPA-EXT-500" className={inputCls(!!errors.sku)} />
          </Field>
        </div>

        <Field label="Short Description" error={errors.shortDescription?.message}>
          <input {...register('shortDescription')} placeholder="Brief summary shown on cards" className={inputCls(false)} />
        </Field>

        <Field label="Description" error={errors.description?.message}>
          <textarea
            {...register('description')}
            rows={4}
            placeholder="Full product description..."
            className={inputCls(false) + ' resize-none'}
          />
        </Field>
      </section>

      {/* Pricing & Stock */}
      <section className="bg-white rounded-xl border border-gray-100 p-6 space-y-5">
        <h2 className="font-semibold text-gray-800">Pricing & Stock</h2>

        <div className="grid md:grid-cols-3 gap-5">
          <Field label="MRP (৳) *" error={errors.mrp?.message}>
            <input type="number" step="0.01" {...register('mrp')} placeholder="0.00" className={inputCls(!!errors.mrp)} />
          </Field>

          <Field label="Selling Price (৳) *" error={errors.sellingPrice?.message}>
            <input type="number" step="0.01" {...register('sellingPrice')} placeholder="0.00" className={inputCls(!!errors.sellingPrice)} />
          </Field>

          <Field label="Stock *" error={errors.stock?.message}>
            <input type="number" {...register('stock')} placeholder="0" className={inputCls(!!errors.stock)} />
          </Field>
        </div>

        <div className="grid md:grid-cols-2 gap-5">
          <Field label="Unit" error={errors.unit?.message}>
            <input {...register('unit')} placeholder="pcs" className={inputCls(false)} />
          </Field>

          <Field label="Pack Size" error={errors.packSize?.message}>
            <input {...register('packSize')} placeholder="e.g. 10×10" className={inputCls(false)} />
          </Field>
        </div>
      </section>

      {/* Category & Brand */}
      <section className="bg-white rounded-xl border border-gray-100 p-6 space-y-5">
        <h2 className="font-semibold text-gray-800">Category & Brand</h2>

        <div className="grid md:grid-cols-2 gap-5">
          <Field label="Category *" error={errors.categoryId?.message}>
            <select {...register('categoryId')} className={inputCls(!!errors.categoryId)}>
              <option value="">Select category...</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </Field>

          <Field label="Brand" error={errors.brandId?.message}>
            <select {...register('brandId')} className={inputCls(false)}>
              <option value="">No brand</option>
              {brands.map((b) => (
                <option key={b.id} value={b.id}>{b.name}</option>
              ))}
            </select>
          </Field>
        </div>
      </section>

      {/* Flags */}
      <section className="bg-white rounded-xl border border-gray-100 p-6">
        <h2 className="font-semibold text-gray-800 mb-4">Settings</h2>

        <div className="flex flex-wrap gap-6">
          <Toggle name="isActive" label="Active" description="Visible in store" register={register} watch={watch} setValue={setValue} />
          <Toggle name="isFeatured" label="Featured" description="Show on homepage" register={register} watch={watch} setValue={setValue} />
          <Toggle name="requiresPrescription" label="Requires Prescription" description="Customer must upload Rx" register={register} watch={watch} setValue={setValue} />
        </div>
      </section>

      {/* Actions */}
      <div className="flex items-center gap-3 justify-end">
        <button
          type="button"
          onClick={onCancel}
          className="px-5 py-2.5 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-2.5 text-sm font-medium text-white bg-brand-600 rounded-lg hover:bg-brand-700 disabled:opacity-60 transition-colors flex items-center gap-2"
        >
          {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
          {product ? 'Save Changes' : 'Create Product'}
        </button>
      </div>
    </form>
  );
}

function inputCls(hasError: boolean) {
  return cn(
    'w-full px-3 py-2 text-sm rounded-lg border bg-white outline-none transition-colors',
    hasError
      ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-100'
      : 'border-gray-200 focus:border-brand-400 focus:ring-2 focus:ring-brand-50',
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-700 mb-1.5">{label}</label>
      {children}
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}

function Toggle({
  name,
  label,
  description,
  register,
  watch,
  setValue,
}: {
  name: 'isActive' | 'isFeatured' | 'requiresPrescription';
  label: string;
  description: string;
  register: any;
  watch: any;
  setValue: any;
}) {
  const value = watch(name);

  return (
    <label className="flex items-center gap-3 cursor-pointer select-none">
      <div
        onClick={() => setValue(name, !value)}
        className={cn(
          'relative w-10 h-6 rounded-full transition-colors',
          value ? 'bg-brand-600' : 'bg-gray-200',
        )}
      >
        <span
          className={cn(
            'absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform',
            value ? 'translate-x-5' : 'translate-x-1',
          )}
        />
      </div>
      <div>
        <p className="text-sm font-medium text-gray-800">{label}</p>
        <p className="text-xs text-gray-400">{description}</p>
      </div>
      <input type="checkbox" {...register(name)} className="hidden" />
    </label>
  );
}
