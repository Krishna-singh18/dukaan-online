import React, { useState, useEffect } from 'react';
import { useCart } from '../hooks/useCart';
import { useStore } from '../hooks/useStore';
import { CartItem } from '../components/cart/CartItem';
import { CartSummary } from '../components/cart/CartSummary';
import { Button } from '../components/common/Button';
import { formatPrice } from '../utils/formatPrice';
import { generateWhatsAppOrderUrl } from '../utils/whatsappOrder';
import {
  ArrowLeft,
  Trash2,
  ArrowRight,
  Truck,
  Store,
  User,
  Phone,
  MapPin,
  FileText,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  MessageCircle,
  PartyPopper,
  ShoppingBag,
  Clock,
  ShieldCheck
} from 'lucide-react';

const SAVED_CUSTOMER_KEY = 'dukaan_saved_customer_v1';

export function Cart({ onNavigate, initialStep = 'cart' }) {
  const { storeConfig, createOrder } = useStore();
  const {
    items,
    clearCart,
    totalItemsCount,
    subtotal,
    deliveryFee,
    grandTotal,
  } = useCart();

  // Current step: 'cart' | 'checkout' | 'confirmation' | 'success'
  const [step, setStep] = useState(initialStep);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    orderType: 'delivery', // 'delivery' | 'pickup'
    address: '',
    landmark: '',
    orderNote: '',
  });

  const [errors, setErrors] = useState({});
  const [dispatchedOrder, setDispatchedOrder] = useState(null);

  // Load saved customer information from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(SAVED_CUSTOMER_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setFormData((prev) => ({
          ...prev,
          name: parsed.name || '',
          phone: parsed.phone || '',
          address: parsed.address || '',
          landmark: parsed.landmark || '',
        }));
      }
    } catch (e) {
      console.error('Failed to load saved customer details', e);
    }
  }, []);

  // Update step if initialStep prop changes
  useEffect(() => {
    if (initialStep === 'checkout' && items.length > 0) {
      setStep('checkout');
    }
  }, [initialStep, items.length]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear field-specific error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleContinueShopping = () => {
    if (onNavigate) {
      onNavigate('shop');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Form Validation
  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim() || formData.name.trim().length < 2) {
      newErrors.name = 'Please enter your full name (at least 2 letters)';
    }

    // Indian phone number validation: 10 digits
    const cleanPhone = formData.phone.replace(/\D/g, '');
    if (!cleanPhone || cleanPhone.length < 10) {
      newErrors.phone = 'Please enter a valid 10-digit mobile number';
    }

    if (formData.orderType === 'delivery') {
      if (!formData.address.trim() || formData.address.trim().length < 5) {
        newErrors.address = 'Please enter complete house/flat number and street address';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle WhatsApp Order Placement
  const handlePlaceOrder = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Save customer info in localStorage for future convenience
    try {
      localStorage.setItem(
        SAVED_CUSTOMER_KEY,
        JSON.stringify({
          name: formData.name.trim(),
          phone: formData.phone.trim(),
          address: formData.address.trim(),
          landmark: formData.landmark.trim(),
        })
      );
    } catch (err) {
      console.error('Failed to persist customer details', err);
    }

    // Effective delivery fee based on order type
    const effectiveDeliveryFee = formData.orderType === 'pickup' ? 0 : deliveryFee;
    const finalTotal = subtotal + effectiveDeliveryFee;
    const prefix = (storeConfig.name?.replace(/[^a-zA-Z]/g, '').substring(0, 4) || 'DUK').toUpperCase();
    const randomOrderId = `${prefix}-${Math.floor(100000 + Math.random() * 900000)}`;

    const orderPayload = {
      orderId: randomOrderId,
      items: [...items],
      subtotal,
      deliveryFee: effectiveDeliveryFee,
      total: finalTotal,
      customer: {
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        address: formData.address.trim(),
        landmark: formData.landmark.trim(),
      },
      orderType: formData.orderType,
      orderNote: formData.orderNote.trim(),
      whatsappNumber: storeConfig.whatsappNumber,
      storeName: storeConfig.name,
    };

    // Generate WhatsApp URL
    const whatsappUrl = generateWhatsAppOrderUrl(orderPayload);

    // Save order in Cloud Database (Supabase) and local history
    if (createOrder) {
      createOrder(orderPayload);
    }

    // Save dispatched order details for the confirmation screen
    setDispatchedOrder({
      ...orderPayload,
      whatsappUrl,
      orderTime: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
      orderDate: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
    });

    // Reset shopping cart immediately after order placement
    clearCart();

    // Directly show Order Successful screen (simple, direct experience)
    setStep('success');
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Open WhatsApp in new tab
    window.open(whatsappUrl, '_blank');
  };

  // -------------------------------------------------------------
  // STEP 3: ORDER SUCCESSFUL CELEBRATION RECEIPT SCREEN
  // -------------------------------------------------------------
  if (step === 'success' && dispatchedOrder) {
    return (
      <div className="py-8 sm:py-16 bg-background min-h-[75vh]">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          <div className="bg-surface rounded-3xl p-6 sm:p-10 border border-emerald-200/80 shadow-lg text-center animate-in fade-in zoom-in-95 duration-300">
            
            {/* Animated Celebration Badge */}
            <div className="relative inline-block mb-4">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-tr from-emerald-500 to-green-400 text-white flex items-center justify-center mx-auto shadow-md">
                <CheckCircle2 size={46} className="text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-8 h-8 rounded-full bg-accent text-white flex items-center justify-center text-sm shadow">
                🎉
              </div>
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-2 border border-emerald-200">
              <PartyPopper size={13} className="text-primary" />
              <span>Order Placed Successfully!</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold text-mainText mb-2 tracking-tight">
              Thank You, {dispatchedOrder.customer.name}!
            </h1>

            <p className="text-xs sm:text-base text-secondaryText max-w-md mx-auto mb-6">
              Your grocery order has been successfully placed with <strong>{storeConfig.name}</strong>. The shop is packing your fresh essentials now!
            </p>

            {/* Items Summary Receipt Box */}
            <div className="bg-background rounded-2xl p-4 sm:p-6 text-left border border-gray-100 mb-6 space-y-3">
              <div className="flex justify-between items-center text-xs font-bold text-secondaryText border-b border-gray-200/70 pb-2">
                <span>Items Ordered ({dispatchedOrder.items.length})</span>
                <span>Amount</span>
              </div>

              <div className="space-y-2 text-xs divide-y divide-gray-100">
                {dispatchedOrder.items.map((item, idx) => (
                  <div key={idx} className="pt-2 first:pt-0 flex justify-between text-mainText">
                    <span className="line-clamp-1 pr-2">
                      {item.quantity}x {item.name} {item.unit ? `(${item.unit})` : ''}
                    </span>
                    <span className="font-semibold shrink-0">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-3 border-t border-gray-200/80 flex justify-between items-baseline font-bold text-sm sm:text-base text-mainText">
                <span>Total Bill to Pay:</span>
                <span className="text-primary font-extrabold text-base sm:text-lg">
                  {formatPrice(dispatchedOrder.total)}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button
                variant="primary"
                size="md"
                onClick={handleContinueShopping}
                rightIcon={<ArrowRight size={16} />}
                className="w-full sm:w-auto font-bold"
              >
                Order More Groceries
              </Button>
              <button
                onClick={() => {
                  if (onNavigate) {
                    onNavigate('home');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }
                }}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gray-100 text-mainText text-xs sm:text-sm font-semibold hover:bg-gray-200 transition-colors"
              >
                Back to Store Home
              </button>
            </div>

          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // EMPTY CART STATE (for Cart / Checkout)
  // -------------------------------------------------------------
  if (totalItemsCount === 0) {
    return (
      <div className="py-14 sm:py-24 bg-background min-h-[65vh] flex items-center justify-center">
        <div className="max-w-md w-full mx-auto px-4 text-center">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-secondary/80 flex items-center justify-center text-3xl sm:text-4xl mx-auto mb-4">
            🛒
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-mainText mb-2">
            Your Shopping Cart is Empty
          </h2>
          <p className="text-xs sm:text-sm text-secondaryText mb-6 leading-relaxed">
            You don't have any daily groceries, pulses, or essentials in your cart yet. Explore our fresh collection and start adding items!
          </p>
          <Button
            variant="primary"
            size="md"
            onClick={handleContinueShopping}
            rightIcon={<ArrowRight size={17} />}
            className="w-full sm:w-auto"
          >
            Explore Kirana Products
          </Button>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // STEP 2: CHECKOUT FORM & FINAL REVIEW
  // -------------------------------------------------------------
  if (step === 'checkout') {
    const isPickup = formData.orderType === 'pickup';
    const effectiveDeliveryFee = isPickup ? 0 : deliveryFee;
    const finalTotal = subtotal + effectiveDeliveryFee;

    return (
      <div className="py-6 sm:py-12 bg-background min-h-[70vh]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Breadcrumb / Back Navigation */}
          <div className="mb-4 sm:mb-6">
            <button
              onClick={() => setStep('cart')}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-secondaryText hover:text-primary transition-colors mb-2"
            >
              <ArrowLeft size={14} />
              <span>Back to Cart Review</span>
            </button>
            <h1 className="text-xl sm:text-3xl font-extrabold text-mainText tracking-tight">
              Customer Details &amp; WhatsApp Checkout
            </h1>
            <p className="text-xs sm:text-sm text-secondaryText mt-1">
              Please enter your details. When you click "Place Order on WhatsApp", your grocery list will open in WhatsApp ready to send.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
            
            {/* Left Column: Form Fields */}
            <div className="lg:col-span-7 bg-surface rounded-2xl p-4 sm:p-7 border border-gray-100 shadow-2xs">
              <form onSubmit={handlePlaceOrder} className="space-y-4 sm:space-y-5">
                
                {/* 1. Delivery vs Pickup Toggle */}
                <div>
                  <label className="block text-xs font-bold text-mainText uppercase tracking-wider mb-2">
                    Order Delivery Preference *
                  </label>
                  <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
                    <button
                      type="button"
                      onClick={() => setFormData((prev) => ({ ...prev, orderType: 'delivery' }))}
                      className={`p-3 rounded-xl border flex items-center justify-center gap-2 text-xs sm:text-sm font-bold transition-all ${
                        formData.orderType === 'delivery'
                          ? 'border-primary bg-secondary/80 text-primary shadow-xs'
                          : 'border-gray-200 bg-background text-secondaryText hover:border-gray-300'
                      }`}
                    >
                      <Truck size={17} />
                      <span>Home Delivery</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setFormData((prev) => ({ ...prev, orderType: 'pickup' }))}
                      className={`p-3 rounded-xl border flex items-center justify-center gap-2 text-xs sm:text-sm font-bold transition-all ${
                        formData.orderType === 'pickup'
                          ? 'border-primary bg-secondary/80 text-primary shadow-xs'
                          : 'border-gray-200 bg-background text-secondaryText hover:border-gray-300'
                      }`}
                    >
                      <Store size={17} />
                      <span>Store Pickup</span>
                    </button>
                  </div>
                </div>

                {/* 2. Customer Name */}
                <div>
                  <label htmlFor="customer-name" className="block text-xs font-bold text-mainText mb-1 flex items-center gap-1.5">
                    <User size={13} className="text-secondaryText" />
                    <span>Your Full Name *</span>
                  </label>
                  <input
                    id="customer-name"
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="e.g. Rahul Sharma"
                    className={`w-full px-3.5 py-2.5 rounded-xl text-base sm:text-sm bg-background border focus:outline-none focus:ring-2 transition-all ${
                      errors.name
                        ? 'border-red-400 focus:ring-red-100 focus:border-red-500'
                        : 'border-gray-200 focus:ring-primary/20 focus:border-primary'
                    }`}
                  />
                  {errors.name && (
                    <p className="text-red-500 text-xs mt-1 font-medium">{errors.name}</p>
                  )}
                </div>

                {/* 3. Mobile Number */}
                <div>
                  <label htmlFor="customer-phone" className="block text-xs font-bold text-mainText mb-1 flex items-center gap-1.5">
                    <Phone size={13} className="text-secondaryText" />
                    <span>Mobile / WhatsApp Number *</span>
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-xs font-bold text-gray-500">
                      +91
                    </span>
                    <input
                      id="customer-phone"
                      type="tel"
                      name="phone"
                      maxLength={10}
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="9876543210"
                      className={`w-full pl-12 pr-3.5 py-2.5 rounded-xl text-base sm:text-sm bg-background border focus:outline-none focus:ring-2 transition-all ${
                        errors.phone
                          ? 'border-red-400 focus:ring-red-100 focus:border-red-500'
                          : 'border-gray-200 focus:ring-primary/20 focus:border-primary'
                      }`}
                    />
                  </div>
                  {errors.phone && (
                    <p className="text-red-500 text-xs mt-1 font-medium">{errors.phone}</p>
                  )}
                </div>

                {/* 4. Delivery Address & Landmark (if Home Delivery) */}
                {formData.orderType === 'delivery' && (
                  <>
                    <div>
                      <label htmlFor="customer-address" className="block text-xs font-bold text-mainText mb-1 flex items-center gap-1.5">
                        <MapPin size={13} className="text-secondaryText" />
                        <span>Delivery Address (House/Flat, Street &amp; Colony) *</span>
                      </label>
                      <textarea
                        id="customer-address"
                        name="address"
                        rows={2}
                        value={formData.address}
                        onChange={handleInputChange}
                        placeholder="e.g. Flat 302, Shanti Apartments, Sector 15"
                        className={`w-full px-3.5 py-2.5 rounded-xl text-base sm:text-sm bg-background border focus:outline-none focus:ring-2 transition-all ${
                          errors.address
                            ? 'border-red-400 focus:ring-red-100 focus:border-red-500'
                            : 'border-gray-200 focus:ring-primary/20 focus:border-primary'
                        }`}
                      />
                      {errors.address && (
                        <p className="text-red-500 text-xs mt-1 font-medium">{errors.address}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="customer-landmark" className="block text-xs font-bold text-mainText mb-1">
                        Nearby Landmark (Optional)
                      </label>
                      <input
                        id="customer-landmark"
                        type="text"
                        name="landmark"
                        value={formData.landmark}
                        onChange={handleInputChange}
                        placeholder="e.g. Near Hanuman Mandir / Mother Dairy"
                        className="w-full px-3.5 py-2.5 rounded-xl text-base sm:text-sm bg-background border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                      />
                    </div>
                  </>
                )}

                {/* 5. Optional Order Note */}
                <div>
                  <label htmlFor="customer-note" className="block text-xs font-bold text-mainText mb-1 flex items-center gap-1.5">
                    <FileText size={13} className="text-secondaryText" />
                    <span>Special Instructions / Note (Optional)</span>
                  </label>
                  <input
                    id="customer-note"
                    type="text"
                    name="orderNote"
                    value={formData.orderNote}
                    onChange={handleInputChange}
                    placeholder="e.g. Please bring change of ₹500, or ring the bell twice"
                    className="w-full px-3.5 py-2.5 rounded-xl text-base sm:text-sm bg-background border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  />
                </div>

                {/* Submit Action */}
                <div className="pt-3 border-t border-gray-100">
                  <button
                    type="submit"
                    className="w-full py-3.5 px-5 rounded-xl bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold text-sm sm:text-base shadow-md hover:shadow-lg transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                  >
                    <MessageCircle size={20} />
                    <span>Place Order on WhatsApp ({formatPrice(finalTotal)})</span>
                  </button>
                  <p className="text-[11px] text-center text-secondaryText mt-2">
                    🔒 No advance payment needed. Pay cash or UPI on delivery directly to {storeConfig.name}.
                  </p>
                </div>

              </form>
            </div>

            {/* Right Column: Final Order Summary Card */}
            <div className="lg:col-span-5 sticky top-24 space-y-4">
              <div className="bg-surface rounded-2xl p-4 sm:p-5 border border-gray-100 shadow-2xs">
                <h3 className="font-bold text-sm sm:text-base text-mainText mb-3 flex items-center justify-between">
                  <span>Order Items ({totalItemsCount})</span>
                  <button
                    onClick={() => setStep('cart')}
                    className="text-xs text-primary font-semibold hover:underline"
                  >
                    Edit Items
                  </button>
                </h3>

                {/* Scrollable Items Mini-List */}
                <div className="max-h-56 overflow-y-auto space-y-2 pr-1 divide-y divide-gray-100">
                  {items.map((item) => (
                    <div key={item.id} className="pt-2 first:pt-0 flex items-center justify-between text-xs">
                      <div className="pr-2">
                        <span className="font-semibold text-mainText block line-clamp-1">{item.name}</span>
                        <span className="text-secondaryText text-[11px]">{item.quantity} x {formatPrice(item.price)}</span>
                      </div>
                      <span className="font-bold text-mainText shrink-0">{formatPrice(item.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>

                {/* Summary Totals */}
                <div className="pt-3 mt-3 border-t border-gray-200/80 space-y-2 text-xs text-secondaryText">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span className="font-semibold text-mainText">{formatPrice(subtotal)}</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Delivery Charge:</span>
                    <span className="font-semibold text-mainText">
                      {isPickup ? (
                        <span className="text-primary font-bold">₹0 (Store Pickup)</span>
                      ) : effectiveDeliveryFee === 0 ? (
                        <span className="text-primary font-bold">FREE</span>
                      ) : (
                        formatPrice(effectiveDeliveryFee)
                      )}
                    </span>
                  </div>

                  <div className="pt-2 border-t border-gray-100 flex justify-between text-base font-extrabold text-mainText">
                    <span>Final Amount:</span>
                    <span className="text-primary">{formatPrice(finalTotal)}</span>
                  </div>
                </div>

                {/* Shop Location Reminder */}
                <div className="mt-4 pt-3 border-t border-gray-100 text-[11px] text-secondaryText flex items-start gap-2">
                  <MapPin size={14} className="text-primary shrink-0 mt-0.5" />
                  <span>Delivering from: <strong>{storeConfig.name}</strong>, {storeConfig.address.area}</span>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // STEP 1: CART ITEMS REVIEW
  // -------------------------------------------------------------
  return (
    <div className="py-6 sm:py-12 bg-background min-h-[70vh]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Heading */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 mb-5 sm:mb-6">
          <div>
            <button
              onClick={handleContinueShopping}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-secondaryText hover:text-primary mb-1.5 transition-colors"
            >
              <ArrowLeft size={14} />
              <span>Continue Shopping</span>
            </button>
            <h1 className="text-xl sm:text-3xl font-extrabold text-mainText tracking-tight">
              My Shopping Cart ({totalItemsCount} {totalItemsCount === 1 ? 'item' : 'items'})
            </h1>
          </div>

          <button
            onClick={clearCart}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-red-600 hover:text-red-700 hover:bg-red-50 px-2.5 py-1.5 rounded-xl transition-colors self-start sm:self-auto"
          >
            <Trash2 size={13} />
            <span>Clear Cart</span>
          </button>
        </div>

        {/* 2-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          
          {/* Left Column: Cart Items List */}
          <div className="lg:col-span-7 space-y-3">
            {items.map((item) => (
              <CartItem key={item.id} item={item} />
            ))}

            <div className="pt-3">
              <Button
                variant="outline"
                size="sm"
                onClick={handleContinueShopping}
                leftIcon={<ArrowLeft size={14} />}
              >
                Add More Grocery Items
              </Button>
            </div>
          </div>

          {/* Right Column: Order Summary Card */}
          <div className="lg:col-span-5 sticky top-24">
            <h3 className="text-sm sm:text-base font-bold text-mainText mb-2.5">
              Order Summary
            </h3>
            <CartSummary
              showCheckoutButton={true}
              onCheckout={() => setStep('checkout')}
            />
          </div>

        </div>

      </div>
    </div>
  );
}

export default Cart;
