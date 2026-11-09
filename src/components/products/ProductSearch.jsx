import React from 'react';
import { Search, X } from 'lucide-react';

export function ProductSearch({ searchQuery = '', onSearchChange, placeholder = "Search for atta, dal, ghee, milk, biscuits..." }) {
  return (
    <div className="relative w-full">
      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-secondaryText">
        <Search size={18} />
      </div>

      <input
        type="text"
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-10 pr-10 py-2.5 sm:py-3 bg-surface border border-gray-200 rounded-xl text-sm text-mainText placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-2xs"
      />

      {searchQuery && (
        <button
          onClick={() => onSearchChange('')}
          className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Clear search"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
}

export default ProductSearch;

