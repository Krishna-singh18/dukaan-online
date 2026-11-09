import React from 'react';
import { Truck, ShieldCheck, Tag, MessageCircle } from 'lucide-react';
import { useStore } from '../../hooks/useStore';

export function StoreBenefits() {
  const { storeConfig } = useStore();
  const icons = {
    'fast-delivery': Truck,
    'pure-quality': ShieldCheck,
    'best-prices': Tag,
    'whatsapp-ordering': MessageCircle,
  };

  return (
    <section className="py-10 sm:py-14 bg-surface border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {storeConfig.benefits.map((benefit) => {
            const Icon = icons[benefit.id] || ShieldCheck;

            return (
              <div
                key={benefit.id}
                className="flex items-start gap-4 p-4 rounded-2xl bg-background border border-gray-100 hover:border-emerald-200 transition-colors"
              >
                <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center text-primary shrink-0">
                  <Icon size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-sm sm:text-base text-mainText mb-1">
                    {benefit.title}
                  </h3>
                  <p className="text-xs text-secondaryText leading-relaxed">
                    {benefit.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default StoreBenefits;

