import React, { useState } from 'react';
import { Plus, Minus, Check, ChevronDown } from 'lucide-react';
import { useCart } from '../../hooks/useCart';
import { formatPrice, calculateDiscount } from '../../utils/formatPrice';

export function ProductCard({ product }) {
  const { items, addToCart, incrementQuantity, decrementQuantity } = useCart();
  const [imageError, setImageError] = useState(false);
  const [justAdded, setJustAdded] = useState(false);
  const [selectedVariantIdx, setSelectedVariantIdx] = useState(0);

  const hasVariants = Array.isArray(product.variants) && product.variants.length > 0;
  const currentVariant = hasVariants ? product.variants[selectedVariantIdx] : null;

  // Active pricing and unit
  const activeUnit = currentVariant ? currentVariant.unit : product.unit;
  const activePrice = currentVariant ? currentVariant.price : product.price;
  const activeOriginalPrice = currentVariant ? currentVariant.originalPrice : product.originalPrice;
  const activeItemId = currentVariant ? `${product.id}-${currentVariant.id || currentVariant.unit}` : product.id;

  // Check if active item or variant is in cart
  const cartItem = items.find((item) => item.id === activeItemId);
  const quantityInCart = cartItem ? cartItem.quantity : 0;

  // Check if any variant of this product is in cart
  const allVariantsInCart = items.filter((item) => item.productId === product.id || item.id === product.id);
  const totalInCartForProduct = allVariantsInCart.reduce((acc, curr) => acc + curr.quantity, 0);
  const showInCartLabel = quantityInCart > 0 || totalInCartForProduct > 0;
  const inCartCount = quantityInCart > 0 ? quantityInCart : totalInCartForProduct;

  const discountPercent = calculateDiscount(activeOriginalPrice, activePrice);

  const handleAdd = (e) => {
    e.stopPropagation();
    const itemToAdd = {
      id: activeItemId,
      productId: product.id,
      name: product.name,
      brand: product.brand,
      unit: activeUnit,
      price: activePrice,
      originalPrice: activeOriginalPrice,
      image: product.image,
    };
    addToCart(itemToAdd, 1);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1200);
  };

  const handleIncrement = (e) => {
    e.stopPropagation();
    incrementQuantity(activeItemId);
  };

  const handleDecrement = (e) => {
    e.stopPropagation();
    decrementQuantity(activeItemId);
  };

  return (
    <article className={`group bg-surface rounded-2xl border ${
      showInCartLabel ? 'border-primary/70 ring-1 ring-primary/20 shadow-xs' : 'border-gray-100/90 hover:border-emerald-200'
    } shadow-2xs hover:shadow-md transition-all duration-200 flex flex-col justify-between overflow-hidden relative`}>
      {/* Top Badges */}
      <div className="absolute top-2 left-2 z-10 flex flex-col gap-1 items-start">
        {discountPercent > 0 && (
          <span className="bg-accent text-white font-extrabold text-[9px] sm:text-[11px] px-1.5 sm:px-2 py-0.5 rounded shadow-2xs">
            {discountPercent}% OFF
          </span>
        )}
        {product.isFeatured && (
          <span className="bg-primary/95 text-white font-semibold text-[8px] sm:text-[10px] px-1.5 py-0.5 rounded backdrop-blur-xs">
            Taaza
          </span>
        )}
      </div>

      {/* Top Right In-Cart Label */}
      {showInCartLabel && (
        <div className="absolute top-2 right-2 z-10 animate-in fade-in zoom-in-95 duration-150">
          <span className="bg-primary text-white font-extrabold text-[9px] sm:text-[10px] px-2 py-0.5 rounded-full shadow-xs flex items-center gap-1 border border-white/20">
            <Check size={11} strokeWidth={3} />
            <span>{inCartCount} in Cart</span>
          </span>
        </div>
      )}

      {/* Product Image Container */}
      <div className="relative pt-[70%] sm:pt-[75%] bg-emerald-50/30 overflow-hidden">
        {imageError ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-50 text-secondaryText p-2 text-center">
            <span className="text-2xl mb-1">🛒</span>
            <span className="text-[10px] font-medium leading-tight">{product.name}</span>
          </div>
        ) : (
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            onError={() => setImageError(true)}
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        )}
      </div>

      {/* Product Details */}
      <div className="p-2.5 sm:p-3.5 flex-1 flex flex-col justify-between">
        <div>
          {/* Brand & Unit Badge */}
          <div className="flex items-center justify-between text-[11px] text-secondaryText mb-1 gap-1">
            <span className="font-medium text-emerald-800 line-clamp-1 truncate max-w-[65%]">
              {product.brand || 'Kirana Select'}
            </span>
            {!hasVariants && activeUnit && (
              <span className="bg-gray-100 text-gray-700 px-1.5 py-0.2 rounded text-[10px] font-semibold shrink-0">
                {activeUnit}
              </span>
            )}
          </div>

          {/* Product Title */}
          <h3
            className="font-semibold text-xs sm:text-sm text-mainText line-clamp-2 leading-snug group-hover:text-primary transition-colors mb-2"
            title={product.name}
          >
            {product.name}
          </h3>

          {/* Variants Pack Size Selector (e.g. 250g, 500g, 1kg) */}
          {hasVariants && (
            <div className="mb-2">
              <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-0.5">
                {product.variants.map((v, idx) => (
                  <button
                    key={v.id || idx}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedVariantIdx(idx);
                    }}
                    className={`px-2 py-0.5 text-[10px] sm:text-[11px] font-bold rounded-md transition-all shrink-0 border ${
                      selectedVariantIdx === idx
                        ? 'bg-primary text-white border-primary shadow-2xs'
                        : 'bg-background text-secondaryText border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {v.unit}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Pricing and Add to Cart Section */}
        <div className="mt-1.5 pt-1.5 border-t border-gray-100 flex items-center justify-between gap-1.5">
          {/* Price Block */}
          <div className="min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-baseline gap-0.5 sm:gap-1.5">
              <span className="font-extrabold text-xs sm:text-sm md:text-base text-mainText">
                {formatPrice(activePrice)}
              </span>
              {activeOriginalPrice && activeOriginalPrice > activePrice && (
                <span className="text-[10px] sm:text-xs text-gray-400 line-through">
                  {formatPrice(activeOriginalPrice)}
                </span>
              )}
            </div>
            {hasVariants && (
              <span className="text-[9px] text-gray-500 font-medium block">
                for {activeUnit}
              </span>
            )}
          </div>

          {/* Action Button: Add or Quantity Control */}
          <div className="shrink-0">
            {quantityInCart === 0 ? (
              <button
                onClick={handleAdd}
                className={`flex items-center justify-center gap-1 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-bold transition-all duration-150 active:scale-95 ${
                  justAdded
                    ? 'bg-emerald-600 text-white'
                    : 'bg-secondary text-primary hover:bg-primary hover:text-white border border-emerald-200'
                }`}
                aria-label={`Add ${product.name} to cart`}
              >
                {justAdded ? (
                  <>
                    <Check size={13} />
                    <span className="text-[11px] sm:text-xs">Added</span>
                  </>
                ) : (
                  <>
                    <Plus size={13} />
                    <span className="text-[11px] sm:text-xs">ADD</span>
                  </>
                )}
              </button>
            ) : (
              <div className="flex items-center bg-primary text-white rounded-xl overflow-hidden shadow-2xs">
                <button
                  onClick={handleDecrement}
                  className="p-1 sm:p-1.5 hover:bg-primary-dark active:bg-emerald-950 transition-colors"
                  aria-label="Decrease quantity"
                >
                  <Minus size={12} />
                </button>
                <span className="px-1.5 sm:px-2 font-bold text-xs sm:text-sm min-w-[18px] text-center">
                  {quantityInCart}
                </span>
                <button
                  onClick={handleIncrement}
                  className="p-1 sm:p-1.5 hover:bg-primary-dark active:bg-emerald-950 transition-colors"
                  aria-label="Increase quantity"
                >
                  <Plus size={12} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}

export default ProductCard;
