import React, { useState, useMemo } from 'react';
import { useStore } from '../hooks/useStore';
import { ProductGrid } from '../components/products/ProductGrid';
import { ProductSearch } from '../components/products/ProductSearch';
import { CategoryFilter } from '../components/products/CategoryFilter';
import { SectionHeading } from '../components/common/SectionHeading';
import { calculateDiscount } from '../utils/formatPrice';
import { SlidersHorizontal, Sparkles } from 'lucide-react';

export function Products({
  selectedCategory = 'all',
  onSelectCategory,
  offersOnly = false,
}) {
  const { products, categories } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('popular'); // 'popular' | 'price-asc' | 'price-desc' | 'discount'

  // Filter & sort logic
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Filter by offers if offers tab is active
    if (offersOnly) {
      result = result.filter((p) => p.isBestOffer || calculateDiscount(p.originalPrice, p.price) >= 10);
    }

    // Filter by Category
    if (selectedCategory && selectedCategory !== 'all') {
      result = result.filter((p) => p.category === selectedCategory);
    }

    // Filter by Search Query (searches in product name, brand, and hindiName)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          (p.brand && p.brand.toLowerCase().includes(q)) ||
          (p.hindiName && p.hindiName.toLowerCase().includes(q)) ||
          p.description.toLowerCase().includes(q)
      );
    }

    // Sort
    const getPrice = (p) => p.price ?? (p.variants?.[0]?.price ?? 0);
    const getOrigPrice = (p) => p.originalPrice ?? (p.variants?.[0]?.originalPrice ?? getPrice(p));

    if (sortBy === 'price-asc') {
      result.sort((a, b) => getPrice(a) - getPrice(b));
    } else if (sortBy === 'price-desc') {
      result.sort((a, b) => getPrice(b) - getPrice(a));
    } else if (sortBy === 'discount') {
      result.sort((a, b) => {
        const discA = calculateDiscount(getOrigPrice(a), getPrice(a));
        const discB = calculateDiscount(getOrigPrice(b), getPrice(b));
        return discB - discA;
      });
    }

    return result;
  }, [products, selectedCategory, searchQuery, sortBy, offersOnly]);

  const currentCategoryObj = categories.find((c) => c.id === selectedCategory);
  const categoryTitle = offersOnly
    ? 'Special Kirana Deals & Offers'
    : selectedCategory === 'all'
    ? 'All Grocery Essentials'
    : currentCategoryObj?.name || 'Category Items';

  return (
    <div className="py-6 sm:py-10 bg-background min-h-[70vh]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Heading */}
        <SectionHeading
          badge={offersOnly ? 'Special Offers' : 'Fresh Stock'}
          title={categoryTitle}
          subtitle={
            offersOnly
              ? 'Handpicked bulk discounts, staple savings, and combo deals for your home.'
              : currentCategoryObj?.description || 'Browse high quality staples, spices, dairy, and household essentials.'
          }
        />

        {/* Search & Sort Controls Bar */}
        <div className="bg-surface rounded-2xl p-4 border border-gray-100 shadow-2xs mb-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
            
            {/* Search Input */}
            <div className="md:col-span-8">
              <ProductSearch
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                placeholder="Search atta, toor dal, mustard oil, milk, biscuits..."
              />
            </div>

            {/* Sort Dropdown */}
            <div className="md:col-span-4 flex items-center justify-end gap-2">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-secondaryText shrink-0">
                <SlidersHorizontal size={14} />
                <span>Sort by:</span>
              </div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full sm:w-auto bg-background border border-gray-200 rounded-xl px-3 py-2 text-xs sm:text-sm font-medium text-mainText focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              >
                <option value="popular">Recommended / Popular</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="discount">Biggest Discount</option>
              </select>
            </div>
          </div>

          {/* Category Pills (Only if not in offers-only mode) */}
          {!offersOnly && (
            <div className="pt-2 border-t border-gray-100">
              <CategoryFilter
                selectedCategory={selectedCategory}
                onSelectCategory={onSelectCategory}
              />
            </div>
          )}
        </div>

        {/* Results Info Bar */}
        <div className="flex items-center justify-between text-xs text-secondaryText mb-4 px-1">
          <span>
            Showing <strong className="text-mainText">{filteredProducts.length}</strong> items
          </span>
          {(searchQuery || selectedCategory !== 'all') && (
            <button
              onClick={() => {
                setSearchQuery('');
                if (onSelectCategory) onSelectCategory('all');
              }}
              className="text-primary font-semibold hover:underline"
            >
              Reset Filters
            </button>
          )}
        </div>

        {/* Product Grid */}
        <ProductGrid
          products={filteredProducts}
          emptyMessage={
            searchQuery
              ? `No items found matching "${searchQuery}". Please check your spelling or search for another grocery staple.`
              : 'No items in this category currently. Please select another category.'
          }
        />

      </div>
    </div>
  );
}

export default Products;

