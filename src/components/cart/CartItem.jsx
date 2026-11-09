import React, { useState } from 'react';
import { Plus, Minus, Trash2 } from 'lucide-react';
import { useCart } from '../../hooks/useCart';
import { formatPrice } from '../../utils/formatPrice';

export function CartItem({ item }) {
  const { incrementQuantity, decrementQuantity, removeFromCart } = useCart();
  const [imgError, setImgError] = useState(false);

  const itemTotal = (item.price || 0) * (item.quantity || 1);

  return (
    <div className="flex items-center gap-3 p-3 bg-surface rounded-2xl border border-gray-100 hover:border-emerald-100 transition-colors">
      {/* Thumbnail */}
      <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-xl overflow-hidden bg-emerald-50/50 shrink-0 border border-gray-100">
        {imgError ? (
          <div className="w-full h-full flex items-center justify-center text-xl bg-gray-50">
            🛒
          </div>
        ) : (
          <img
            src={item.image}
            alt={item.name}
            onError={() => setImgError(true)}
            className="w-full h-full object-cover"
          />
        )}
      </div>

      {/* Item Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-1">
          <h4 className="text-xs sm:text-sm font-semibold text-mainText line-clamp-1 leading-snug">
            {item.name}
          </h4>
          <button
            onClick={() => removeFromCart(item.id)}
            className="text-gray-400 hover:text-red-500 p-1 rounded-lg transition-colors shrink-0"
            aria-label={`Remove ${item.name} from cart`}
          >
            <Trash2 size={15} />
          </button>
        </div>

        <div className="flex items-center gap-2 text-xs text-secondaryText mt-0.5 mb-2">
          {item.unit && (
            <span className="bg-gray-100 px-1.5 py-0.2 rounded text-[10px] font-semibold text-gray-700">
              {item.unit}
            </span>
          )}
          <span>{formatPrice(item.price)} each</span>
        </div>

        {/* Quantity Controls and Total */}
        <div className="flex items-center justify-between">
          <div className="flex items-center bg-gray-100/90 rounded-lg overflow-hidden border border-gray-200">
            <button
              onClick={() => decrementQuantity(item.id)}
              className="p-1.5 hover:bg-gray-200 text-mainText active:bg-gray-300 transition-colors"
              aria-label="Decrease quantity"
            >
              <Minus size={12} />
            </button>
            <span className="px-2.5 text-xs font-bold text-mainText min-w-[24px] text-center">
              {item.quantity}
            </span>
            <button
              onClick={() => incrementQuantity(item.id)}
              className="p-1.5 hover:bg-gray-200 text-mainText active:bg-gray-300 transition-colors"
              aria-label="Increase quantity"
            >
              <Plus size={12} />
            </button>
          </div>

          <span className="text-sm font-extrabold text-primary">
            {formatPrice(itemTotal)}
          </span>
        </div>
      </div>
    </div>
  );
}

export default CartItem;

