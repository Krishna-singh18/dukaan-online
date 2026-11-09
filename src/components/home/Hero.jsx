import React from 'react';
import { ArrowRight, Truck, ShieldCheck, Zap } from 'lucide-react';
import { Button } from '../common/Button';
import { useStore } from '../../hooks/useStore';

export function Hero({ onShopClick }) {
  const { storeConfig } = useStore();
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-secondary/40 via-background to-background pt-5 pb-10 sm:pt-10 sm:pb-16 border-b border-gray-100/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Text Content */}
          <div className="lg:col-span-7 text-center lg:text-left">
            {/* Neighborhood Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface border border-emerald-200/80 text-primary text-[11px] sm:text-xs font-semibold shadow-2xs mb-3 sm:mb-4">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>{storeConfig.badge} • {storeConfig.address.area}</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-5xl font-extrabold text-mainText tracking-tight leading-[1.18] mb-3 sm:mb-4">
              Your Daily Grocery, <br className="hidden sm:inline" />
              <span className="text-primary">Just One Click Away!</span>
            </h1>

            {/* Description (Hinglish) */}
            <p className="text-xs sm:text-base md:text-lg text-secondaryText max-w-xl mx-auto lg:mx-0 leading-relaxed mb-6 sm:mb-8">
              Ghar ka taaza ration, daily essentials aur dairy ab seedhe aapke ghar tak. Asli wholesale rates aur fast delivery ke saath sabse aasan grocery shopping.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-4 mb-6 sm:mb-8">
              <Button
                variant="primary"
                size="md"
                onClick={onShopClick}
                rightIcon={<ArrowRight size={17} />}
                className="w-full sm:w-auto shadow-md"
              >
                Shop Now
              </Button>
            </div>

            {/* Highlighted Delivery Info */}
            <div className="pt-4 sm:pt-6 border-t border-gray-200/70 grid grid-cols-3 gap-2 sm:gap-4 max-w-lg mx-auto lg:mx-0">
              <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
                <span className="text-[11px] sm:text-xs font-bold text-mainText flex items-center gap-1">
                  <Zap size={13} className="text-accent shrink-0" />
                  {storeConfig.delivery.estimatedTime}
                </span>
                <span className="text-[10px] sm:text-[11px] text-secondaryText">Express Delivery</span>
              </div>

              <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
                <span className="text-[11px] sm:text-xs font-bold text-mainText flex items-center gap-1">
                  <Truck size={13} className="text-primary shrink-0" />
                  Free &gt; ₹{storeConfig.delivery.freeDeliveryAbove}
                </span>
                <span className="text-[10px] sm:text-[11px] text-secondaryText">Zero Delivery Fee</span>
              </div>

              <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
                <span className="text-[11px] sm:text-xs font-bold text-mainText flex items-center gap-1">
                  <ShieldCheck size={13} className="text-emerald-600 shrink-0" />
                  100% Shuddh
                </span>
                <span className="text-[10px] sm:text-[11px] text-secondaryText">Handpicked Quality</span>
              </div>
            </div>
          </div>

          {/* Right Visual Grocery Showcase */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Background Glow */}
              <div className="absolute -inset-2 bg-gradient-to-r from-emerald-200 to-amber-100 rounded-3xl filter blur-xl opacity-60"></div>
              
              {/* Main Grocery Image Card */}
              <div className="relative bg-surface rounded-3xl p-3 sm:p-4 shadow-xl border border-emerald-100/80">
                <div className="relative rounded-2xl overflow-hidden aspect-[4/3] bg-emerald-50">
                  <img
                    src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80"
                    alt="Fresh Kirana Grocery Essentials"
                    loading="eager"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-4">
                    <div className="text-white">
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-accent px-2 py-0.5 rounded text-white inline-block mb-1">
                        Daily Fresh Kirana
                      </span>
                      <p className="text-xs sm:text-sm font-semibold">Grains, Pulses, Dairy &amp; Spices</p>
                    </div>
                  </div>
                </div>

                {/* Floating Quick Feature Card */}
                <div className="absolute -bottom-3 -left-2 sm:-bottom-4 sm:-left-4 bg-surface rounded-2xl p-2.5 sm:p-3 shadow-lg border border-gray-100 flex items-center gap-2.5 sm:gap-3 max-w-[190px]">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-secondary flex items-center justify-center text-primary text-base sm:text-lg shrink-0">
                    🌾
                  </div>
                  <div>
                    <span className="text-[9px] sm:text-[10px] text-secondaryText font-medium block">Special Atta &amp; Dal</span>
                    <span className="text-[11px] sm:text-xs font-bold text-mainText">Starting at ₹36</span>
                  </div>
                </div>

                {/* Floating WhatsApp Quick Tag */}
                <div className="absolute -top-3 -right-2 sm:-top-3 sm:-right-3 bg-[#25D366] text-white rounded-2xl px-2.5 py-1.5 sm:px-3 sm:py-2 shadow-md flex items-center gap-1.5 sm:gap-2">
                  <span className="text-xs sm:text-sm">💬</span>
                  <span className="text-[10px] sm:text-xs font-bold">Quick WhatsApp Order</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

export default Hero;
