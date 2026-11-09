import React from 'react';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '../../hooks/useCart';
import { formatPrice } from '../../utils/formatPrice';

export function FloatingCartBar({ currentPage, onNavigate }) {
  const { totalItemsCount, grandTotal, setIsCartOpen } = useCart();

  // Do not show floating bar if cart is empty, or on checkout/cart page, or on admin page
  if (totalItemsCount === 0 || currentPage === 'cart' || currentPage === 'admin') {
    return null;
  }

  const handleOpenCart = () => {
    setIsCartOpen(true);
  };

  return (
    <aside
      aria-label="Floating Cart Summary"
      className="fixed bottom-[4.25rem] md:bottom-6 left-3 right-3 md:left-6 md:right-auto md:w-80 z-20 animate-in slide-in-from-bottom-4 duration-200"
    >
      <button
        onClick={handleOpenCart}
        className="w-full bg-emerald-700 hover:bg-emerald-800 text-white px-4 py-3 rounded-2xl shadow-xl flex items-center justify-between font-bold text-xs sm:text-sm transition-all duration-150 active:scale-98 border border-emerald-600/40"
      >
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center text-white shrink-0">
            <ShoppingBag size={17} />
          </div>
          <div className="text-left">
            <span className="block text-[11px] text-emerald-100 font-medium leading-tight">
              {totalItemsCount} {totalItemsCount === 1 ? 'item' : 'items'} in Cart
            </span>
            <span className="text-sm font-extrabold leading-tight">
              {formatPrice(grandTotal)}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 bg-white text-emerald-800 px-3 py-1.5 rounded-xl text-xs font-extrabold shadow-xs hover:bg-emerald-50 transition-colors">
          <span>View Cart</span>
          <ArrowRight size={14} />
        </div>
      </button>
    </aside>
  );
}

export default FloatingCartBar;
