'use client';
import { useState, useRef } from 'react';
import { Upload, X, Star, StarOff, ImagePlus, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface UploadedImage {
  url: string;
  publicId?: string;
  isPrimary: boolean;
  sortOrder: number;
}

interface CloudinaryUploadProps {
  images: UploadedImage[];
  onChange: (images: UploadedImage[]) => void;
  maxImages?: number;
}

export default function CloudinaryUpload({
  images,
  onChange,
  maxImages = 6,
}: CloudinaryUploadProps) {
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function uploadFile(file: File): Promise<UploadedImage | null> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'pharmaci_products');
    formData.append('folder', 'pharmaci/products');

    try {
      const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        { method: 'POST', body: formData },
      );
      if (!res.ok) throw new Error('Upload failed');
      const data = await res.json();
      return {
        url: data.secure_url,
        publicId: data.public_id,
        isPrimary: images.length === 0,
        sortOrder: images.length,
      };
    } catch {
      return null;
    }
  }

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    const remaining = maxImages - images.length;
    if (remaining <= 0) return;

    setUploading(true);
    const filesToUpload = Array.from(files).slice(0, remaining);
    const results = await Promise.all(filesToUpload.map(uploadFile));
    const uploaded = results.filter(Boolean) as UploadedImage[];

    const updated = [...images, ...uploaded].map((img, idx) => ({
      ...img,
      sortOrder: idx,
      isPrimary: idx === 0 ? (images.length === 0 ? true : img.isPrimary) : img.isPrimary,
    }));

    if (!updated.some((img) => img.isPrimary) && updated.length > 0) {
      updated[0].isPrimary = true;
    }

    onChange(updated);
    setUploading(false);
  }

  function removeImage(index: number) {
    const updated = images
      .filter((_, i) => i !== index)
      .map((img, idx) => ({ ...img, sortOrder: idx }));

    if (updated.length > 0 && !updated.some((img) => img.isPrimary)) {
      updated[0].isPrimary = true;
    }
    onChange(updated);
  }

  function setPrimary(index: number) {
    onChange(images.map((img, i) => ({ ...img, isPrimary: i === index })));
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-3">
        {images.map((img, idx) => (
          <div
            key={img.url}
            className="relative group w-24 h-24 rounded-lg overflow-hidden border-2 border-gray-200"
          >
            <img
              src={img.url}
              alt={`Product image ${idx + 1}`}
              className="w-full h-full object-cover"
            />
            {img.isPrimary && (
              <div className="absolute top-1 left-1 bg-brand-600 text-white text-[10px] px-1.5 py-0.5 rounded font-medium">
                Primary
              </div>
            )}
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5">
              {!img.isPrimary && (
                <button
                  type="button"
                  onClick={() => setPrimary(idx)}
                  className="w-7 h-7 bg-white rounded-full flex items-center justify-center"
                  title="Set as primary"
                >
                  <Star className="w-3.5 h-3.5 text-yellow-500" />
                </button>
              )}
              <button
                type="button"
                onClick={() => removeImage(idx)}
                className="w-7 h-7 bg-white rounded-full flex items-center justify-center"
                title="Remove"
              >
                <X className="w-3.5 h-3.5 text-red-500" />
              </button>
            </div>
          </div>
        ))}

        {images.length < maxImages && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className={cn(
              'w-24 h-24 rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center gap-1 text-gray-400 hover:border-brand-400 hover:text-brand-500 transition-colors',
              uploading && 'opacity-50 cursor-not-allowed',
            )}
          >
            {uploading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <ImagePlus className="w-5 h-5" />
                <span className="text-[10px]">Add Image</span>
              </>
            )}
          </button>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />

      <p className="text-xs text-gray-400">
        {images.length}/{maxImages} images. First image is primary. Hover to set primary or remove.
      </p>
    </div>
  );
}
