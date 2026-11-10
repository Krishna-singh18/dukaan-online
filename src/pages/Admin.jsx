import React, { useState, useEffect } from 'react';
import { useStore } from '../hooks/useStore';
import { formatPrice } from '../utils/formatPrice';
import { supabaseSetupSql } from '../data/supabaseSetupSql';
import {
  Package,
  Truck,
  Settings,
  Tag,
  Plus,
  Edit2,
  Trash2,
  Save,
  RotateCcw,
  CheckCircle2,
  X,
  Search,
  ExternalLink,
  Store,
  Layers,
  ArrowLeft,
  Lock,
  Unlock,
  KeyRound,
  Eye,
  EyeOff,
  LogOut,
  AlertCircle,
  BookOpen,
  Sparkles,
  ShoppingBag,
  Database,
  RefreshCw,
  PhoneCall,
  Check,
  ShieldCheck,
  ShieldAlert,
  Clock,
  Mail,
  UserCheck
} from 'lucide-react';

export function Admin({ onNavigate }) {
  const {
    isCloudConnected,
    fetchCloudData,
    currentUser,
    authLoading,
    loginShopkeeper,
    logoutShopkeeper,
    updateShopkeeperPassword,
    storeConfig,
    updateStoreConfig,
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    categories,
    addCategory,
    updateCategory,
    deleteCategory,
    offerSettings,
    updateOfferSettings,
    aboutSettings,
    updateAboutSettings,
    orders = [],
    updateOrderStatus,
    resetToDefaultData
  } = useStore();

  const [showDbModal, setShowDbModal] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);

  // Dynamic Supabase Project ID from environment (no hardcoded project ids)
  const supabaseProjectId = (import.meta.env.VITE_SUPABASE_URL || '').match(/https:\/\/([^.]+)\.supabase\.co/)?.[1] || 'supabase-cloud';

  // 1. Supabase Authentication Form State
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authSubmitting, setAuthSubmitting] = useState(false);
  const [authError, setAuthError] = useState('');

  // Security: Brute-force rate limiting & lockout
  const [failedAttempts, setFailedAttempts] = useState(() => {
    try {
      return Number(sessionStorage.getItem('dukaan_login_failed_attempts') || 0);
    } catch (e) {
      return 0;
    }
  });

  const [lockoutUntil, setLockoutUntil] = useState(() => {
    try {
      const saved = sessionStorage.getItem('dukaan_login_lockout_until');
      return saved ? Number(saved) : 0;
    } catch (e) {
      return 0;
    }
  });

  const [lockoutRemainingSeconds, setLockoutRemainingSeconds] = useState(0);

  // Countdown timer for lockout
  useEffect(() => {
    if (!lockoutUntil) {
      setLockoutRemainingSeconds(0);
      return;
    }

    const checkLockout = () => {
      const diff = Math.ceil((lockoutUntil - Date.now()) / 1000);
      if (diff <= 0) {
        setLockoutUntil(0);
        setLockoutRemainingSeconds(0);
        try {
          sessionStorage.removeItem('dukaan_login_lockout_until');
          sessionStorage.removeItem('dukaan_login_failed_attempts');
        } catch (e) {}
        setFailedAttempts(0);
        if (authError) setAuthError('');
      } else {
        setLockoutRemainingSeconds(diff);
      }
    };

    checkLockout();
    const interval = setInterval(checkLockout, 1000);
    return () => clearInterval(interval);
  }, [lockoutUntil, authError]);

  // Session Security: Inactivity timeout (auto logout after 60 mins)
  useEffect(() => {
    if (!currentUser) return;

    let timeout;
    const resetTimer = () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        logoutShopkeeper?.();
        alert('Your shopkeeper session has expired due to 60 minutes of inactivity for security.');
      }, 60 * 60 * 1000);
    };

    const events = ['mousedown', 'mousemove', 'keydown', 'scroll', 'touchstart'];
    events.forEach((ev) => window.addEventListener(ev, resetTimer, { passive: true }));
    resetTimer();

    return () => {
      clearTimeout(timeout);
      events.forEach((ev) => window.removeEventListener(ev, resetTimer));
    };
  }, [currentUser, logoutShopkeeper]);

  // Password change state inside Store tab (Server-side Supabase Auth)
  const [newStorePassword, setNewStorePassword] = useState('');
  const [confirmStorePassword, setConfirmStorePassword] = useState('');
  const [passwordChangeMsg, setPasswordChangeMsg] = useState('');

  // 2. Dashboard Navigation & UI State
  const [activeTab, setActiveTab] = useState('products'); // 'products' | 'delivery' | 'store' | 'offers'
  const [productSearch, setProductSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [saveToast, setSaveToast] = useState('');

  // 3. Edit / Add Product Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState(null);
  const [hasVariants, setHasVariants] = useState(false);

  // 3.1 Edit / Add Category Modal State
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState(null);
  const initialCategoryForm = {
    id: '',
    name: '',
    hindiName: '',
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=400&q=80',
    icon: '🛒',
    description: '',
  };
  const [categoryForm, setCategoryForm] = useState(initialCategoryForm);

  const initialProductForm = {
    name: '',
    hindiName: '',
    brand: '',
    category: (categories && categories[0]?.id) || 'atta-rice',
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=500&q=80',
    description: '',
    unit: '1 kg',
    price: 100,
    originalPrice: 120,
    inStock: true,
    isFeatured: false,
    isBestOffer: false,
    variants: [
      { id: 'v1', unit: '250 g', price: 28, originalPrice: 32 },
      { id: 'v2', unit: '500 g', price: 52, originalPrice: 60 },
      { id: 'v3', unit: '1 kg', price: 100, originalPrice: 120 },
    ]
  };

  const [productForm, setProductForm] = useState(initialProductForm);

  // 4. Store Config Forms (safely guarded with fallbacks)
  const [storeForm, setStoreForm] = useState(() => ({
    name: storeConfig?.name || '',
    ownerName: storeConfig?.ownerName || '',
    whatsappNumber: storeConfig?.whatsappNumber || '',
    displayPhone: storeConfig?.displayPhone || '',
    fullAddress: storeConfig?.address?.fullAddress || '',
    area: storeConfig?.address?.area || '',
    city: storeConfig?.address?.city || '',
    mapsUrl: storeConfig?.address?.mapsUrl || '',
    timing: storeConfig?.openingHours?.timing || '',
    days: storeConfig?.openingHours?.days || '',
  }));

  const [deliveryForm, setDeliveryForm] = useState(() => ({
    freeDeliveryAbove: storeConfig?.delivery?.freeDeliveryAbove ?? 299,
    deliveryFee: storeConfig?.delivery?.deliveryFee ?? 30,
    minOrderAmount: storeConfig?.delivery?.minOrderAmount ?? 99,
    estimatedTime: storeConfig?.delivery?.estimatedTime || '30 - 45 Mins',
    deliveryRadius: storeConfig?.delivery?.deliveryRadius || 'Within 4 km radius',
    deliveryAreas: Array.isArray(storeConfig?.delivery?.deliveryAreas) ? [...storeConfig.delivery.deliveryAreas] : [],
  }));

  const [newAreaInput, setNewAreaInput] = useState('');

  const [offerForm, setOfferForm] = useState(() => ({
    badge: offerSettings?.badge || '',
    title: offerSettings?.title || '',
    subtitle: offerSettings?.subtitle || '',
    discountText: offerSettings?.discountText || '',
  }));

  const [aboutForm, setAboutForm] = useState(() => ({
    heroTitle: aboutSettings?.heroTitle || "Serving Our Neighborhood with Trust & Purity",
    heroSubtitle: aboutSettings?.heroSubtitle || "Dedicated to bringing traditional Kirana values into the digital era — fresh staples, fair rates, and direct convenience.",
    storyBadge: aboutSettings?.storyBadge || "Our Heritage",
    storyTitle: aboutSettings?.storyTitle || "Bringing the Best Grocery Staples to Every Household",
    storyParagraph1: aboutSettings?.storyParagraph1 || "For years, local Kirana stores have been the heartbeat of Indian neighborhoods. We know your family's favorite tea, which atta makes the softest chapatis, and how important purity is when buying dal and mustard oil.",
    storyParagraph2: aboutSettings?.storyParagraph2 || "We make it effortless for you to order your daily groceries directly online without complex checkout forms. We prepare your order with care and deliver it straight to your doorstep.",
    storyImage: aboutSettings?.storyImage || "https://images.unsplash.com/photo-1604719312566-8912e9227c6a?auto=format&fit=crop&w=800&q=80",
    stat1: aboutSettings?.stat1 || "2,000+ Happy Families",
    stat2: aboutSettings?.stat2 || "100% Genuine Quality",
  }));

  // Sync state if storeConfig arrives or updates from Cloud
  useEffect(() => {
    if (storeConfig) {
      setStoreForm({
        name: storeConfig.name || '',
        ownerName: storeConfig.ownerName || '',
        whatsappNumber: storeConfig.whatsappNumber || '',
        displayPhone: storeConfig.displayPhone || '',
        fullAddress: storeConfig.address?.fullAddress || '',
        area: storeConfig.address?.area || '',
        city: storeConfig.address?.city || '',
        mapsUrl: storeConfig.address?.mapsUrl || '',
        timing: storeConfig.openingHours?.timing || '',
        days: storeConfig.openingHours?.days || '',
      });
      if (storeConfig.delivery) {
        setDeliveryForm({
          freeDeliveryAbove: storeConfig.delivery.freeDeliveryAbove ?? 299,
          deliveryFee: storeConfig.delivery.deliveryFee ?? 30,
          minOrderAmount: storeConfig.delivery.minOrderAmount ?? 99,
          estimatedTime: storeConfig.delivery.estimatedTime || '30 - 45 Mins',
          deliveryRadius: storeConfig.delivery.deliveryRadius || 'Within 4 km radius',
          deliveryAreas: Array.isArray(storeConfig.delivery.deliveryAreas) ? [...storeConfig.delivery.deliveryAreas] : [],
        });
      }
    }
  }, [storeConfig]);

  useEffect(() => {
    if (offerSettings) {
      setOfferForm({
        badge: offerSettings.badge || '',
        title: offerSettings.title || '',
        subtitle: offerSettings.subtitle || '',
        discountText: offerSettings.discountText || '',
      });
    }
  }, [offerSettings]);

  useEffect(() => {
    if (aboutSettings) {
      setAboutForm({
        heroTitle: aboutSettings.heroTitle || "Serving Our Neighborhood with Trust & Purity",
        heroSubtitle: aboutSettings.heroSubtitle || "Dedicated to bringing traditional Kirana values into the digital era — fresh staples, fair rates, and direct convenience.",
        storyBadge: aboutSettings.storyBadge || "Our Heritage",
        storyTitle: aboutSettings.storyTitle || "Bringing the Best Grocery Staples to Every Household",
        storyParagraph1: aboutSettings.storyParagraph1 || "For years, local Kirana stores have been the heartbeat of Indian neighborhoods. We know your family's favorite tea, which atta makes the softest chapatis, and how important purity is when buying dal and mustard oil.",
        storyParagraph2: aboutSettings.storyParagraph2 || "We make it effortless for you to order your daily groceries directly online without complex checkout forms. We prepare your order with care and deliver it straight to your doorstep.",
        storyImage: aboutSettings.storyImage || "https://images.unsplash.com/photo-1604719312566-8912e9227c6a?auto=format&fit=crop&w=800&q=80",
        stat1: aboutSettings.stat1 || "2,000+ Happy Families",
        stat2: aboutSettings.stat2 || "100% Genuine Quality",
      });
    }
  }, [aboutSettings]);

  const triggerToast = (msg) => {
    setSaveToast(msg);
    setTimeout(() => setSaveToast(''), 3000);
  };

  // 5. Official Supabase Auth Handlers (Bank-Grade Secure Login)
  const handleAuthSubmit = async (e) => {
    e.preventDefault();

    if (lockoutRemainingSeconds > 0) {
      setAuthError(`Security lockout in effect. Please wait ${lockoutRemainingSeconds}s.`);
      return;
    }

    if (!emailInput.trim() || !passwordInput.trim()) {
      setAuthError('Please enter both shopkeeper email and password.');
      return;
    }

    setAuthSubmitting(true);
    setAuthError('');

    try {
      await loginShopkeeper(emailInput, passwordInput);
      setFailedAttempts(0);
      setLockoutUntil(0);
      try {
        sessionStorage.removeItem('dukaan_login_failed_attempts');
        sessionStorage.removeItem('dukaan_login_lockout_until');
      } catch (err) {}
      triggerToast('Authenticated successfully! Welcome Shopkeeper.');
    } catch (err) {
      console.error('Auth error:', err);
      const nextFailed = failedAttempts + 1;
      setFailedAttempts(nextFailed);
      try {
        sessionStorage.setItem('dukaan_login_failed_attempts', nextFailed.toString());
      } catch (e) {}

      if (nextFailed >= 4) {
        const lockoutTime = Date.now() + 180 * 1000;
        setLockoutUntil(lockoutTime);
        try {
          sessionStorage.setItem('dukaan_login_lockout_until', lockoutTime.toString());
        } catch (e) {}
        setAuthError('Too many failed attempts! Locked for 3 minutes for security.');
      } else {
        const remaining = 4 - nextFailed;
        const msg = err.message || '';
        if (msg.toLowerCase().includes('email not confirmed')) {
          setAuthError('Email not confirmed in Supabase yet. Please run the SQL confirmation command in Supabase.');
        } else {
          setAuthError(msg || `Authentication failed. (${remaining} attempt${remaining === 1 ? '' : 's'} remaining)`);
        }
      }
    } finally {
      setAuthSubmitting(false);
    }
  };

  const handleLogout = async () => {
    await logoutShopkeeper?.();
    triggerToast('Logged out securely.');
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();

    if (!newStorePassword.trim() || newStorePassword.trim().length < 6) {
      setPasswordChangeMsg('Password must be at least 6 characters long.');
      return;
    }
    if (newStorePassword.trim() !== confirmStorePassword.trim()) {
      setPasswordChangeMsg('New password and Confirm password do not match.');
      return;
    }

    try {
      await updateShopkeeperPassword(newStorePassword.trim());
      setNewStorePassword('');
      setConfirmStorePassword('');
      setPasswordChangeMsg('Password updated successfully on Supabase Auth server!');
      triggerToast('Shopkeeper password updated!');
      setTimeout(() => setPasswordChangeMsg(''), 5000);
    } catch (err) {
      setPasswordChangeMsg(err.message || 'Failed to update password.');
    }
  };

  // Open Add Product Modal
  const handleOpenAddModal = () => {
    setEditingProductId(null);
    setProductForm(initialProductForm);
    setHasVariants(false);
    setIsModalOpen(true);
  };

  // Open Edit Product Modal
  const handleOpenEditModal = (product) => {
    setEditingProductId(product.id);
    const productHasVariants = Array.isArray(product.variants) && product.variants.length > 0;
    setHasVariants(productHasVariants);
    setProductForm({
      ...product,
      variants: productHasVariants ? product.variants : initialProductForm.variants
    });
    setIsModalOpen(true);
  };

  // Save Product (Add or Edit)
  const handleSaveProduct = (e) => {
    e.preventDefault();
    if (!productForm.name.trim()) return;

    const payload = {
      ...productForm,
      price: Number(productForm.price),
      originalPrice: Number(productForm.originalPrice),
      variants: hasVariants ? productForm.variants.map((v, i) => ({
        id: v.id || `v-${Date.now()}-${i}`,
        unit: v.unit,
        price: Number(v.price),
        originalPrice: Number(v.originalPrice || v.price)
      })) : undefined
    };

    if (editingProductId) {
      updateProduct(editingProductId, payload);
      triggerToast('Product updated successfully!');
    } else {
      addProduct(payload);
      triggerToast('New product added to catalog!');
    }

    setIsModalOpen(false);
  };

  // Variants management in form
  const handleVariantChange = (index, field, value) => {
    const updated = [...productForm.variants];
    updated[index] = { ...updated[index], [field]: value };
    setProductForm((prev) => ({ ...prev, variants: updated }));
  };

  const handleAddVariantRow = () => {
    setProductForm((prev) => ({
      ...prev,
      variants: [
        ...prev.variants,
        { id: `v-${Date.now()}`, unit: '1 kg', price: 100, originalPrice: 120 }
      ]
    }));
  };

  const handleRemoveVariantRow = (index) => {
    setProductForm((prev) => ({
      ...prev,
      variants: prev.variants.filter((_, i) => i !== index)
    }));
  };

  // Category Modal Handlers
  const handleOpenAddCategoryModal = () => {
    setEditingCategoryId(null);
    setCategoryForm(initialCategoryForm);
    setIsCategoryModalOpen(true);
  };

  const handleOpenEditCategoryModal = (cat) => {
    setEditingCategoryId(cat.id);
    setCategoryForm({
      id: cat.id,
      name: cat.name || '',
      hindiName: cat.hindiName || '',
      image: cat.image || '',
      icon: cat.icon || '🛍️',
      description: cat.description || '',
    });
    setIsCategoryModalOpen(true);
  };

  const handleSaveCategory = (e) => {
    e.preventDefault();
    if (!categoryForm.name.trim()) return;

    if (editingCategoryId) {
      updateCategory(editingCategoryId, categoryForm);
      triggerToast(`Category "${categoryForm.name}" updated!`);
    } else {
      const generatedId = categoryForm.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || `cat-${Date.now()}`;
      addCategory({ ...categoryForm, id: generatedId });
      triggerToast(`New category "${categoryForm.name}" added!`);
    }
    setIsCategoryModalOpen(false);
  };

  const handleDeleteCategory = (cat) => {
    const productsInCat = products.filter((p) => p.category === cat.id).length;
    if (productsInCat > 0) {
      if (!window.confirm(`Notice: ${productsInCat} products belong to "${cat.name}". Are you sure you want to delete this category?`)) {
        return;
      }
    } else {
      if (!window.confirm(`Are you sure you want to delete category "${cat.name}"?`)) {
        return;
      }
    }
    deleteCategory(cat.id);
    triggerToast(`Category "${cat.name}" deleted.`);
  };

  // Save Delivery Config
  const handleSaveDelivery = (e) => {
    e.preventDefault();
    updateStoreConfig({
      delivery: {
        ...storeConfig.delivery,
        freeDeliveryAbove: Number(deliveryForm.freeDeliveryAbove),
        deliveryFee: Number(deliveryForm.deliveryFee),
        minOrderAmount: Number(deliveryForm.minOrderAmount),
        estimatedTime: deliveryForm.estimatedTime,
        deliveryRadius: deliveryForm.deliveryRadius,
        deliveryAreas: deliveryForm.deliveryAreas,
      }
    });
    triggerToast('Delivery rates and limits updated!');
  };

  // Add Delivery Area
  const handleAddArea = () => {
    if (!newAreaInput.trim()) return;
    if (deliveryForm.deliveryAreas.includes(newAreaInput.trim())) return;
    setDeliveryForm((prev) => ({
      ...prev,
      deliveryAreas: [...prev.deliveryAreas, newAreaInput.trim()]
    }));
    setNewAreaInput('');
  };

  const handleRemoveArea = (areaToRemove) => {
    setDeliveryForm((prev) => ({
      ...prev,
      deliveryAreas: prev.deliveryAreas.filter((a) => a !== areaToRemove)
    }));
  };

  // Save Store Details
  const handleSaveStore = (e) => {
    e.preventDefault();
    const cleanMapsUrl = storeForm.mapsUrl?.trim() || `https://maps.google.com/?q=${encodeURIComponent(storeForm.fullAddress || storeForm.name)}`;

    updateStoreConfig({
      name: storeForm.name,
      ownerName: storeForm.ownerName,
      whatsappNumber: storeForm.whatsappNumber,
      displayPhone: storeForm.displayPhone,
      address: {
        ...storeConfig.address,
        fullAddress: storeForm.fullAddress,
        area: storeForm.area,
        city: storeForm.city,
        mapsUrl: cleanMapsUrl,
      },
      openingHours: {
        ...storeConfig.openingHours,
        timing: storeForm.timing,
        days: storeForm.days,
      }
    });
    triggerToast('Store identity, address & Google Maps link saved!');
  };

  // Save Offers
  const handleSaveOffers = (e) => {
    e.preventDefault();
    updateOfferSettings(offerForm);
    triggerToast('Promotional offer banner updated!');
  };

  // Save About Details
  const handleSaveAbout = (e) => {
    e.preventDefault();
    updateAboutSettings(aboutForm);
    triggerToast('About page story and showcase details saved!');
  };

  // Filtered products list
  const filteredProducts = products.filter((p) => {
    const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
    const matchesSearch =
      p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
      (p.brand && p.brand.toLowerCase().includes(productSearch.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  // =========================================================================
  // VIEW 1: SHOPKEEPER / ADMIN AUTHENTICATION SCREEN (When not logged in)
  // =========================================================================
  if (authLoading) {
    return (
      <div className="py-20 bg-background min-h-[85vh] flex items-center justify-center px-4">
        <div className="text-center p-8 bg-surface rounded-3xl border border-gray-100 shadow-lg">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm font-bold text-mainText">Checking secure shopkeeper session...</p>
          <p className="text-xs text-secondaryText mt-1">Connecting to Supabase Cloud</p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    const isLockedOut = lockoutRemainingSeconds > 0;

    return (
      <div className="py-12 sm:py-20 bg-background min-h-[85vh] flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-surface rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-xl text-center animate-in zoom-in-95 duration-200">
          
          {/* Logo / Lock Icon */}
          <div className="w-16 h-16 rounded-2xl bg-secondary mx-auto flex items-center justify-center text-primary mb-4 shadow-2xs relative">
            {isLockedOut ? <ShieldAlert size={30} className="text-red-500" /> : <ShieldCheck size={30} />}
            <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center text-[10px] text-white font-bold">
              ✓
            </span>
          </div>

          <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
            Official Supabase Cloud Security
          </span>

          <h2 className="text-xl sm:text-2xl font-extrabold text-mainText mt-3 tracking-tight">
            Shopkeeper Access Portal
          </h2>
          <p className="text-xs sm:text-sm text-secondaryText mt-1 mb-6">
            Sign in with your shopkeeper credentials to manage store catalog, prices, and orders.
          </p>

          <form onSubmit={handleAuthSubmit} className="space-y-4 text-left">
            <div>
              <label className="block text-xs font-bold text-mainText mb-1.5 flex items-center justify-between">
                <span>Shopkeeper Email *</span>
                <span className="text-[11px] font-normal text-secondaryText">Supabase Auth</span>
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  autoFocus
                  disabled={isLockedOut || authSubmitting}
                  autoComplete="email"
                  value={emailInput}
                  onChange={(e) => {
                    setEmailInput(e.target.value);
                    if (authError) setAuthError('');
                  }}
                  placeholder="e.g. shopkeeper@store.com"
                  className={`w-full px-4 py-3 pl-10 rounded-xl bg-background border text-sm font-medium text-mainText focus:outline-none focus:ring-2 transition-all ${
                    isLockedOut
                      ? 'border-red-300 bg-red-50/50 cursor-not-allowed opacity-60'
                      : 'border-gray-200 focus:ring-primary/20 focus:border-primary'
                  }`}
                />
                <Mail size={16} className="absolute left-3.5 top-3.5 text-gray-400" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-mainText mb-1.5 flex items-center justify-between">
                <span>Secret Password *</span>
                <span className="text-[11px] font-normal text-secondaryText">Min 6 characters</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  disabled={isLockedOut || authSubmitting}
                  autoComplete="current-password"
                  value={passwordInput}
                  onChange={(e) => {
                    setPasswordInput(e.target.value);
                    if (authError) setAuthError('');
                  }}
                  placeholder="Enter your password"
                  className={`w-full px-4 py-3 pl-10 pr-11 rounded-xl bg-background border text-sm font-medium text-mainText focus:outline-none focus:ring-2 transition-all ${
                    isLockedOut
                      ? 'border-red-300 bg-red-50/50 cursor-not-allowed opacity-60'
                      : 'border-gray-200 focus:ring-primary/20 focus:border-primary'
                  }`}
                />
                <Lock size={16} className="absolute left-3.5 top-3.5 text-gray-400" />
                <button
                  type="button"
                  disabled={isLockedOut || authSubmitting}
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3.5 text-gray-400 hover:text-gray-600 focus:outline-none"
                  title={showPassword ? 'Hide Password' : 'Show Password'}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {authError && (
              <div className={`p-3 rounded-xl text-xs flex items-center gap-2 animate-in fade-in duration-200 ${
                isLockedOut
                  ? 'bg-red-100 border border-red-200 text-red-900 font-bold'
                  : 'bg-red-50 border border-red-100 text-red-700'
              }`}>
                {isLockedOut ? <Clock size={16} className="shrink-0 text-red-600 animate-spin" /> : <AlertCircle size={15} className="shrink-0 text-red-500" />}
                <span>{authError}</span>
              </div>
            )}

            {/* Security Lockout Notice */}
            {isLockedOut && (
              <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center gap-2">
                <Clock size={16} className="shrink-0 text-amber-700 animate-pulse" />
                <span className="font-semibold">
                  Brute-force protection: Please wait {lockoutRemainingSeconds} seconds.
                </span>
              </div>
            )}

            <button
              type="submit"
              disabled={isLockedOut || authSubmitting}
              className={`w-full py-3.5 px-4 rounded-xl font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 ${
                isLockedOut || authSubmitting
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-primary hover:bg-primary-dark text-white active:scale-98'
              }`}
            >
              {authSubmitting ? (
                <>
                  <RefreshCw size={17} className="animate-spin" />
                  <span>Authenticating with Supabase...</span>
                </>
              ) : (
                <>
                  <KeyRound size={17} />
                  <span>
                    {isLockedOut
                      ? `Locked (${lockoutRemainingSeconds}s)`
                      : 'Sign In to Dashboard'}
                  </span>
                </>
              )}
            </button>
          </form>

          {/* Security Guarantee Note */}
          <div className="mt-4 p-2.5 rounded-xl bg-gray-50 border border-gray-100 text-[11px] text-secondaryText flex items-center justify-center gap-1.5">
            <ShieldCheck size={13} className="text-primary shrink-0" />
            <span>JWT Token Authentication • Protected by Row Level Security (RLS)</span>
          </div>

          <div className="mt-5 pt-4 border-t border-gray-100">
            <button
              onClick={() => onNavigate('home')}
              className="text-xs font-semibold text-secondaryText hover:text-primary transition-colors flex items-center justify-center gap-1.5 mx-auto"
            >
              <ArrowLeft size={14} />
              <span>Back to Store Catalog</span>
            </button>
          </div>

        </div>
      </div>
    );
  }

  // =========================================================================
  // VIEW 2: LOGGED-IN SHOPKEEPER DASHBOARD
  // =========================================================================
  return (
    <div className="py-6 sm:py-10 bg-background min-h-[85vh]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 sm:mb-8 bg-surface p-5 sm:p-6 rounded-2xl border border-gray-100 shadow-2xs">
          <div>
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className={`w-2.5 h-2.5 rounded-full ${isCloudConnected ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`}></span>
              <span className="text-xs font-bold text-primary uppercase tracking-wider flex items-center gap-1.5">
                <UserCheck size={14} className="text-emerald-600" />
                <span>Shopkeeper: {currentUser?.email || 'Logged In'}</span>
              </span>
              <button
                type="button"
                onClick={() => setShowDbModal(true)}
                className={`ml-2 px-2.5 py-0.5 rounded-full text-[11px] font-bold border transition-colors flex items-center gap-1.5 ${
                  isCloudConnected 
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100' 
                    : 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100'
                }`}
              >
                <Database size={11} />
                <span>{isCloudConnected ? 'Supabase Cloud Connected' : 'Local Mode • Connect Supabase'}</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  fetchCloudData?.();
                  triggerToast('Checking Supabase connection...');
                }}
                className="p-1 rounded-lg text-gray-400 hover:text-primary transition-colors"
                title="Refresh Cloud Data"
              >
                <RefreshCw size={12} />
              </button>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-mainText tracking-tight">
              Store &amp; Catalog Management
            </h1>
            <p className="text-xs sm:text-sm text-secondaryText mt-0.5">
              Add products, configure pack size quantities (250g, 500g, 1kg), update delivery fees, and customize store settings.
            </p>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              onClick={() => onNavigate('home')}
              className="px-3.5 py-2 rounded-xl border border-gray-200 hover:border-primary text-mainText text-xs font-semibold transition-colors flex items-center gap-1.5"
            >
              <ArrowLeft size={15} />
              <span>View Live Store</span>
            </button>
            <button
              onClick={handleLogout}
              className="px-3.5 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold transition-colors flex items-center gap-1.5"
              title="Logout from admin session"
            >
              <LogOut size={15} />
              <span>Logout</span>
            </button>
            <button
              onClick={() => {
                if (window.confirm('Reset all products and store settings to demo defaults? Any custom added products will be restored.')) {
                  resetToDefaultData();
                  triggerToast('Catalog & store reset to defaults.');
                }
              }}
              className="px-3 py-2 rounded-xl text-red-600 hover:bg-red-50 text-xs font-semibold transition-colors flex items-center gap-1.5"
              title="Reset catalog to initial sample data"
            >
              <RotateCcw size={14} />
              <span>Reset Defaults</span>
            </button>
          </div>
        </div>

        {/* Save Toast Notification */}
        {saveToast && (
          <div className="fixed top-20 right-4 z-50 bg-emerald-900 text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-2.5 text-xs sm:text-sm font-semibold animate-in slide-in-from-top-4">
            <CheckCircle2 size={18} className="text-emerald-400" />
            <span>{saveToast}</span>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-gray-200 pb-3 mb-6 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('products')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all shrink-0 ${
              activeTab === 'products'
                ? 'bg-primary text-white shadow-xs'
                : 'bg-surface text-secondaryText hover:text-mainText'
            }`}
          >
            <Package size={17} />
            <span>Products ({products.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('categories')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all shrink-0 ${
              activeTab === 'categories'
                ? 'bg-primary text-white shadow-xs'
                : 'bg-surface text-secondaryText hover:text-mainText'
            }`}
          >
            <Layers size={17} />
            <span>Categories ({categories.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all shrink-0 ${
              activeTab === 'orders'
                ? 'bg-primary text-white shadow-xs'
                : 'bg-surface text-secondaryText hover:text-mainText'
            }`}
          >
            <ShoppingBag size={17} />
            <span>Orders ({orders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('delivery')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all shrink-0 ${
              activeTab === 'delivery'
                ? 'bg-primary text-white shadow-xs'
                : 'bg-surface text-secondaryText hover:text-mainText'
            }`}
          >
            <Truck size={17} />
            <span>Delivery &amp; Free Threshold</span>
          </button>

          <button
            onClick={() => setActiveTab('store')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all shrink-0 ${
              activeTab === 'store'
                ? 'bg-primary text-white shadow-xs'
                : 'bg-surface text-secondaryText hover:text-mainText'
            }`}
          >
            <Store size={17} />
            <span>Store Details &amp; WhatsApp</span>
          </button>

          <button
            onClick={() => setActiveTab('offers')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all shrink-0 ${
              activeTab === 'offers'
                ? 'bg-primary text-white shadow-xs'
                : 'bg-surface text-secondaryText hover:text-mainText'
            }`}
          >
            <Tag size={17} />
            <span>Offer Banner</span>
          </button>

          <button
            onClick={() => setActiveTab('about')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all shrink-0 ${
              activeTab === 'about'
                ? 'bg-primary text-white shadow-xs'
                : 'bg-surface text-secondaryText hover:text-mainText'
            }`}
          >
            <BookOpen size={17} />
            <span>About Store Story</span>
          </button>
        </div>

        {/* ============================================================== */}
        {/* TAB 1: PRODUCTS MANAGEMENT */}
        {/* ============================================================== */}
        {activeTab === 'products' && (
          <div className="space-y-4">
            
            {/* Filter and Add Button Bar */}
            <div className="bg-surface p-4 rounded-2xl border border-gray-100 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-3">
              <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto flex-1">
                {/* Search */}
                <div className="relative w-full sm:w-64">
                  <Search size={16} className="absolute left-3 top-3 text-secondaryText" />
                  <input
                    type="text"
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    placeholder="Search product or brand..."
                    className="w-full pl-9 pr-3 py-2 bg-background border border-gray-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>

                {/* Category Select */}
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full sm:w-auto px-3 py-2 bg-background border border-gray-200 rounded-xl text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="all">All Categories</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <button
                onClick={handleOpenAddModal}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-dark text-white font-bold text-xs sm:text-sm shadow-sm transition-all flex items-center justify-center gap-2"
              >
                <Plus size={16} />
                <span>Add New Product</span>
              </button>
            </div>

            {/* Products List Table / Cards */}
            <div className="bg-surface rounded-2xl border border-gray-100 shadow-2xs overflow-hidden">
              <div className="divide-y divide-gray-100">
                {filteredProducts.map((p) => {
                  const hasVar = Array.isArray(p.variants) && p.variants.length > 0;

                  return (
                    <div
                      key={p.id}
                      className="p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-gray-50/50 transition-colors"
                    >
                      {/* Left: Thumbnail & Info */}
                      <div className="flex items-center gap-3">
                        <img
                          src={p.image}
                          alt={p.name}
                          className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl object-cover bg-emerald-50 shrink-0 border border-gray-100"
                        />
                        <div>
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                              {categories.find((c) => c.id === p.category)?.name || p.category}
                            </span>
                            {p.brand && (
                              <span className="text-[10px] font-semibold text-gray-500">
                                • {p.brand}
                              </span>
                            )}
                            {p.isBestOffer && (
                              <span className="text-[9px] bg-accent text-white px-1.5 py-0.2 rounded font-bold">
                                Deal
                              </span>
                            )}
                          </div>
                          <h4 className="text-xs sm:text-sm font-bold text-mainText mt-0.5 line-clamp-1">
                            {p.name}
                          </h4>

                          {/* Variants or Unit info */}
                          <div className="flex items-center gap-2 mt-1">
                            {hasVar ? (
                              <div className="flex items-center gap-1 flex-wrap">
                                <span className="text-[11px] font-bold text-primary bg-secondary px-1.5 py-0.2 rounded">
                                  {p.variants.length} pack sizes:
                                </span>
                                {p.variants.map((v, i) => (
                                  <span key={i} className="text-[10px] text-gray-600 bg-gray-100 px-1 py-0.2 rounded">
                                    {v.unit}: {formatPrice(v.price)}
                                  </span>
                                ))}
                              </div>
                            ) : (
                              <span className="text-xs text-secondaryText">
                                {p.unit} • <strong className="text-mainText">{formatPrice(p.price)}</strong>
                                {p.originalPrice && p.originalPrice > p.price && (
                                  <span className="line-through text-gray-400 ml-1.5">{formatPrice(p.originalPrice)}</span>
                                )}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Right: Actions */}
                      <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                        <button
                          onClick={() => handleOpenEditModal(p)}
                          className="p-2 sm:px-3 sm:py-1.5 rounded-xl border border-gray-200 hover:border-primary text-mainText hover:text-primary text-xs font-semibold transition-colors flex items-center gap-1"
                          title="Edit product"
                        >
                          <Edit2 size={13} />
                          <span className="hidden sm:inline">Edit</span>
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(`Are you sure you want to delete "${p.name}"?`)) {
                              deleteProduct(p.id);
                              triggerToast('Product deleted.');
                            }
                          }}
                          className="p-2 sm:px-3 sm:py-1.5 rounded-xl border border-red-100 text-red-600 hover:bg-red-50 text-xs font-semibold transition-colors flex items-center gap-1"
                          title="Delete product"
                        >
                          <Trash2 size={13} />
                          <span className="hidden sm:inline">Delete</span>
                        </button>
                      </div>
                    </div>
                  );
                })}

                {filteredProducts.length === 0 && (
                  <div className="py-12 text-center text-secondaryText text-sm">
                    No products found matching your search.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 1: CATEGORIES MANAGEMENT */}
        {/* ============================================================== */}
        {activeTab === 'categories' && (
          <div className="space-y-4">
            
            {/* Header with Title and Add Button */}
            <div className="bg-surface p-4 sm:p-5 rounded-2xl border border-gray-100 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-bold text-mainText flex items-center gap-2">
                  <Layers size={18} className="text-primary" />
                  <span>Category Photos &amp; Names Management</span>
                </h3>
                <p className="text-xs text-secondaryText mt-0.5">
                  Update category photos, English names, Hindi names, and emoji icons shown on the storefront and filter bars.
                </p>
              </div>

              <button
                onClick={handleOpenAddCategoryModal}
                className="px-4 py-2.5 rounded-xl bg-primary hover:bg-primary-dark text-white font-bold text-xs shadow-sm transition-all flex items-center gap-2 shrink-0 active:scale-95"
              >
                <Plus size={16} />
                <span>Add New Category</span>
              </button>
            </div>

            {/* Categories Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
              {categories.map((cat) => {
                const count = products.filter((p) => p.category === cat.id).length;
                return (
                  <div
                    key={cat.id}
                    className="bg-surface rounded-2xl border border-gray-100 overflow-hidden shadow-2xs hover:shadow-md transition-all duration-200 flex flex-col"
                  >
                    {/* Image Area */}
                    <div className="relative aspect-[4/3] bg-gray-100 overflow-hidden group">
                      <img
                        src={cat.image || 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=400&q=80'}
                        alt={cat.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          e.target.src = 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=400&q=80';
                        }}
                      />
                      {/* Emoji Icon Badge */}
                      <div className="absolute top-2.5 left-2.5 w-9 h-9 rounded-xl bg-surface/90 backdrop-blur-xs flex items-center justify-center text-lg shadow-sm border border-white/60">
                        {cat.icon || '🛍️'}
                      </div>
                      {/* Products Count Badge */}
                      <span className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-xs text-[10px] text-white font-bold">
                        {count} {count === 1 ? 'Product' : 'Products'}
                      </span>
                    </div>

                    {/* Content Details */}
                    <div className="p-4 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-baseline justify-between gap-2">
                          <h4 className="font-extrabold text-sm text-mainText truncate">
                            {cat.name}
                          </h4>
                          {cat.hindiName && (
                            <span className="text-xs text-primary font-bold shrink-0">
                              {cat.hindiName}
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-secondaryText line-clamp-2 mt-1 leading-relaxed">
                          {cat.description || 'No description provided.'}
                        </p>
                      </div>

                      {/* Action Buttons */}
                      <div className="pt-3 mt-3 border-t border-gray-100 flex items-center gap-2">
                        <button
                          onClick={() => handleOpenEditCategoryModal(cat)}
                          className="flex-1 py-2 px-3 rounded-xl bg-secondary text-primary font-bold text-xs hover:bg-emerald-100 transition-colors flex items-center justify-center gap-1.5"
                        >
                          <Edit2 size={13} />
                          <span>Edit Photo &amp; Name</span>
                        </button>
                        <button
                          onClick={() => handleDeleteCategory(cat)}
                          className="p-2 rounded-xl text-red-500 hover:bg-red-50 hover:text-red-700 transition-colors"
                          title="Delete Category"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 2: DELIVERY & FREE THRESHOLD */}
        {/* ============================================================== */}
        {activeTab === 'delivery' && (
          <div className="bg-surface p-5 sm:p-7 rounded-2xl border border-gray-100 shadow-2xs max-w-2xl">
            <h3 className="text-base font-bold text-mainText mb-1 flex items-center gap-2">
              <Truck size={18} className="text-primary" />
              <span>Delivery Charges &amp; Free Delivery Policy</span>
            </h3>
            <p className="text-xs text-secondaryText mb-6">
              Control the delivery fees charged to customers, free delivery qualification amount, and covered delivery areas.
            </p>

            <form onSubmit={handleSaveDelivery} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-mainText mb-1">
                    Free Delivery Threshold (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    value={deliveryForm.freeDeliveryAbove}
                    onChange={(e) => setDeliveryForm({ ...deliveryForm, freeDeliveryAbove: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl text-sm bg-background border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                  <span className="text-[11px] text-secondaryText mt-0.5 block">Orders above this amount get free delivery</span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-mainText mb-1">
                    Standard Delivery Fee (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    value={deliveryForm.deliveryFee}
                    onChange={(e) => setDeliveryForm({ ...deliveryForm, deliveryFee: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl text-sm bg-background border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                  <span className="text-[11px] text-secondaryText mt-0.5 block">Applied when order is below threshold</span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-mainText mb-1">
                    Minimum Order Amount (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    value={deliveryForm.minOrderAmount}
                    onChange={(e) => setDeliveryForm({ ...deliveryForm, minOrderAmount: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl text-sm bg-background border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-mainText mb-1">
                    Estimated Delivery Time *
                  </label>
                  <input
                    type="text"
                    required
                    value={deliveryForm.estimatedTime}
                    onChange={(e) => setDeliveryForm({ ...deliveryForm, estimatedTime: e.target.value })}
                    placeholder="e.g. 30 - 45 Mins"
                    className="w-full px-3.5 py-2.5 rounded-xl text-sm bg-background border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>
              </div>

              {/* Delivery Areas Management */}
              <div className="pt-3 border-t border-gray-100">
                <label className="block text-xs font-bold text-mainText mb-1.5">
                  Covered Delivery Areas &amp; Colonies
                </label>
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={newAreaInput}
                    onChange={(e) => setNewAreaInput(e.target.value)}
                    placeholder="e.g. Sector 16 or Green Park"
                    className="flex-1 px-3.5 py-2 rounded-xl text-xs sm:text-sm bg-background border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                  <button
                    type="button"
                    onClick={handleAddArea}
                    className="px-4 py-2 rounded-xl bg-secondary text-primary font-bold text-xs hover:bg-emerald-100 transition-colors"
                  >
                    Add Area
                  </button>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {deliveryForm.deliveryAreas.map((area, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1.5 bg-gray-100 px-3 py-1 rounded-lg text-xs font-medium text-mainText"
                    >
                      <span>📍 {area}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveArea(area)}
                        className="text-gray-400 hover:text-red-500"
                      >
                        <X size={13} />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl bg-primary hover:bg-primary-dark text-white font-bold text-sm shadow-sm transition-all flex items-center gap-2"
                >
                  <Save size={16} />
                  <span>Save Delivery Settings</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 3: STORE DETAILS, WHATSAPP & SECURITY PIN */}
        {/* ============================================================== */}
        {activeTab === 'store' && (
          <div className="space-y-6 max-w-2xl">
            {/* Store Information Form */}
            <div className="bg-surface p-5 sm:p-7 rounded-2xl border border-gray-100 shadow-2xs">
              <h3 className="text-base font-bold text-mainText mb-1 flex items-center gap-2">
                <Store size={18} className="text-primary" />
                <span>Store Identity &amp; WhatsApp Configuration</span>
              </h3>
              <p className="text-xs text-secondaryText mb-6">
                Update shop name, WhatsApp receiver number, phone number, and physical store address.
              </p>

              <form onSubmit={handleSaveStore} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-mainText mb-1">
                      Store Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={storeForm.name}
                      onChange={(e) => setStoreForm({ ...storeForm, name: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl text-sm bg-background border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-mainText mb-1">
                      Shopkeeper / Owner Name
                    </label>
                    <input
                      type="text"
                      value={storeForm.ownerName}
                      onChange={(e) => setStoreForm({ ...storeForm, ownerName: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl text-sm bg-background border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-mainText mb-1">
                      Store WhatsApp Number (Orders arrive here) *
                    </label>
                    <input
                      type="text"
                      required
                      value={storeForm.whatsappNumber}
                      onChange={(e) => setStoreForm({ ...storeForm, whatsappNumber: e.target.value.replace(/\D/g, '') })}
                      placeholder="e.g. 9876543210"
                      className="w-full px-3.5 py-2.5 rounded-xl text-sm bg-background border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    />
                    <span className="text-[11px] text-secondaryText mt-0.5 block">10-digit number or with 91 prefix</span>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-mainText mb-1">
                      Store Calling Phone Number *
                    </label>
                    <input
                      type="text"
                      required
                      value={storeForm.displayPhone}
                      onChange={(e) => setStoreForm({ ...storeForm, displayPhone: e.target.value })}
                      placeholder="+91 98765 43210"
                      className="w-full px-3.5 py-2.5 rounded-xl text-sm bg-background border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-mainText mb-1">
                    Full Store Address *
                  </label>
                  <textarea
                    rows={2}
                    required
                    value={storeForm.fullAddress}
                    onChange={(e) => setStoreForm({ ...storeForm, fullAddress: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl text-sm bg-background border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-bold text-mainText">
                      Google Maps Navigation Link / URL
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        if (storeForm.fullAddress.trim()) {
                          const autoUrl = `https://maps.google.com/?q=${encodeURIComponent(storeForm.fullAddress.trim())}`;
                          setStoreForm((prev) => ({ ...prev, mapsUrl: autoUrl }));
                          triggerToast('Generated Google Maps link from address!');
                        }
                      }}
                      className="text-[11px] text-primary hover:underline font-semibold"
                    >
                      Auto-generate from Address
                    </button>
                  </div>
                  <input
                    type="url"
                    value={storeForm.mapsUrl || ''}
                    onChange={(e) => setStoreForm({ ...storeForm, mapsUrl: e.target.value })}
                    placeholder="https://maps.google.com/?q=..."
                    className="w-full px-3.5 py-2.5 rounded-xl text-sm bg-background border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                  <span className="text-[11px] text-secondaryText mt-0.5 block">
                    Link opened when customers click &quot;View on Google Maps&quot; in Contact &amp; Footer.
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-mainText mb-1">
                      Area / Locality
                    </label>
                    <input
                      type="text"
                      value={storeForm.area}
                      onChange={(e) => setStoreForm({ ...storeForm, area: e.target.value })}
                      placeholder="e.g. Lahar"
                      className="w-full px-3.5 py-2.5 rounded-xl text-sm bg-background border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-mainText mb-1">
                      City / District *
                    </label>
                    <input
                      type="text"
                      value={storeForm.city}
                      onChange={(e) => setStoreForm({ ...storeForm, city: e.target.value })}
                      placeholder="e.g. Bhind, Gwalior"
                      className="w-full px-3.5 py-2.5 rounded-xl text-sm bg-background border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-mainText mb-1">
                      Working Hours
                    </label>
                    <input
                      type="text"
                      value={storeForm.timing}
                      onChange={(e) => setStoreForm({ ...storeForm, timing: e.target.value })}
                      placeholder="7:00 AM - 10:00 PM"
                      className="w-full px-3.5 py-2.5 rounded-xl text-sm bg-background border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                </div>

                <div className="pt-3">
                  <button
                    type="submit"
                    className="px-6 py-3 rounded-xl bg-primary hover:bg-primary-dark text-white font-bold text-sm shadow-sm transition-all flex items-center gap-2"
                  >
                    <Save size={16} />
                    <span>Save Store Details</span>
                  </button>
                </div>
              </form>
            </div>

            {/* Supabase Password Change Security Card */}
            <div className="bg-surface p-5 sm:p-7 rounded-2xl border border-gray-100 shadow-2xs">
              <h4 className="text-base font-bold text-mainText mb-1 flex items-center gap-2">
                <Lock size={18} className="text-primary" />
                <span>Shopkeeper Supabase Account Password</span>
              </h4>
              <p className="text-xs text-secondaryText mb-5">
                Update your Supabase authentication password for shopkeeper ({currentUser?.email}).
              </p>

              <form onSubmit={handleUpdatePassword} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-mainText mb-1">
                      New Secret Password (min 6 characters) *
                    </label>
                    <input
                      type="password"
                      required
                      autoComplete="new-password"
                      value={newStorePassword}
                      onChange={(e) => setNewStorePassword(e.target.value)}
                      placeholder="Enter new strong password"
                      className="w-full px-3.5 py-2.5 rounded-xl text-sm bg-background border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-mainText mb-1">
                      Confirm New Password *
                    </label>
                    <input
                      type="password"
                      required
                      autoComplete="new-password"
                      value={confirmStorePassword}
                      onChange={(e) => setConfirmStorePassword(e.target.value)}
                      placeholder="Re-enter new password"
                      className="w-full px-3.5 py-2.5 rounded-xl text-sm bg-background border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                </div>

                {passwordChangeMsg && (
                  <div className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
                    passwordChangeMsg.includes('successfully')
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-100'
                      : 'bg-red-50 text-red-700 border border-red-100'
                  }`}>
                    {passwordChangeMsg.includes('successfully') ? <CheckCircle2 size={15} /> : <AlertCircle size={15} />}
                    <span>{passwordChangeMsg}</span>
                  </div>
                )}

                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-secondary text-primary font-bold text-xs hover:bg-emerald-100 transition-colors flex items-center gap-1.5"
                >
                  <KeyRound size={15} />
                  <span>Update Account Password</span>
                </button>
              </form>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 4: PROMOTIONAL OFFERS */}
        {/* ============================================================== */}
        {activeTab === 'offers' && (
          <div className="bg-surface p-5 sm:p-7 rounded-2xl border border-gray-100 shadow-2xs max-w-2xl">
            <h3 className="text-base font-bold text-mainText mb-1 flex items-center gap-2">
              <Tag size={18} className="text-primary" />
              <span>Promotional Offers &amp; Banners</span>
            </h3>
            <p className="text-xs text-secondaryText mb-6">
              Update the homepage discount banner text, badge, and deals description.
            </p>

            <form onSubmit={handleSaveOffers} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-mainText mb-1">
                  Offer Badge Label
                </label>
                <input
                  type="text"
                  required
                  value={offerForm.badge}
                  onChange={(e) => setOfferForm({ ...offerForm, badge: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl text-sm bg-background border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-mainText mb-1">
                  Main Headline Title *
                </label>
                <input
                  type="text"
                  required
                  value={offerForm.title}
                  onChange={(e) => setOfferForm({ ...offerForm, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl text-sm bg-background border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-mainText mb-1">
                  Offer Description Text *
                </label>
                <textarea
                  rows={2}
                  required
                  value={offerForm.subtitle}
                  onChange={(e) => setOfferForm({ ...offerForm, subtitle: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl text-sm bg-background border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl bg-primary hover:bg-primary-dark text-white font-bold text-sm shadow-sm transition-all flex items-center gap-2"
                >
                  <Save size={16} />
                  <span>Save Offer Banner</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 5: ABOUT STORE STORY */}
        {/* ============================================================== */}
        {activeTab === 'about' && (
          <div className="bg-surface p-5 sm:p-7 rounded-2xl border border-gray-100 shadow-2xs max-w-2xl">
            <h3 className="text-base font-bold text-mainText mb-1 flex items-center gap-2">
              <BookOpen size={18} className="text-primary" />
              <span>About Page &amp; Store Heritage Story</span>
            </h3>
            <p className="text-xs text-secondaryText mb-6">
              Customize the story, showcase photo, headlines, and trust stats displayed on the About page.
            </p>

            <form onSubmit={handleSaveAbout} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-mainText mb-1">
                  Heritage Badge Label
                </label>
                <input
                  type="text"
                  required
                  value={aboutForm.storyBadge}
                  onChange={(e) => setAboutForm({ ...aboutForm, storyBadge: e.target.value })}
                  placeholder="e.g. Our Heritage"
                  className="w-full px-3.5 py-2.5 rounded-xl text-sm bg-background border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-mainText mb-1">
                  Story Headline Title *
                </label>
                <input
                  type="text"
                  required
                  value={aboutForm.storyTitle}
                  onChange={(e) => setAboutForm({ ...aboutForm, storyTitle: e.target.value })}
                  placeholder="e.g. Bringing the Best Grocery Staples to Every Household"
                  className="w-full px-3.5 py-2.5 rounded-xl text-sm bg-background border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-mainText mb-1">
                  Story Paragraph 1 *
                </label>
                <textarea
                  rows={3}
                  required
                  value={aboutForm.storyParagraph1}
                  onChange={(e) => setAboutForm({ ...aboutForm, storyParagraph1: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl text-sm bg-background border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-mainText mb-1">
                  Story Paragraph 2 *
                </label>
                <textarea
                  rows={3}
                  required
                  value={aboutForm.storyParagraph2}
                  onChange={(e) => setAboutForm({ ...aboutForm, storyParagraph2: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl text-sm bg-background border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-mainText mb-1">
                  Store Showcase Photo URL *
                </label>
                <input
                  type="url"
                  required
                  value={aboutForm.storyImage}
                  onChange={(e) => setAboutForm({ ...aboutForm, storyImage: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl text-sm bg-background border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
                {aboutForm.storyImage && (
                  <div className="mt-2 relative w-36 h-24 rounded-xl overflow-hidden border border-gray-200">
                    <img
                      src={aboutForm.storyImage}
                      alt="Store Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-mainText mb-1">
                    Trust Stat Badge 1
                  </label>
                  <input
                    type="text"
                    required
                    value={aboutForm.stat1}
                    onChange={(e) => setAboutForm({ ...aboutForm, stat1: e.target.value })}
                    placeholder="e.g. 2,000+ Happy Families"
                    className="w-full px-3.5 py-2.5 rounded-xl text-sm bg-background border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-mainText mb-1">
                    Trust Stat Badge 2
                  </label>
                  <input
                    type="text"
                    required
                    value={aboutForm.stat2}
                    onChange={(e) => setAboutForm({ ...aboutForm, stat2: e.target.value })}
                    placeholder="e.g. 100% Genuine Quality"
                    className="w-full px-3.5 py-2.5 rounded-xl text-sm bg-background border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>
              </div>

              <div className="pt-2 border-t border-gray-100">
                <label className="block text-xs font-bold text-mainText mb-1">
                  Top Page Hero Headline
                </label>
                <input
                  type="text"
                  required
                  value={aboutForm.heroTitle}
                  onChange={(e) => setAboutForm({ ...aboutForm, heroTitle: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl text-sm bg-background border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-mainText mb-1">
                  Top Page Subtitle
                </label>
                <textarea
                  rows={2}
                  required
                  value={aboutForm.heroSubtitle}
                  onChange={(e) => setAboutForm({ ...aboutForm, heroSubtitle: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl text-sm bg-background border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl bg-primary hover:bg-primary-dark text-white font-bold text-sm shadow-sm transition-all flex items-center gap-2"
                >
                  <Save size={16} />
                  <span>Save About Page Details</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB: ORDERS HISTORY (CONNECTED TO SUPABASE) */}
        {/* ============================================================== */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-surface p-4 sm:p-5 rounded-2xl border border-gray-100 shadow-2xs">
              <div>
                <h3 className="text-base font-bold text-mainText flex items-center gap-2">
                  <ShoppingBag size={18} className="text-primary" />
                  <span>Customer Orders Received</span>
                  <span className="ml-2 text-xs bg-primary/10 text-primary font-extrabold px-2.5 py-0.5 rounded-full">
                    {orders.length} Orders
                  </span>
                </h3>
                <p className="text-xs text-secondaryText mt-0.5">
                  Orders placed by customers on your website sync here via Supabase in real-time.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    fetchCloudData?.();
                    triggerToast('Refreshed orders from Cloud!');
                  }}
                  className="px-3 py-2 rounded-xl border border-gray-200 hover:border-primary text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <RefreshCw size={14} />
                  <span>Refresh Orders</span>
                </button>
              </div>
            </div>

            {orders.length === 0 ? (
              <div className="bg-surface rounded-2xl border border-gray-100 p-12 text-center shadow-2xs">
                <div className="w-16 h-16 rounded-full bg-emerald-50 text-primary flex items-center justify-center mx-auto mb-3">
                  <ShoppingBag size={30} />
                </div>
                <h4 className="text-base font-bold text-mainText mb-1">No Orders Yet</h4>
                <p className="text-xs sm:text-sm text-secondaryText max-w-md mx-auto">
                  When customers place orders using the "Place Order via WhatsApp" checkout, order details will automatically appear here.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {orders.map((ord) => {
                  const cleanPhone = (ord.customerPhone || '').replace(/\D/g, '');
                  const waChatUrl = cleanPhone
                    ? `https://wa.me/${cleanPhone.startsWith('91') ? cleanPhone : '91' + cleanPhone}?text=${encodeURIComponent(`Namaste ${ord.customerName}! We received your order ${ord.orderId} at ${storeConfig.name}. We are preparing it now!`)}`
                    : null;

                  return (
                    <div
                      key={ord.id}
                      className="bg-surface rounded-2xl border border-gray-100 p-4 sm:p-5 shadow-2xs hover:border-gray-200 transition-all"
                    >
                      {/* Order Header */}
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 pb-3 mb-3">
                        <div className="flex items-center gap-2.5">
                          <span className="font-extrabold text-sm sm:text-base text-primary tracking-tight">
                            #{ord.orderId}
                          </span>
                          <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                            ord.status === 'completed'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : ord.status === 'cancelled'
                              ? 'bg-red-50 text-red-700 border border-red-200'
                              : 'bg-amber-50 text-amber-800 border border-amber-200'
                          }`}>
                            {ord.status.toUpperCase()}
                          </span>
                          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-gray-100 text-gray-700">
                            {ord.orderType === 'pickup' ? 'Store Pickup' : 'Home Delivery'}
                          </span>
                        </div>

                        <span className="text-xs text-secondaryText">
                          {ord.createdAt ? new Date(ord.createdAt).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) : ''}
                        </span>
                      </div>

                      {/* Customer Details & Total */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3 text-xs">
                        <div className="space-y-1">
                          <span className="text-secondaryText font-medium">Customer:</span>
                          <p className="font-bold text-mainText text-sm">{ord.customerName}</p>
                          <p className="text-secondaryText">{ord.customerPhone}</p>
                        </div>

                        <div className="space-y-1">
                          <span className="text-secondaryText font-medium">Address:</span>
                          <p className="text-mainText font-medium">
                            {ord.orderType === 'pickup' ? 'Store Pickup (No Delivery)' : (ord.customerAddress || 'No address provided')}
                          </p>
                          {ord.customerLandmark && (
                            <p className="text-secondaryText">Landmark: {ord.customerLandmark}</p>
                          )}
                          {ord.orderNote && (
                            <p className="text-amber-700 italic">Note: "{ord.orderNote}"</p>
                          )}
                        </div>

                        <div className="space-y-1 md:text-right">
                          <span className="text-secondaryText font-medium">Amount:</span>
                          <p className="text-lg font-black text-primary">{formatPrice(ord.total)}</p>
                          <p className="text-[11px] text-secondaryText">
                            Subtotal {formatPrice(ord.subtotal)} + Delivery {formatPrice(ord.deliveryFee)}
                          </p>
                        </div>
                      </div>

                      {/* Items Ordered List */}
                      <div className="bg-background rounded-xl p-3 border border-gray-100 mb-3">
                        <p className="text-[11px] font-bold text-secondaryText uppercase tracking-wider mb-2">
                          Items in Order ({ord.items?.length || 0})
                        </p>
                        <div className="space-y-1.5">
                          {(ord.items || []).map((item, idx) => (
                            <div key={idx} className="flex items-center justify-between text-xs">
                              <span className="text-mainText font-semibold">
                                {item.name} {item.selectedUnit ? `(${item.selectedUnit})` : ''} × {item.quantity}
                              </span>
                              <span className="text-mainText font-bold">
                                {formatPrice((item.price || 0) * (item.quantity || 1))}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Actions & Status Controls */}
                      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-gray-100">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-semibold text-secondaryText mr-1">Mark Status:</span>
                          <button
                            type="button"
                            onClick={() => {
                              updateOrderStatus(ord.id, 'completed');
                              triggerToast(`Order #${ord.orderId} marked Completed!`);
                            }}
                            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors ${
                              ord.status === 'completed'
                                ? 'bg-emerald-600 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-emerald-100 hover:text-emerald-800'
                            }`}
                          >
                            ✓ Completed
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              updateOrderStatus(ord.id, 'pending');
                              triggerToast(`Order #${ord.orderId} set to Pending.`);
                            }}
                            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors ${
                              ord.status === 'pending'
                                ? 'bg-amber-500 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-amber-100 hover:text-amber-800'
                            }`}
                          >
                            ⏳ Pending
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              updateOrderStatus(ord.id, 'cancelled');
                              triggerToast(`Order #${ord.orderId} marked Cancelled.`);
                            }}
                            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors ${
                              ord.status === 'cancelled'
                                ? 'bg-red-600 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-red-100 hover:text-red-800'
                            }`}
                          >
                            ✕ Cancelled
                          </button>
                        </div>

                        {waChatUrl && (
                          <a
                            href={waChatUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors flex items-center gap-1.5 shadow-2xs"
                          >
                            <PhoneCall size={13} />
                            <span>WhatsApp Customer</span>
                          </a>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ============================================================== */}
        {/* SUPABASE CLOUD SETUP MODAL */}
        {/* ============================================================== */}
        {showDbModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
              onClick={() => setShowDbModal(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
            />

            <div className="relative bg-surface rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl z-10 border border-gray-100 p-5 sm:p-7 animate-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <Database size={18} />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-mainText">Supabase Cloud Database</h3>
                    <p className="text-xs text-secondaryText">Real-time sync across all devices</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowDbModal(false)}
                  className="p-1.5 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="space-y-4 text-xs sm:text-sm">
                <div className={`p-3.5 rounded-2xl border flex items-center justify-between ${
                  isCloudConnected 
                    ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900' 
                    : 'bg-amber-50/70 border-amber-200 text-amber-900'
                }`}>
                  <div className="flex items-center gap-2.5">
                    <span className={`w-3 h-3 rounded-full ${isCloudConnected ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
                    <span className="font-bold">
                      {isCloudConnected ? 'Cloud Database Connected & Active' : 'Setup Required in Supabase'}
                    </span>
                  </div>
                  <span className="text-[11px] font-mono bg-white/70 px-2 py-0.5 rounded-md border border-gray-200">
                    {supabaseProjectId}
                  </span>
                </div>

                <div className="space-y-2">
                  <p className="font-bold text-mainText">How to activate 1-Click Database:</p>
                  <ol className="list-decimal list-inside space-y-2 text-secondaryText text-xs leading-relaxed">
                    <li>
                      Open your Supabase project:{' '}
                      <a
                        href={`https://supabase.com/dashboard/project/${supabaseProjectId}/sql/new`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary font-bold underline inline-flex items-center gap-1"
                      >
                        <span>Open SQL Editor</span>
                        <ExternalLink size={11} />
                      </a>
                    </li>
                    <li>
                      Click the button below to copy the complete schema script (creates products, categories, orders, store settings &amp; live sync).
                    </li>
                    <li>
                      Paste into the Supabase SQL editor and click <strong className="text-mainText">Run</strong>.
                    </li>
                  </ol>
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(supabaseSetupSql);
                      setCopiedSql(true);
                      triggerToast('SQL Schema copied to clipboard!');
                      setTimeout(() => setCopiedSql(false), 3000);
                    }}
                    className="w-full py-3 px-4 rounded-xl bg-primary hover:bg-primary-dark text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2"
                  >
                    {copiedSql ? <Check size={16} /> : <Database size={16} />}
                    <span>{copiedSql ? '✓ SQL Copied to Clipboard!' : 'Copy SQL Schema Script (1-Click)'}</span>
                  </button>
                </div>

                <div className="pt-2 text-[11px] text-gray-500 text-center">
                  Script file is also saved locally in project root as <code className="bg-gray-100 px-1 py-0.5 rounded">supabase_schema.sql</code>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* ADD / EDIT PRODUCT MODAL */}
        {/* ============================================================== */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
              onClick={() => setIsModalOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
            />

            <div className="relative bg-surface rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl z-10 border border-gray-100 p-5 sm:p-7 animate-in zoom-in-95 duration-200">
              
              <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-4">
                <h3 className="text-base sm:text-lg font-bold text-mainText">
                  {editingProductId ? 'Edit Grocery Product' : 'Add New Grocery Product'}
                </h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-1.5 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSaveProduct} className="space-y-4 text-xs sm:text-sm">
                
                {/* 1. Name & Brand */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-mainText mb-1">
                      Product Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={productForm.name}
                      onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                      placeholder="e.g. Madhur Pure Sugar"
                      className="w-full px-3 py-2 rounded-xl bg-background border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-mainText mb-1">
                      Brand Name
                    </label>
                    <input
                      type="text"
                      value={productForm.brand}
                      onChange={(e) => setProductForm({ ...productForm, brand: e.target.value })}
                      placeholder="e.g. Madhur, Tata, Amul"
                      className="w-full px-3 py-2 rounded-xl bg-background border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    />
                  </div>
                </div>

                {/* 2. Category & Image */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-mainText mb-1">
                      Category *
                    </label>
                    <select
                      value={productForm.category}
                      onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-background border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20"
                    >
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-mainText mb-1">
                      Image URL
                    </label>
                    <input
                      type="url"
                      value={productForm.image}
                      onChange={(e) => setProductForm({ ...productForm, image: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-background border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                </div>

                {/* 3. MULTIPLE PACK SIZES / QUANTITY VARIANTS TOGGLE */}
                <div className="p-3.5 rounded-2xl bg-secondary/50 border border-emerald-100">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <span className="font-bold text-xs text-primary block">
                        Multi-Pack Size / Quantity Variants
                      </span>
                      <span className="text-[11px] text-secondaryText">
                        Like Sugar: 250g, 500g, 1kg, 5kg with custom rates
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => setHasVariants(!hasVariants)}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        hasVariants ? 'bg-primary' : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                          hasVariants ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>

                  {/* If HAS VARIANTS: List of pack sizes */}
                  {hasVariants ? (
                    <div className="space-y-2 pt-2 border-t border-emerald-100">
                      <div className="grid grid-cols-12 gap-2 text-[11px] font-bold text-secondaryText px-1">
                        <span className="col-span-4">Pack Unit (e.g. 250 g)</span>
                        <span className="col-span-3">Selling Price (₹)</span>
                        <span className="col-span-3">Original MRP (₹)</span>
                        <span className="col-span-2 text-center">Remove</span>
                      </div>

                      {productForm.variants.map((v, idx) => (
                        <div key={idx} className="grid grid-cols-12 gap-2 items-center bg-surface p-2 rounded-xl border border-gray-100">
                          <input
                            type="text"
                            required
                            value={v.unit}
                            onChange={(e) => handleVariantChange(idx, 'unit', e.target.value)}
                            placeholder="250 g"
                            className="col-span-4 px-2.5 py-1.5 rounded-lg border border-gray-200 text-xs font-semibold"
                          />
                          <input
                            type="number"
                            required
                            value={v.price}
                            onChange={(e) => handleVariantChange(idx, 'price', e.target.value)}
                            placeholder="15"
                            className="col-span-3 px-2.5 py-1.5 rounded-lg border border-gray-200 text-xs font-semibold text-primary"
                          />
                          <input
                            type="number"
                            value={v.originalPrice}
                            onChange={(e) => handleVariantChange(idx, 'originalPrice', e.target.value)}
                            placeholder="18"
                            className="col-span-3 px-2.5 py-1.5 rounded-lg border border-gray-200 text-xs text-gray-400"
                          />
                          <div className="col-span-2 text-center">
                            {productForm.variants.length > 1 && (
                              <button
                                type="button"
                                onClick={() => handleRemoveVariantRow(idx)}
                                className="text-gray-400 hover:text-red-500 p-1"
                              >
                                <Trash2 size={13} />
                              </button>
                            )}
                          </div>
                        </div>
                      ))}

                      <button
                        type="button"
                        onClick={handleAddVariantRow}
                        className="mt-2 text-xs font-bold text-primary hover:text-primary-dark flex items-center gap-1"
                      >
                        <Plus size={13} />
                        <span>Add Another Pack Size</span>
                      </button>
                    </div>
                  ) : (
                    /* Single Unit & Price */
                    <div className="grid grid-cols-3 gap-3 pt-2">
                      <div>
                        <label className="block text-[11px] font-bold text-mainText mb-1">
                          Unit / Pack Size
                        </label>
                        <input
                          type="text"
                          required={!hasVariants}
                          value={productForm.unit}
                          onChange={(e) => setProductForm({ ...productForm, unit: e.target.value })}
                          placeholder="e.g. 1 kg or 500 ml"
                          className="w-full px-3 py-1.5 rounded-xl bg-background border border-gray-200 text-xs font-semibold"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-mainText mb-1">
                          Selling Price (₹)
                        </label>
                        <input
                          type="number"
                          required={!hasVariants}
                          value={productForm.price}
                          onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                          className="w-full px-3 py-1.5 rounded-xl bg-background border border-gray-200 text-xs font-bold text-primary"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-mainText mb-1">
                          MRP Price (₹)
                        </label>
                        <input
                          type="number"
                          value={productForm.originalPrice}
                          onChange={(e) => setProductForm({ ...productForm, originalPrice: e.target.value })}
                          className="w-full px-3 py-1.5 rounded-xl bg-background border border-gray-200 text-xs text-gray-500"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* 4. Description */}
                <div>
                  <label className="block text-xs font-bold text-mainText mb-1">
                    Short Description
                  </label>
                  <textarea
                    rows={2}
                    value={productForm.description}
                    onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                    placeholder="Short summary for customer"
                    className="w-full px-3 py-2 rounded-xl bg-background border border-gray-200 text-xs"
                  />
                </div>

                {/* 5. Toggles */}
                <div className="flex items-center gap-6 pt-1 text-xs font-semibold">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={productForm.inStock}
                      onChange={(e) => setProductForm({ ...productForm, inStock: e.target.checked })}
                      className="rounded text-primary focus:ring-primary"
                    />
                    <span>In Stock</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={productForm.isFeatured}
                      onChange={(e) => setProductForm({ ...productForm, isFeatured: e.target.checked })}
                      className="rounded text-primary focus:ring-primary"
                    />
                    <span>Featured Item</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={productForm.isBestOffer}
                      onChange={(e) => setProductForm({ ...productForm, isBestOffer: e.target.checked })}
                      className="rounded text-primary focus:ring-primary"
                    />
                    <span>Special Deal</span>
                  </label>
                </div>

                {/* Actions */}
                <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-gray-600 hover:bg-gray-100 font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-primary hover:bg-primary-dark text-white font-bold shadow-sm"
                  >
                    {editingProductId ? 'Update Product' : 'Add to Catalog'}
                  </button>
                </div>

              </form>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* CATEGORY ADD / EDIT MODAL */}
        {/* ============================================================== */}
        {isCategoryModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
              onClick={() => setIsCategoryModalOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
            />

            <div className="relative bg-surface rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl z-10 border border-gray-100 p-5 sm:p-7 animate-in zoom-in-95 duration-200">
              {/* Modal Header */}
              <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-secondary text-primary flex items-center justify-center">
                    <Layers size={18} />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-mainText">
                      {editingCategoryId ? 'Edit Category Photo & Name' : 'Add New Category'}
                    </h3>
                    <p className="text-xs text-secondaryText">Update category visuals and details displayed in store</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsCategoryModalOpen(false)}
                  className="p-1.5 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSaveCategory} className="space-y-4 text-xs sm:text-sm">
                {/* Photo Live Preview Box */}
                <div>
                  <label className="block text-xs font-bold text-mainText mb-1.5">
                    Category Photo Preview
                  </label>
                  <div className="relative aspect-[16/9] rounded-2xl overflow-hidden bg-gray-100 border border-gray-200 shadow-inner">
                    <img
                      src={categoryForm.image || 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80'}
                      alt="Category Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80';
                      }}
                    />
                    <div className="absolute top-2.5 left-2.5 w-10 h-10 rounded-xl bg-surface/90 backdrop-blur-xs flex items-center justify-center text-xl shadow-md border border-white/60">
                      {categoryForm.icon || '🛍️'}
                    </div>
                    <div className="absolute bottom-2.5 left-2.5 bg-black/60 backdrop-blur-xs text-white px-2.5 py-1 rounded-lg text-xs font-bold">
                      {categoryForm.name || 'Category Name'} {categoryForm.hindiName ? `(${categoryForm.hindiName})` : ''}
                    </div>
                  </div>
                </div>

                {/* Photo URL Input */}
                <div>
                  <label className="block text-xs font-bold text-mainText mb-1">
                    Photo URL (Unsplash or Image Link) *
                  </label>
                  <input
                    type="url"
                    required
                    value={categoryForm.image}
                    onChange={(e) => setCategoryForm({ ...categoryForm, image: e.target.value })}
                    placeholder="https://images.unsplash.com/photo-..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-xs"
                  />

                  {/* Quick Photo Presets */}
                  <div className="mt-2">
                    <span className="text-[11px] font-semibold text-secondaryText block mb-1">
                      Quick Sample Photos:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {[
                        { label: 'Atta & Rice', url: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=400&q=80' },
                        { label: 'Dal & Pulses', url: 'https://images.unsplash.com/photo-1596797882870-8c33deeac224?auto=format&fit=crop&w=400&q=80' },
                        { label: 'Oil & Ghee', url: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=400&q=80' },
                        { label: 'Dairy & Milk', url: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=400&q=80' },
                        { label: 'Snacks', url: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&w=400&q=80' },
                        { label: 'Tea & Coffee', url: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=400&q=80' },
                        { label: 'Spices', url: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=400&q=80' },
                        { label: 'Cleaners', url: 'https://images.unsplash.com/photo-1583947215259-38e31be8751f?auto=format&fit=crop&w=400&q=80' }
                      ].map((preset) => (
                        <button
                          key={preset.label}
                          type="button"
                          onClick={() => setCategoryForm({ ...categoryForm, image: preset.url })}
                          className="text-[10px] bg-gray-100 hover:bg-emerald-50 hover:text-primary px-2 py-1 rounded-md border border-gray-200 transition-colors"
                        >
                          {preset.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Names: English and Hindi */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-mainText mb-1">
                      Category Name (English) *
                    </label>
                    <input
                      type="text"
                      required
                      value={categoryForm.name}
                      onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                      placeholder="e.g. Atta & Rice"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-mainText mb-1">
                      Hindi Name (हिंदी नाम)
                    </label>
                    <input
                      type="text"
                      value={categoryForm.hindiName}
                      onChange={(e) => setCategoryForm({ ...categoryForm, hindiName: e.target.value })}
                      placeholder="e.g. आटा और चावल"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-xs"
                    />
                  </div>
                </div>

                {/* Emoji Icon Picker */}
                <div>
                  <label className="block text-xs font-bold text-mainText mb-1 flex items-center justify-between">
                    <span>Category Emoji Icon *</span>
                    <span className="text-[11px] text-secondaryText font-normal">Click icon to select</span>
                  </label>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center text-xl shrink-0">
                      {categoryForm.icon || '🛍️'}
                    </span>
                    <input
                      type="text"
                      value={categoryForm.icon}
                      onChange={(e) => setCategoryForm({ ...categoryForm, icon: e.target.value })}
                      placeholder="e.g. 🌾"
                      className="w-full px-3.5 py-2 rounded-xl bg-background border border-gray-200 text-xs"
                    />
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {['🌾', '🥣', '🫒', '🥛', '🍪', '☕', '🧼', '🧂', '🍫', '🍎', '🍞', '🛒', '🥤', '🧺', '🧅', '🍬'].map((emoji) => (
                      <button
                        key={emoji}
                        type="button"
                        onClick={() => setCategoryForm({ ...categoryForm, icon: emoji })}
                        className={`w-7 h-7 rounded-lg text-sm flex items-center justify-center border transition-all ${
                          categoryForm.icon === emoji
                            ? 'bg-primary text-white border-primary scale-110 shadow-xs'
                            : 'bg-background hover:bg-gray-100 border-gray-200'
                        }`}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-xs font-bold text-mainText mb-1">
                    Description / Subtitle
                  </label>
                  <input
                    type="text"
                    value={categoryForm.description}
                    onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                    placeholder="e.g. Chakki fresh atta, basmati rice, poha & grains"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-xs"
                  />
                </div>

                {/* Modal Actions */}
                <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={() => setIsCategoryModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl text-gray-600 hover:bg-gray-100 font-semibold text-xs transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-dark text-white font-bold text-xs shadow-sm transition-all flex items-center gap-1.5"
                  >
                    <Save size={15} />
                    <span>{editingCategoryId ? 'Save Category Changes' : 'Create Category'}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default Admin;
