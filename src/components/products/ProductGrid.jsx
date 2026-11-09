import React from 'react';
import { ProductCard } from './ProductCard';
import { PackageOpen } from 'lucide-react';

export function ProductGrid({ products = [], emptyMessage = "No grocery items found matching your criteria." }) {
  if (!products || products.length === 0) {
    return (
      <div className="py-12 sm:py-16 text-center bg-surface rounded-2xl border border-dashed border-gray-200 p-8">
        <div className="w-16 h-16 rounded-full bg-secondary/60 flex items-center justify-center mx-auto mb-3 text-primary">
          <PackageOpen size={30} />
        </div>
        <h3 className="text-base font-bold text-mainText mb-1">No Products Found</h3>
        <p className="text-sm text-secondaryText max-w-md mx-auto">
          {emptyMessage}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

export default ProductGrid;

