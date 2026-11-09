import React, { useState } from 'react';
import { ShoppingBag, Phone, Menu, X, Clock, MapPin } from 'lucide-react';
import { useStore } from '../../hooks/useStore';
import { useCart } from '../../hooks/useCart';

export function Navbar({ activePage = 'home', onNavigate }) {
  const { storeConfig } = useStore();
  const { totalItemsCount, setIsCartOpen } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'shop', label: 'Shop' },
    { id: 'offers', label: 'Offers' },
    { id: 'about', label: 'About' },
    { id: 'contact', label: 'Contact' },
    { id: 'admin', label: '⚙️ Shopkeeper', isSpecial: true },
  ];

  const handleNavClick = (pageId) => {
    if (onNavigate) {
      onNavigate(pageId);
    }
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-30 bg-surface/95 backdrop-blur-md border-b border-gray-100 shadow-xs">
      {/* Top Announcement Bar */}
      <div className="bg-primary text-white text-xs py-1.5 px-4 hidden sm:block">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 opacity-90">
              <Clock size={13} /> {storeConfig.openingHours.timing}
            </span>
            <span className="opacity-40">|</span>
            <span className="flex items-center gap-1.5 opacity-90">
              <MapPin size={13} /> Free Delivery above ₹{storeConfig.delivery.freeDeliveryAbove}
            </span>
          </div>
          <div className="flex items-center gap-3 font-medium">
            <span>Call us:</span>
            <a href={`tel:${storeConfig.displayPhone}`} className="hover:underline flex items-center gap-1">
              <Phone size={12} /> {storeConfig.displayPhone}
            </a>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
          {/* Logo & Store Identity */}
          <button
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-3 text-left focus:outline-none group"
            aria-label={`${storeConfig.name} Home`}
          >
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform">
              <span className="text-xl sm:text-2xl">🛍️</span>
            </div>
            <div>
              <span className="font-extrabold text-lg sm:text-xl text-primary tracking-tight block leading-tight">
                {storeConfig.name}
              </span>
              <span className="text-[10px] sm:text-xs font-semibold text-secondaryText tracking-wide block uppercase">
                {storeConfig.logoSubtext}
              </span>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navLinks.map((link) => {
              const isActive = activePage === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link.id)}
                  className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'text-primary bg-secondary/80 font-semibold'
                      : 'text-mainText/80 hover:text-primary hover:bg-gray-50'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </nav>

          {/* Right Action Icons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Quick Call Icon (Mobile) */}
            <a
              href={`tel:${storeConfig.displayPhone}`}
              className="p-2.5 rounded-xl text-mainText/70 hover:text-primary hover:bg-secondary/50 sm:hidden transition-colors"
              aria-label="Call Store"
            >
              <Phone size={20} />
            </a>

            {/* Shopping Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl bg-secondary hover:bg-emerald-100 text-primary font-medium text-sm transition-all active:scale-95"
              aria-label={`View Cart, ${totalItemsCount} items`}
            >
              <div className="relative">
                <ShoppingBag size={20} />
                {totalItemsCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-accent text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-xs animate-bounce">
                    {totalItemsCount > 99 ? '99+' : totalItemsCount}
                  </span>
                )}
              </div>
              <span className="hidden sm:inline font-semibold">Cart</span>
            </button>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-xl text-mainText hover:bg-gray-100 md:hidden transition-colors"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-surface px-4 pt-3 pb-6 shadow-lg animate-in slide-in-from-top duration-200">
          <div className="flex flex-col gap-1">
            {navLinks.map((link) => {
              const isActive = activePage === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link.id)}
                  className={`text-left px-4 py-3 rounded-xl text-base font-medium transition-colors ${
                    isActive
                      ? 'text-primary bg-secondary/80 font-bold'
                      : 'text-mainText hover:bg-gray-50'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </div>

          <div className="mt-4 pt-4 border-t border-gray-100 flex flex-col gap-2.5 text-xs text-secondaryText">
            <div className="flex items-center gap-2">
              <Clock size={14} className="text-primary" />
              <span>{storeConfig.openingHours.days}: {storeConfig.openingHours.timing}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin size={14} className="text-primary" />
              <span>{storeConfig.address.area}, {storeConfig.address.city}</span>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;

