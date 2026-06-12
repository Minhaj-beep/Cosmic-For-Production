import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

interface ProductCardProps {
  id: string;
  name: string;
  slug: string;
  categoryName: string;
  price: number;
  originalPrice?: number | null;
  image: string;
  shortDescription: string;
  badge?: string | null;
  isNew?: boolean;
  index?: number;
}

const badgeStyles: Record<string, string> = {
  'New':       'bg-[#D61C1C] text-white',
  'Featured':  'bg-zinc-900 text-white',
  'Limited':   'bg-zinc-800 text-white',
  'Best Seller': 'bg-zinc-900 text-white',
  'Sale':      'bg-[#D61C1C] text-white',
};

export default function ProductCard({
  name, slug, categoryName, price, originalPrice,
  image, shortDescription, badge, index = 0,
}: ProductCardProps) {
  return (
    <Link
      href={`/products/${slug}`}
      className="group block"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      {/* Image container */}
      <div className="relative overflow-hidden bg-zinc-50 aspect-[4/3]">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover transition-all duration-700 group-hover:scale-[1.05]"
          style={{ objectPosition: 'center 30%' }}
          loading="lazy"
        />

        {/* Badge */}
        {badge && (
          <div className={`absolute top-3 left-3 px-2.5 py-1 text-[10px] font-semibold tracking-[0.15em] uppercase ${badgeStyles[badge] ?? 'bg-white text-zinc-900'}`}>
            {badge}
          </div>
        )}

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/8 transition-colors duration-700" />

        {/* Quick action */}
        <div className="absolute bottom-3 right-3 w-9 h-9 flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-400 translate-y-2 group-hover:translate-y-0" style={{ backgroundColor: '#D61C1C' }}>
          <ArrowUpRight className="w-4 h-4 text-white" />
        </div>
      </div>

      {/* Info */}
      <div className="pt-4 pb-1">
        <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-zinc-400 mb-1.5">{categoryName}</p>
        <h3 className="font-display text-[17px] font-medium text-zinc-900 leading-tight mb-2 group-hover:text-zinc-600 transition-colors duration-300">
          {name}
        </h3>
        <p className="text-sm text-zinc-500 mb-3 line-clamp-1 leading-relaxed">{shortDescription}</p>
        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold text-zinc-900">
            ₹{price.toLocaleString('en-IN')}
          </span>
          {originalPrice && (
            <>
              <span className="text-xs text-zinc-400 line-through">₹{originalPrice.toLocaleString('en-IN')}</span>
              <span className="text-[10px] font-semibold" style={{ color: '#D61C1C' }}>
                {Math.round((1 - price / originalPrice) * 100)}% off
              </span>
            </>
          )}
        </div>
      </div>
    </Link>
  );
}
