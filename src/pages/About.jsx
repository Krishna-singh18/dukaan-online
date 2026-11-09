import React from 'react';
import { useStore } from '../hooks/useStore';
import { SectionHeading } from '../components/common/SectionHeading';
import { Button } from '../components/common/Button';
import {
  ShieldCheck,
  Heart,
  Truck,
  Users,
  Award,
  Sparkles,
  ArrowRight,
  Store
} from 'lucide-react';

export function About({ onNavigate }) {
  const { storeConfig, aboutSettings } = useStore();
  const pillars = [
    {
      icon: ShieldCheck,
      title: "100% Authentic & Pure",
      description: "We handpick our chakki fresh atta, unpolished pulses, and pure desi cow ghee to ensure your family gets the cleanest nutrition without adulteration."
    },
    {
      icon: Award,
      title: "Fair Kirana Pricing",
      description: "No inflated markups or hidden fees. We offer daily wholesale pricing with transparent bundle discounts on all monthly staples."
    },
    {
      icon: Truck,
      title: "Fast Local Neighborhood Delivery",
      description: `Orders delivered straight to your doorstep within ${storeConfig.delivery.estimatedTime} across ${storeConfig.address.area} and neighboring sectors.`
    },
    {
      icon: Heart,
      title: "Personalized Kirana Care",
      description: "We are your friendly neighborhood shopkeepers. Need loose change or special brand preferences? We take care of you like family."
    }
  ];

  return (
    <div className="py-8 sm:py-14 bg-background min-h-[75vh]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Hero Banner */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <span className="inline-block text-xs font-bold tracking-wider uppercase px-3 py-1 rounded-full bg-secondary text-primary mb-3">
            About Our Store
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-mainText tracking-tight mb-4 leading-tight">
            {aboutSettings?.heroTitle || "Serving Our Neighborhood with Trust & Purity"}
          </h1>
          <p className="text-base sm:text-lg text-secondaryText leading-relaxed">
            {aboutSettings?.heroSubtitle || `${storeConfig.name} is dedicated to bringing traditional Kirana values into the digital era — fresh staples, fair rates, and direct convenience.`}
          </p>
        </div>

        {/* Story Section */}
        <div className="bg-surface rounded-3xl p-6 sm:p-10 border border-gray-100 shadow-xs mb-12 lg:mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Visual Photo Card */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-2xl overflow-hidden aspect-[4/3] bg-emerald-50 shadow-md">
                <img
                  src={aboutSettings?.storyImage || "https://images.unsplash.com/photo-1604719312566-8912e9227c6a?auto=format&fit=crop&w=800&q=80"}
                  alt={`${storeConfig.name} grocery aisles`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-5">
                  <div className="text-white">
                    <span className="text-xs font-semibold text-emerald-300 block uppercase tracking-wide">
                      Your Local Kirana
                    </span>
                    <p className="text-base font-bold">
                      {[storeConfig.address.area, storeConfig.address.city].filter(Boolean).join(', ')}
                    </p>
                  </div>
                </div>
              </div>

              {/* Floating Badge */}
              <div className="absolute -bottom-4 -right-2 bg-surface rounded-2xl p-3 shadow-lg border border-emerald-100 flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-secondary flex items-center justify-center text-primary">
                  <Store size={20} />
                </div>
                <div>
                  <span className="text-xs font-extrabold text-mainText block">Managed by</span>
                  <span className="text-xs text-secondaryText">{storeConfig.ownerName}</span>
                </div>
              </div>
            </div>

            {/* Story Text */}
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-accent uppercase tracking-wide">
                <Sparkles size={14} />
                <span>{aboutSettings?.storyBadge || "Our Heritage"}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-mainText tracking-tight">
                {aboutSettings?.storyTitle || "Bringing the Best Grocery Staples to Every Household"}
              </h2>
              <p className="text-sm sm:text-base text-secondaryText leading-relaxed">
                {aboutSettings?.storyParagraph1 || "For years, local Kirana stores have been the heartbeat of Indian neighborhoods. We know your family's favorite tea, which atta makes the softest chapatis, and how important purity is when buying dal and mustard oil."}
              </p>
              <p className="text-sm sm:text-base text-secondaryText leading-relaxed">
                {aboutSettings?.storyParagraph2 || `With ${storeConfig.name}, we make it effortless for you to order your daily groceries directly online without complex checkout forms. We prepare your order with care and deliver it straight to your doorstep.`}
              </p>

              <div className="pt-2 flex flex-wrap gap-4 items-center">
                <div className="flex items-center gap-2 text-xs font-semibold text-primary bg-secondary px-3 py-1.5 rounded-lg">
                  <Users size={15} />
                  <span>{aboutSettings?.stat1 || "2,000+ Happy Families"}</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-lg">
                  <ShieldCheck size={15} />
                  <span>{aboutSettings?.stat2 || "100% Genuine Quality"}</span>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* 4 Pillars of Excellence */}
        <div className="mb-14">
          <SectionHeading
            badge="Why Choose Us"
            title="The Kirana Difference"
            subtitle="How we ensure you get the best value, freshest products, and fastest delivery every single day."
            align="center"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {pillars.map((pillar, idx) => {
              const Icon = pillar.icon;
              return (
                <div
                  key={idx}
                  className="bg-surface p-6 rounded-2xl border border-gray-100 hover:border-emerald-200 shadow-2xs hover:shadow-sm transition-all duration-200"
                >
                  <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center text-primary mb-4">
                    <Icon size={24} />
                  </div>
                  <h3 className="text-base font-bold text-mainText mb-2">
                    {pillar.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-secondaryText leading-relaxed">
                    {pillar.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Call to Action Banner */}
        <div className="bg-gradient-to-r from-primary to-primary-dark rounded-3xl p-8 sm:p-12 text-white text-center shadow-lg">
          <h2 className="text-2xl sm:text-3xl font-extrabold mb-3">
            Experience Taaza Grocery Shopping Today!
          </h2>
          <p className="text-sm sm:text-base text-emerald-100 max-w-xl mx-auto mb-6">
            Have questions about product availability or want to send your monthly grocery list directly? We are always here to assist.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button
              variant="accent"
              size="lg"
              onClick={() => onNavigate('shop')}
              rightIcon={<ArrowRight size={18} />}
              className="w-full sm:w-auto font-bold"
            >
              Browse Grocery Shop
            </Button>
          </div>
        </div>

      </div>
    </div>
  );
}

export default About;

