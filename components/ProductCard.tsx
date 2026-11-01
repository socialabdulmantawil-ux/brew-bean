import type { Product } from '../types';
import { formatCurrency } from '../utils';

interface ProductCardProps {
  product: Product;
  onAdd: (product: Product) => void;
}

export default function ProductCard({ product, onAdd }: ProductCardProps) {
  return (
    <div
      onClick={() => onAdd(product)}
      className="bg-[#131b2e] border border-slate-800/80 hover:border-blue-500/50 rounded-2xl p-2.5 flex flex-col justify-between cursor-pointer transition-all hover:scale-[1.02] hover:shadow-xl hover:shadow-blue-900/10 group relative overflow-hidden"
    >
      {product.tag && (
        <span className={`absolute top-4 right-4 ${product.tagColor || 'bg-blue-600'} text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full z-10 shadow-md`}>
          {product.tag}
        </span>
      )}

      <div className="w-full h-32 rounded-xl overflow-hidden bg-slate-900 mb-2.5 relative">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
      </div>

      <div className="space-y-1">
        <h3 className="text-xs font-bold text-slate-100 group-hover:text-blue-400 transition-colors truncate">
          {product.name}
        </h3>
        <div className="flex items-center justify-between pt-1">
          <span className="text-sm font-extrabold text-blue-400">{formatCurrency(product.price)}</span>
          <span className="text-[10px] text-slate-400 flex items-center space-x-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            <span>{product.stock} in stock</span>
          </span>
        </div>
      </div>
    </div>
  );
}
