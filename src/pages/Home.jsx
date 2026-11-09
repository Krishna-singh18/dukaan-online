import React from 'react';
import { Hero } from '../components/home/Hero';
import { CategorySection } from '../components/home/CategorySection';
import { OfferBanner } from '../components/home/OfferBanner';
import { ProductSection } from '../components/home/ProductSection';
import { StoreBenefits } from '../components/home/StoreBenefits';

export function Home({ onNavigate, onSelectCategory }) {
  const handleCategoryClick = (categoryId) => {
    if (onSelectCategory) {
      onSelectCategory(categoryId);
    }
    if (onNavigate) {
      onNavigate('shop');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleShopClick = () => {
    if (onSelectCategory) {
      onSelectCategory('all');
    }
    if (onNavigate) {
      onNavigate('shop');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleOffersClick = () => {
    if (onNavigate) {
      onNavigate('offers');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="w-full">
      {/* 1. Hero Section */}
      <Hero onShopClick={handleShopClick} />

      {/* 2. Store Trust Pillars */}
      <StoreBenefits />

      {/* 3. Category Grid */}
      <CategorySection onSelectCategory={handleCategoryClick} />

      {/* 4. Promotional Banner */}
      <OfferBanner onShopOffers={handleOffersClick} />

      {/* 5. Featured Essentials */}
      <ProductSection onViewAll={handleShopClick} />
    </div>
  );
}

export default Home;

