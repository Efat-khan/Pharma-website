import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';

const EMOJI_MAP: Record<string, string> = {
  medicine: '💊', medicines: '💊', healthcare: '🏥', beauty: '✨',
  'baby': '👶', herbal: '🌿', nutrition: '🥗', veterinary: '🐾',
  'lab': '🧪', 'home care': '🏠', supplement: '💪',
};

export default function CategoryStrip({ categories }: { categories: any[] }) {
  return (
    <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-3">
      {categories.slice(0, 10).map((cat) => {
        const emoji = EMOJI_MAP[cat.name.toLowerCase()] ||
          Object.entries(EMOJI_MAP).find(([k]) => cat.name.toLowerCase().includes(k))?.[1] || '🏷️';

        return (
          <Link
            key={cat.id}
            href={`/products/category/${cat.slug}`}
            className="flex flex-col items-center gap-2 p-3 bg-white rounded-xl border border-gray-100 hover:border-brand-200 hover:shadow-sm transition-all group"
          >
            <div className="w-12 h-12 bg-brand-50 group-hover:bg-brand-100 rounded-xl flex items-center justify-center transition-colors overflow-hidden">
              {cat.image ? (
                <Image src={cat.image} alt={cat.name} width={48} height={48} className="object-cover rounded-xl" />
              ) : (
                <span className="text-2xl">{emoji}</span>
              )}
            </div>
            <span className="text-xs text-center text-gray-600 group-hover:text-brand-700 font-medium leading-tight line-clamp-2">
              {cat.name}
            </span>
          </Link>
        );
      })}
    </div>
  );
}
