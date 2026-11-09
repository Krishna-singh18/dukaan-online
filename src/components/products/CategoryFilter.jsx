import React from 'react';
import { useStore } from '../../hooks/useStore';

export function CategoryFilter({ selectedCategory = 'all', onSelectCategory }) {
  const { categories } = useStore();
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2 pt-1 no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
      <button
        onClick={() => onSelectCategory('all')}
        className={`whitespace-nowrap px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-150 shrink-0 border ${
          selectedCategory === 'all'
            ? 'bg-primary text-white border-primary shadow-xs'
            : 'bg-surface text-mainText border-gray-200 hover:border-primary/40 hover:bg-gray-50'
        }`}
      >
        ✨ All Products
      </button>

      {categories.map((cat) => {
        const isSelected = selectedCategory === cat.id;
        return (
          <button
            key={cat.id}
            onClick={() => onSelectCategory(cat.id)}
            className={`whitespace-nowrap flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-150 shrink-0 border ${
              isSelected
                ? 'bg-primary text-white border-primary shadow-xs'
                : 'bg-surface text-mainText border-gray-200 hover:border-primary/40 hover:bg-gray-50'
            }`}
          >
            <span>{cat.icon}</span>
            <span>{cat.name}</span>
          </button>
        );
      })}
    </div>
  );
}

export default CategoryFilter;

