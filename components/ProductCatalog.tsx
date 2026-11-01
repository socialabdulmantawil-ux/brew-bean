import {
  Check,
  Coffee,
  Cookie,
  CupSoda,
  Search,
  SlidersHorizontal,
  Sparkles,
  Utensils,
  X
} from 'lucide-react';
import type { Product } from '../types';
import ProductCard from './ProductCard';

interface ProductCatalogProps {
  products: Product[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onAddToCart: (product: Product) => void;
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
  onSelectCategory,
  searchQuery,
  onSearchChange,
  onAddToCart
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
        {categories.map((category) => {
          const CategoryIcon = category.icon;
          const isActive = selectedCategory === category.id;
          return (
            <button
              key={category.id}
              onClick={() => onSelectCategory(category.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                  : 'bg-[#131b2e] text-slate-400 hover:bg-slate-800 hover:text-slate-200 border border-slate-800/80'
              }`}
            >
              <CategoryIcon className="w-3.5 h-3.5" />
              <span>{category.id}</span>
            </button>
          );
        })}
      </div>

      <div className="flex items-center justify-between shrink-0">
        <h2 className="text-sm font-bold text-slate-200 tracking-wide">{selectedCategory}</h2>
        <span className="text-xs text-slate-500 font-medium">{products.length} products available</span>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-2">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 pb-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} onAdd={onAddToCart} />
          ))}
        </div>
      </div>

      <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-500 shrink-0">
        <span>Prices in Philippine pesos (PHP)</span>
        <span className="text-emerald-500 font-medium flex items-center space-x-1">
          <Check className="w-3 h-3" />
          <span>Fresh &amp; Quality Assured</span>
        </span>
      </div>
    </div>
  );
}
