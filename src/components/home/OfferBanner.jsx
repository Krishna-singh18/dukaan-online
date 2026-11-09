import React from 'react';
import { Tag, ArrowRight, Sparkles, Clock } from 'lucide-react';
import { Button } from '../common/Button';
import { useStore } from '../../hooks/useStore';

export function OfferBanner({ onShopOffers }) {
  const { storeConfig, offerSettings } = useStore();
  const freeAbove = storeConfig?.delivery?.freeDeliveryAbove ?? 299;

  return (
    <section className="py-8 sm:py-12 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-primary to-primary-dark text-white p-6 sm:p-10 shadow-lg">
          {/* Subtle Decorative Pattern */}
          <div className="absolute -right-10 -bottom-10 w-64 h-64 rounded-full bg-white/5 pointer-events-none"></div>
          <div className="absolute right-32 -top-10 w-40 h-40 rounded-full bg-accent/20 pointer-events-none"></div>

          <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            
            {/* Offer Text */}
            <div className="md:col-span-8 text-center md:text-left">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent text-white font-bold text-xs uppercase tracking-wider mb-3 shadow-xs">
                <Sparkles size={13} />
                <span>{offerSettings?.badge || "Special Kirana Savings"}</span>
              </div>

              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight leading-tight mb-2">
                {offerSettings?.title || "Save Up To 25% On Monthly Grocery Staples!"}
              </h2>

              <p className="text-sm sm:text-base text-emerald-100 max-w-xl mb-4 leading-relaxed">
                {offerSettings?.subtitle || "Wholesale bundle discounts on everyday essentials."} Free delivery on orders over ₹{freeAbove}.
              </p>

              <div className="flex items-center justify-center md:justify-start gap-4 text-xs text-emerald-200">
                <span className="flex items-center gap-1">
                  <Clock size={14} className="text-accent" />
                  Limited Time Offers
                </span>
                <span>•</span>
                <span>Direct Home Delivery</span>
              </div>
            </div>

            {/* Offer CTAs */}
            <div className="md:col-span-4 flex justify-center items-center md:items-end">
              <Button
                variant="accent"
                size="md"
                onClick={onShopOffers}
                rightIcon={<ArrowRight size={16} />}
                className="w-full sm:w-auto font-bold shadow-md"
              >
                View Discounted Deals
              </Button>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}

export default OfferBanner;

