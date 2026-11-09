import React from 'react';
import { useStore } from '../../hooks/useStore';
import { SectionHeading } from '../common/SectionHeading';
import { ArrowRight } from 'lucide-react';

export function CategorySection({ onSelectCategory }) {
  const { categories } = useStore();
  return (
    <section className="py-10 sm:py-14 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badge="Browse by Category"
          title="Daily Kirana Categories"
          subtitle="Select a category to quickly find daily essentials, grains, and household items."
          action={
            <button
              onClick={() => onSelectCategory('all')}
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-primary hover:text-primary-dark transition-colors"
            >
              <span>View All Products</span>
              <ArrowRight size={16} />
            </button>
          }
        />

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className="group bg-surface rounded-2xl p-3 sm:p-4 border border-gray-100 hover:border-emerald-300 shadow-2xs hover:shadow-md transition-all duration-200 text-left flex flex-col justify-between overflow-hidden relative"
            >
              {/* Category Image */}
              <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-emerald-50/50 mb-3">
                <img
                  src={cat.image}
                  alt={cat.name}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute top-2 left-2 w-8 h-8 rounded-lg bg-surface/90 backdrop-blur-xs flex items-center justify-center text-base shadow-xs">
                  {cat.icon}
                </div>
              </div>

              {/* Title & Item Count */}
              <div>
                <h3 className="font-bold text-xs sm:text-sm text-mainText group-hover:text-primary transition-colors leading-snug">
                  {cat.name}
                </h3>
                <div className="flex items-center justify-between mt-1 text-[11px] text-secondaryText">
                  <span className="text-emerald-800 font-medium">{cat.hindiName}</span>
                  <span className="font-semibold text-gray-400 group-hover:text-primary transition-colors">
                    &rarr;
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

export default CategorySection;

