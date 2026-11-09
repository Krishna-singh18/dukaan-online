import React, { createContext, useState, useEffect, useMemo } from 'react';
import { useStore } from '../hooks/useStore';

export const CartContext = createContext(null);

const CART_STORAGE_KEY = 'dukaan_online_cart_v1';

export function CartProvider({ children }) {
  const { storeConfig } = useStore();

  // Initialize cart from localStorage safely
  const [items, setItems] = useState(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.error('Failed to load cart from localStorage', e);
    }
    return [];
  });

  const [isCartOpen, setIsCartOpen] = useState(false);

  // Sync cart to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.error('Failed to save cart to localStorage', e);
    }
  }, [items]);

  // Add item or increase quantity if already present
  const addToCart = (product, quantity = 1) => {
    if (!product || !product.id) return;
    
    setItems((prevItems) => {
      const existingIndex = prevItems.findIndex((item) => item.id === product.id);
      if (existingIndex > -1) {
        const updated = [...prevItems];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + quantity,
        };
        return updated;
      }
      return [...prevItems, { ...product, quantity }];
    });
  };

  // Remove single item completely
  const removeFromCart = (productId) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== productId));
  };

  // Update item quantity directly
  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === productId ? { ...item, quantity: Math.min(newQuantity, 99) } : item
      )
    );
  };

  // Increment item quantity by 1
  const incrementQuantity = (productId) => {
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === productId ? { ...item, quantity: Math.min(item.quantity + 1, 99) } : item
      )
    );
  };

  // Decrement item quantity by 1 (removes if reaches 0)
  const decrementQuantity = (productId) => {
    setItems((prevItems) =>
      prevItems
        .map((item) => {
          if (item.id === productId) {
            return { ...item, quantity: item.quantity - 1 };
          }
          return item;
        })
        .filter((item) => item.quantity > 0)
    );
  };

  // Clear all items from cart
  const clearCart = () => {
    setItems([]);
  };

  // Computed values
  const totalItemsCount = useMemo(() => {
    return items.reduce((sum, item) => sum + (item.quantity || 0), 0);
  }, [items]);

  const subtotal = useMemo(() => {
    return items.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 0), 0);
  }, [items]);

  const deliveryFee = useMemo(() => {
    if (subtotal === 0) return 0;
    const freeAbove = storeConfig?.delivery?.freeDeliveryAbove ?? 299;
    const fee = storeConfig?.delivery?.deliveryFee ?? 30;
    if (subtotal >= freeAbove) return 0;
    return fee;
  }, [subtotal, storeConfig]);

  const grandTotal = useMemo(() => {
    return subtotal + deliveryFee;
  }, [subtotal, deliveryFee]);

  const value = {
    items,
    addToCart,
    removeFromCart,
    updateQuantity,
    incrementQuantity,
    decrementQuantity,
    clearCart,
    totalItemsCount,
    subtotal,
    deliveryFee,
    grandTotal,
    isCartOpen,
    setIsCartOpen,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

