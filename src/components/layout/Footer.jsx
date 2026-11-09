import React from 'react';
import { Phone, MapPin, Clock, ExternalLink, ShieldCheck, Truck, Settings } from 'lucide-react';
import { useStore } from '../../hooks/useStore';

export function Footer({ onNavigate }) {
  const { storeConfig } = useStore();
  const currentYear = new Date().getFullYear();

  const handleNavClick = (pageId) => {
    if (onNavigate) {
      onNavigate(pageId);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-[#121B14] text-white/90 pt-12 pb-24 md:pb-12 border-t border-emerald-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 mb-12">
          
          {/* Column 1: Store Brand & About */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white text-xl">
                🛒
              </div>
              <div>
                <span className="font-extrabold text-lg text-white tracking-tight block">
                  {storeConfig.name}
                </span>
                <span className="text-[10px] font-semibold text-emerald-400 tracking-wider block uppercase">
                  {storeConfig.logoSubtext}
                </span>
              </div>
            </div>

            <p className="text-sm text-gray-300 leading-relaxed mb-5">
              {storeConfig.tagline}. Order everyday groceries, staples, spices, and fresh essentials directly with quick WhatsApp delivery to your doorstep.
            </p>

            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-900/50 text-emerald-300 text-xs font-medium border border-emerald-800">
              <ShieldCheck size={14} className="text-emerald-400" />
              <span>{storeConfig.badge}</span>
            </div>
          </div>

          {/* Column 2: Contact Details & Working Hours */}
          <div>
            <h3 className="text-white font-bold text-base mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-accent"></span> Contact Details
            </h3>
            <div className="space-y-3.5 text-sm text-gray-300">
              <div className="flex items-start gap-2.5">
                <MapPin size={18} className="text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <p>{storeConfig.address.fullAddress}</p>
                  <a
                    href={storeConfig.address?.mapsUrl || `https://maps.google.com/?q=${encodeURIComponent(storeConfig.address?.fullAddress || storeConfig.name)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-accent hover:underline mt-1"
                  >
                    <span>View on Google Maps</span>
                    <ExternalLink size={11} />
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <Phone size={16} className="text-emerald-400 shrink-0" />
                <a href={`tel:${storeConfig.displayPhone}`} className="hover:text-white font-medium">
                  {storeConfig.displayPhone}
                </a>
              </div>

              <div className="flex items-start gap-2.5">
                <Clock size={16} className="text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <p>{storeConfig.openingHours.days}</p>
                  <p className="text-xs text-gray-400">{storeConfig.openingHours.timing}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Column 3: Doorstep Delivery & Covered Areas */}
          <div>
            <h3 className="text-white font-bold text-base mb-4 flex items-center gap-2">
              <Truck size={18} className="text-emerald-400" />
              <span>Doorstep Delivery</span>
            </h3>
            <p className="text-xs text-gray-300 mb-3">
              Fast {storeConfig.delivery.estimatedTime} delivery within {storeConfig.delivery.deliveryRadius}:
            </p>
            <div className="flex flex-wrap gap-1.5">
              {storeConfig.delivery.deliveryAreas.map((area, index) => (
                <span
                  key={index}
                  className="text-xs bg-emerald-950 border border-emerald-800 text-gray-300 px-2 py-0.5 rounded-md"
                >
                  {area}
                </span>
              ))}
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-emerald-900/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-400">
          <p>
            &copy; {currentYear} {storeConfig.name}. All rights reserved.
          </p>
          <div className="flex items-center gap-4 flex-wrap">
            <button
              onClick={() => handleNavClick('admin')}
              className="text-gray-400 hover:text-accent flex items-center gap-1 transition-colors"
            >
              <Settings size={12} />
              <span>Shopkeeper Portal</span>
            </button>
            <span className="text-emerald-900">•</span>
            <p className="flex items-center gap-1.5">
              <span>Powered by</span>
              <a
                href="https://www.linkedin.com/in/krishna-singh18/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-white hover:text-accent transition-colors"
                title="LinkedIn Profile of Krishna Singh"
              >
                Krishna Singh (Kishan baish)
              </a>
              <span>• Digital Kirana</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
