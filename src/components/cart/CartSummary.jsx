import React from 'react';
import { useCart } from '../../hooks/useCart';
import { useStore } from '../../hooks/useStore';
import { formatPrice } from '../../utils/formatPrice';
import { Truck, CheckCircle2, AlertCircle } from 'lucide-react';

export function CartSummary({ showCheckoutButton = false, onCheckout }) {
  const { subtotal, deliveryFee, grandTotal, totalItemsCount } = useCart();
  const { storeConfig } = useStore();

  const freeDeliveryThreshold = storeConfig.delivery.freeDeliveryAbove;
  const isFreeDelivery = subtotal >= freeDeliveryThreshold;
  const amountNeededForFreeDelivery = Math.max(0, freeDeliveryThreshold - subtotal);
  const progressPercent = Math.min(100, Math.round((subtotal / freeDeliveryThreshold) * 100));
  const isBelowMinOrder = subtotal > 0 && subtotal < storeConfig.delivery.minOrderAmount;

  if (totalItemsCount === 0) return null;

  return (
    <div className="bg-surface rounded-2xl border border-gray-100 p-4 sm:p-5 shadow-2xs space-y-4">
      {/* Free Delivery Incentive Bar */}
      <div className="p-3 rounded-xl bg-secondary/60 border border-emerald-100">
        <div className="flex items-center justify-between text-xs font-semibold text-primary mb-1.5">
          <span className="flex items-center gap-1.5">
            <Truck size={15} />
            {isFreeDelivery ? (
              <span className="text-emerald-700 font-bold">You unlocked FREE Delivery! 🎉</span>
            ) : (
              <span>Add {formatPrice(amountNeededForFreeDelivery)} more for FREE Delivery</span>
            )}
          </span>
          <span className="text-[11px] text-emerald-800 font-bold">{progressPercent}%</span>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-emerald-200/50 rounded-full h-1.5 overflow-hidden">
          <div
            className="bg-primary h-full rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>
      </div>

      {/* Minimum Order Warning */}
      {isBelowMinOrder && (
        <div className="flex items-center gap-2 p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-medium">
          <AlertCircle size={15} className="shrink-0 text-accent" />
          <span>Minimum order amount is {formatPrice(storeConfig.delivery.minOrderAmount)}.</span>
        </div>
      )}

      {/* Price Breakdown */}
      <div className="space-y-2 text-xs sm:text-sm text-secondaryText pt-1">
        <div className="flex items-center justify-between">
          <span>Items Subtotal ({totalItemsCount} {totalItemsCount === 1 ? 'item' : 'items'}):</span>
          <span className="font-semibold text-mainText">{formatPrice(subtotal)}</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1">
            <span>Delivery Fee:</span>
            {isFreeDelivery && (
              <span className="text-[10px] bg-emerald-100 text-primary px-1.5 py-0.2 rounded font-bold">
                FREE
              </span>
            )}
          </span>
          <span className="font-semibold text-mainText">
            {isFreeDelivery ? (
              <span className="text-primary font-bold">₹0</span>
            ) : (
              formatPrice(deliveryFee)
            )}
          </span>
        </div>

        <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-base sm:text-lg font-extrabold text-mainText">
          <span>Total Amount:</span>
          <span className="text-primary">{formatPrice(grandTotal)}</span>
        </div>
      </div>

      {/* Estimated Delivery Note */}
      <div className="flex items-center gap-2 text-[11px] text-secondaryText bg-gray-50 p-2.5 rounded-xl">
        <CheckCircle2 size={14} className="text-primary shrink-0" />
        <span>Estimated Delivery: <strong>{storeConfig.delivery.estimatedTime}</strong> to your location</span>
      </div>

      {/* Optional Checkout Action */}
      {showCheckoutButton && (
        <button
          onClick={onCheckout}
          disabled={isBelowMinOrder}
          className="w-full py-3.5 px-4 rounded-xl bg-primary hover:bg-primary-dark text-white font-bold text-sm shadow-md hover:shadow-lg transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Proceed to Order ({formatPrice(grandTotal)})
        </button>
      )}
    </div>
  );
}

export default CartSummary;

