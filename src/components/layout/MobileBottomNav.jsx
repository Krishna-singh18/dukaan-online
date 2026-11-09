import React from 'react';
import { Home, Grid, Tag, ShoppingBag, PhoneCall } from 'lucide-react';
import { useCart } from '../../hooks/useCart';

export function MobileBottomNav({ activePage = 'home', onNavigate }) {
  const { totalItemsCount, setIsCartOpen } = useCart();

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'shop', label: 'Shop', icon: Grid },
    { id: 'offers', label: 'Offers', icon: Tag },
    { id: 'cart', label: 'Cart', icon: ShoppingBag, isCart: true },
    { id: 'contact', label: 'Contact', icon: PhoneCall },
  ];

  const handleClick = (item) => {
    if (item.isCart) {
      setIsCartOpen(true);
    } else if (onNavigate) {
      onNavigate(item.id);
    }
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 bg-surface/95 backdrop-blur-md border-t border-gray-200/80 shadow-[0_-4px_16px_rgba(0,0,0,0.06)] md:hidden pb-safe">
      <div className="flex items-center justify-around h-16 px-1 max-w-lg mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = !item.isCart && activePage === item.id;

          return (
            <button
              key={item.id}
              onClick={() => handleClick(item)}
              aria-label={item.label}
              className={`flex flex-col items-center justify-center flex-1 py-1 px-1 rounded-xl transition-all duration-150 relative active:scale-90 select-none ${
                isActive ? 'text-primary font-bold' : 'text-secondaryText hover:text-primary'
              }`}
            >
              <div className="relative">
                <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                {item.isCart && totalItemsCount > 0 && (
                  <span className="absolute -top-1.5 -right-2.5 bg-accent text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                    {totalItemsCount > 99 ? '99+' : totalItemsCount}
                  </span>
                )}
              </div>
              <span className="text-[10px] sm:text-[11px] mt-1 leading-none tracking-tight font-medium">
                {item.label}
              </span>
              {isActive && (
                <span className="w-1.5 h-1.5 bg-primary rounded-full mt-0.5"></span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}

export default MobileBottomNav;
