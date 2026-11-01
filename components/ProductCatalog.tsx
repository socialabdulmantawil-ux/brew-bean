import {
  Check,
  Cookie,
  Coffee,
  CupSoda,
  Search,
  SlidersHorizontal,
  Sparkles,
  Utensils,
  X
} from 'lucide-react';
import type { Product } from '../types';

interface ProductCatalogProps {
  products: Product[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onAddToCart: (product: Product) => void;
  formatCurrency: (amount: number) => string;
}

const categories = [
  { id: 'All Items', icon: Sparkles },
  { id: 'Coffee', icon: Coffee },
  { id: 'Drinks', icon: CupSoda },
  { id: 'Bakery', icon: Cookie },
  { id: 'Meals', icon: Utensils }
];

export default function ProductCatalog({
  products,
  selectedCategory,
  onCategoryChange,
  searchQuery,
  onSearchChange,
  onAddToCart,
  formatCurrency
}: ProductCatalogProps) {
  return (
    <div className="flex-1 flex flex-col min-h-[70vh] md:h-full bg-[#0b101d] overflow-hidden p-3 sm:p-4 space-y-4">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 shrink-0">
        <div className="relative flex-1 max-w-xl">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search products by name..."
            value={searchQuery}
            onChange={(event) => onSearchChange(event.target.value)}
            className="w-full bg-[#131b2e] border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 shadow-inner"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-3 text-slate-400 hover:text-white"
              aria-label="Clear product search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <button className="p-2.5 bg-[#131b2e] border border-slate-800 text-slate-400 hover:text-white rounded-xl transition-colors">
          <SlidersHorizontal className="w-4 h-4" />
        </button>
      </div>

      <div className="flex items-center space-x-2 overflow-x-auto pb-1 custom-scrollbar shrink-0">
        {categories.map(({ id, icon: CategoryIcon }) => {
          const isActive = selectedCategory === id;
          return (
            <button
              key={id}
              onClick={() => onCategoryChange(id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                  : 'bg-[#131b2e] text-slate-400 hover:bg-slate-800 hover:text-slate-200 border border-slate-800/80'
              }`}
            >
              <CategoryIcon className="w-3.5 h-3.5" />
              <span>{id}</span>
            </button>
          );
        })}
      </div>

      <div className="flex items-center justify-between shrink-0">
        <h2 className="text-sm font-bold text-slate-200 tracking-wide">{selectedCategory}</h2>
        <span className="text-xs text-slate-500 font-medium">{products.length} products available</span>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-2">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-[12px] pb-[24px]">
          {products.map((product) => (
            <button
              type="button"
              key={product.id}
              onClick={() => onAddToCart(product)}
              className="bg-[#131b2e] border border-slate-800/80 hover:border-blue-500/50 rounded-2xl p-[4px] flex flex-col gap-[10px] cursor-pointer transition-all hover:scale-[1.02] hover:shadow-xl hover:shadow-blue-900/10 group relative overflow-hidden text-left"
            >
              {product.tag && (
                <span className={`absolute top-[8px] right-[8px] ${product.tagColor || 'bg-blue-600'} text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full z-10 shadow-md`}>
                  {product.tag}
                </span>
              )}

              <div className="w-full h-32 rounded-xl overflow-hidden bg-slate-900 relative">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>

              <div className="space-y-[4px]">
                <h3 className="text-xs font-bold text-slate-100 group-hover:text-blue-400 transition-colors truncate">
                  {product.name}
                </h3>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-extrabold text-blue-400">{formatCurrency(product.price)}</span>
                  <span className="text-[10px] text-slate-400 flex items-center space-x-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    <span>{product.stock} in stock</span>
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-500 shrink-0">
        <span>Prices in Philippine pesos (PHP)</span>
        <span className="text-emerald-500 font-medium flex items-center space-x-1">
          <Check className="w-3 h-3" />
          <span>Fresh & Quality Assured</span>
        </span>
      </div>
    </div>
  );
}
