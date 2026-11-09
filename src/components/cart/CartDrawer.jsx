import React, { useEffect } from 'react';
import { X, ShoppingBag, ArrowRight, Trash2 } from 'lucide-react';
import { useCart } from '../../hooks/useCart';
import { CartItem } from './CartItem';
import { CartSummary } from './CartSummary';
import { Button } from '../common/Button';

export function CartDrawer({ onCheckout, onNavigate }) {
  const { items, isCartOpen, setIsCartOpen, clearCart, totalItemsCount } = useCart();

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isCartOpen) {
        setIsCartOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCartOpen, setIsCartOpen]);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isCartOpen]);

  if (!isCartOpen) return null;

  const handleStartShopping = () => {
    setIsCartOpen(false);
    if (onNavigate) {
      onNavigate('shop');
    }
  };

  const handleProceed = () => {
    setIsCartOpen(false);
    if (onCheckout) {
      onCheckout();
    } else if (onNavigate) {
      onNavigate('cart');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        onClick={() => setIsCartOpen(false)}
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity duration-300 animate-in fade-in"
      />

      {/* Drawer Container */}
      <div className="relative w-full max-w-md bg-background h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-right duration-300">
        
        {/* Drawer Header */}
        <div className="bg-surface px-4 py-4 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-secondary flex items-center justify-center text-primary">
              <ShoppingBag size={18} />
            </div>
            <div>
              <h2 className="text-base font-bold text-mainText leading-tight">
                Shopping Cart
              </h2>
              <span className="text-xs text-secondaryText">
                {totalItemsCount} {totalItemsCount === 1 ? 'item' : 'items'} in your cart
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {totalItemsCount > 0 && (
              <button
                onClick={clearCart}
                className="text-xs font-semibold text-red-600 hover:text-red-700 hover:bg-red-50 px-2.5 py-1.5 rounded-lg transition-colors flex items-center gap-1"
                title="Clear entire cart"
              >
                <Trash2 size={13} />
                <span>Clear</span>
              </button>
            )}

            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-colors"
              aria-label="Close cart drawer"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Drawer Content */}
        {totalItemsCount === 0 ? (
          /* Empty Cart State */
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
            <div className="w-20 h-20 rounded-2xl bg-secondary/70 flex items-center justify-center text-primary mb-4 text-3xl">
              🛒
            </div>
            <h3 className="text-lg font-bold text-mainText mb-1">Your cart is empty</h3>
            <p className="text-xs sm:text-sm text-secondaryText max-w-xs mb-6">
              Looks like you haven't added any groceries to your cart yet. Browse our Taaza Kirana products!
            </p>
            <Button
              variant="primary"
              size="md"
              onClick={handleStartShopping}
              rightIcon={<ArrowRight size={16} />}
            >
              Start Grocery Shopping
            </Button>
          </div>
        ) : (
          /* Items List & Summary */
          <>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {items.map((item) => (
                <CartItem key={item.id} item={item} />
              ))}
            </div>

            {/* Bottom Summary & Checkout Button */}
            <div className="p-4 bg-surface border-t border-gray-100 shadow-[0_-4px_16px_rgba(0,0,0,0.03)]">
              <CartSummary
                showCheckoutButton={true}
                onCheckout={handleProceed}
              />
            </div>
          </>
        )}

      </div>
    </div>
  );
}

export default CartDrawer;

