import { useEffect, useState } from 'react';
import type { Product } from '../types';

interface EmptyCartSlideshowProps {
  products: Product[];
}

export default function EmptyCartSlideshow({ products }: EmptyCartSlideshowProps) {
  const [activeProduct, setActiveProduct] = useState<Product | null>(() =>
    products.length > 0 ? products[Math.floor(Math.random() * products.length)] : null
  );

  useEffect(() => {
    if (products.length < 2) return;

    const timer = window.setInterval(() => {
      setActiveProduct((currentProduct) => {
        const remainingProducts = products.filter((product) => product.id !== currentProduct?.id);
        return remainingProducts[Math.floor(Math.random() * remainingProducts.length)];
      });
    }, 60_000);

    return () => window.clearInterval(timer);
  }, [products]);

  return (
    <div className="absolute inset-0 overflow-hidden bg-slate-900">
      {activeProduct && (
        <div
          key={activeProduct.id}
          className="empty-cart-slide absolute inset-0"
        >
          <img
            src={activeProduct.image}
            alt=""
            className="h-full w-full object-cover"
          />
        </div>
      )}
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#0b101d]/95 to-transparent px-4 pb-4 pt-12 text-center">
        <p className="text-sm font-medium text-slate-300">Order list is empty</p>
        <p className="mt-1 text-xs text-slate-300/70">Select items from the catalog to start an order</p>
      </div>
    </div>
  );
}
