import React, { useState } from 'react';
import { useStore } from '../../hooks/useStore';
import { ProductGrid } from '../products/ProductGrid';
import { SectionHeading } from '../common/SectionHeading';
import { Button } from '../common/Button';
import { ArrowRight } from 'lucide-react';

export function ProductSection({ onViewAll }) {
  const { products } = useStore();
  const [activeTab, setActiveTab] = useState('featured');

  const filterTabs = [
    { id: 'featured', label: '🔥 Popular Essentials' },
    { id: 'atta-rice', label: 'Atta & Rice' },
    { id: 'dal-pulses', label: 'Dal & Pulses' },
    { id: 'oil-ghee', label: 'Oil & Ghee' },
    { id: 'dairy-products', label: 'Dairy' },
  ];

  const displayedProducts = products.filter((p) => {
    if (activeTab === 'featured') return p.isFeatured;
    return p.category === activeTab;
  }).slice(0, 8);

  return (
    <section className="py-10 sm:py-14 bg-surface border-y border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badge="Taaza &amp; Best Rates"
          title="Featured Neighborhood Essentials"
          subtitle="Top selling staples, pure ghee, fresh dairy, and daily essentials at fair Kirana prices."
          action={
            <Button
              variant="outline"
              size="sm"
              onClick={onViewAll}
              rightIcon={<ArrowRight size={15} />}
            >
              View All {products.length} Products
            </Button>
          }
        />

        {/* Tab Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 no-scrollbar mb-6">
          {filterTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`whitespace-nowrap px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-150 shrink-0 ${
                activeTab === tab.id
                  ? 'bg-primary text-white shadow-xs'
                  : 'bg-background text-secondaryText hover:text-mainText hover:bg-gray-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Product Cards Grid */}
        <ProductGrid products={displayedProducts} />

        {/* Bottom CTA */}
        <div className="mt-8 text-center sm:hidden">
          <Button
            variant="outline"
            size="md"
            fullWidth
            onClick={onViewAll}
            rightIcon={<ArrowRight size={16} />}
          >
            Explore Complete Store Catalog
          </Button>
        </div>
      </div>
    </section>
  );
}

export default ProductSection;

