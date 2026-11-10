import React, { createContext, useState, useEffect, useCallback } from 'react';
import { storeConfig as defaultStoreConfig } from '../data/storeConfig';
import { initialProducts } from '../data/products';
import { categories as defaultCategories } from '../data/categories';
import { supabase, isSupabaseConfigured } from '../services/supabaseClient';

export const StoreContext = createContext(null);

// Legacy local storage keys to wipe clean from browser
const LEGACY_STORAGE_KEYS = [
  'dukaan_custom_store_config_v2',
  'dukaan_custom_products_v2',
  'dukaan_custom_categories_v2',
  'dukaan_custom_offers_v2',
  'dukaan_admin_pin_v2',
  'dukaan_custom_about_v2',
  'dukaan_orders_history_v2',
  'dukaan_custom_store_config',
  'dukaan_custom_products',
  'dukaan_custom_categories',
  'dukaan_custom_offers',
];

const defaultOfferSettings = {
  badge: 'Special Kirana Savings',
  title: 'Save Up To 25% On Monthly Grocery Staples!',
  subtitle: 'Wholesale bundle discounts on Aashirvaad Atta, Tata Sampann Dals, Fortune Oil & daily dairy.',
  discountText: 'Up to 25% OFF',
};

const defaultAboutSettings = {
  heroTitle: 'Serving Our Neighborhood with Trust & Purity',
  heroSubtitle: 'Dedicated to bringing traditional Kirana values into the digital era — fresh staples, fair rates, and direct convenience.',
  storyBadge: 'Our Heritage',
  storyTitle: 'Bringing the Best Grocery Staples to Every Household',
  storyParagraph1: "For years, local Kirana stores have been the heartbeat of Indian neighborhoods. We know your family's favorite tea, which atta makes the softest chapatis, and how important purity is when buying dal and mustard oil.",
  storyParagraph2: 'We make it effortless for you to order your daily groceries directly online without complex checkout forms. We prepare your order with care and deliver it straight to your doorstep.',
  storyImage: 'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?auto=format&fit=crop&w=800&q=80',
  stat1: '2,000+ Happy Families',
  stat2: '100% Genuine Quality',
};

// Helper: normalize product between Supabase and React state
const normalizeProduct = (item) => ({
  id: item.id,
  name: item.name,
  hindiName: item.hindiName ?? item.hindi_name ?? '',
  brand: item.brand || '',
  category: item.category || '',
  image: item.image || '',
  inStock: item.inStock ?? item.in_stock ?? true,
  isFeatured: item.isFeatured ?? item.is_featured ?? false,
  isBestOffer: item.isBestOffer ?? item.is_best_offer ?? false,
  description: item.description || '',
  price: item.price != null && item.price !== '' ? Number(item.price) : undefined,
  originalPrice: item.originalPrice != null && item.originalPrice !== ''
    ? Number(item.originalPrice)
    : item.original_price != null && item.original_price !== ''
    ? Number(item.original_price)
    : undefined,
  unit: item.unit || undefined,
  variants: item.variants || undefined,
});

// Helper: prepare product for DB insertion/update
const toDbProduct = (p) => ({
  id: p.id,
  name: p.name,
  hindiName: p.hindiName || '',
  brand: p.brand || '',
  category: p.category || '',
  image: p.image || '',
  inStock: p.inStock !== false,
  isFeatured: Boolean(p.isFeatured),
  isBestOffer: Boolean(p.isBestOffer),
  description: p.description || '',
  price: p.price != null && p.price !== '' ? Number(p.price) : null,
  originalPrice: p.originalPrice != null && p.originalPrice !== '' ? Number(p.originalPrice) : null,
  unit: p.unit || null,
  variants: p.variants && p.variants.length > 0 ? p.variants : null,
});

// Helper: normalize category
const normalizeCategory = (cat) => ({
  id: cat.id,
  name: cat.name,
  hindiName: cat.hindiName ?? cat.hindi_name ?? '',
  icon: cat.icon || '',
  image: cat.image || '',
  description: cat.description || '',
  itemCount: cat.itemCount ?? cat.item_count ?? '',
});

// Helper: normalize order
const normalizeOrder = (ord) => ({
  id: ord.id || ord.orderId,
  orderId: ord.orderId || ord.id,
  customerName: ord.customerName ?? ord.customer_name ?? (ord.customer?.name || 'Customer'),
  customerPhone: ord.customerPhone ?? ord.customer_phone ?? (ord.customer?.phone || ''),
  customerAddress: ord.customerAddress ?? ord.customer_address ?? (ord.customer?.address || ''),
  customerLandmark: ord.customerLandmark ?? ord.customer_landmark ?? (ord.customer?.landmark || ''),
  orderType: ord.orderType ?? ord.order_type ?? 'delivery',
  orderNote: ord.orderNote ?? ord.order_note ?? '',
  subtotal: Number(ord.subtotal || 0),
  deliveryFee: Number(ord.deliveryFee ?? ord.delivery_fee ?? 0),
  total: Number(ord.total || 0),
  items: ord.items || [],
  status: ord.status || 'pending',
  createdAt: ord.created_at || ord.createdAt || new Date().toISOString(),
});

export function StoreProvider({ children }) {
  // Connection and loading status
  const [isCloudConnected, setIsCloudConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Authenticated Shopkeeper User (via official Supabase Auth)
  const [currentUser, setCurrentUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Store States (Primary Single Source of Truth = Supabase Cloud)
  const [storeConfig, setStoreConfig] = useState(defaultStoreConfig);
  const [products, setProducts] = useState(initialProducts);
  const [categories, setCategories] = useState(defaultCategories);
  const [offerSettings, setOfferSettings] = useState(defaultOfferSettings);
  const [aboutSettings, setAboutSettings] = useState(defaultAboutSettings);
  const [orders, setOrders] = useState([]);

  // --- ONE-TIME CLEANUP: WIPE OBSOLETE LOCAL STORAGE KEYS ---
  useEffect(() => {
    try {
      LEGACY_STORAGE_KEYS.forEach((key) => localStorage.removeItem(key));
    } catch (e) {}
  }, []);

  // --- LISTEN TO SUPABASE AUTH STATE ---
  useEffect(() => {
    if (!supabase || !isSupabaseConfigured) {
      setAuthLoading(false);
      return;
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      setCurrentUser(session?.user ?? null);
      setAuthLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setCurrentUser(session?.user ?? null);
      setAuthLoading(false);
    });

    return () => {
      subscription?.unsubscribe?.();
    };
  }, []);

  // --- FETCH CLOUD DATA FROM SUPABASE ON MOUNT ---
  const fetchCloudData = useCallback(async () => {
    if (!supabase || !isSupabaseConfigured) {
      setIsLoading(false);
      return;
    }

    try {
      // 1. Fetch store_settings
      const { data: settingsData, error: settingsError } = await supabase
        .from('store_settings')
        .select('*')
        .eq('id', 'default')
        .maybeSingle();

      if (settingsData && !settingsError) {
        setIsCloudConnected(true);
        if (settingsData.storeConfig) setStoreConfig(settingsData.storeConfig);
        if (settingsData.offerSettings) setOfferSettings(settingsData.offerSettings);
        if (settingsData.aboutSettings) setAboutSettings(settingsData.aboutSettings);
      }

      // 2. Fetch categories
      const { data: catData, error: catError } = await supabase
        .from('categories')
        .select('*')
        .order('display_order', { ascending: true });

      if (catData && !catError && catData.length > 0) {
        setIsCloudConnected(true);
        setCategories(catData.map(normalizeCategory));
      }

      // 3. Fetch products
      const { data: prodData, error: prodError } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (prodData && !prodError && prodData.length > 0) {
        setIsCloudConnected(true);
        setProducts(prodData.map(normalizeProduct));
      }

      // 4. Fetch orders (Only accessible when authenticated)
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      if (orderData && !orderError) {
        setOrders(orderData.map(normalizeOrder));
      }
    } catch (err) {
      console.warn('Supabase fetch:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCloudData();
  }, [fetchCloudData]);

  // Fetch orders when shopkeeper logs in
  useEffect(() => {
    if (currentUser && supabase && isSupabaseConfigured) {
      supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100)
        .then(({ data, error }) => {
          if (data && !error) {
            setOrders(data.map(normalizeOrder));
          }
        });
    }
  }, [currentUser]);

  // --- REALTIME SUBSCRIPTIONS (LIVE SYNC ACROSS ALL DEVICES) ---
  useEffect(() => {
    if (!supabase || !isSupabaseConfigured) return;

    // Realtime products channel
    const productChannel = supabase
      .channel('realtime:products')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'products' },
        (payload) => {
          setIsCloudConnected(true);
          if (payload.eventType === 'INSERT') {
            const newProd = normalizeProduct(payload.new);
            setProducts((prev) => {
              if (prev.some((p) => p.id === newProd.id)) return prev;
              return [newProd, ...prev];
            });
          } else if (payload.eventType === 'UPDATE') {
            const updated = normalizeProduct(payload.new);
            setProducts((prev) =>
              prev.map((p) => (p.id === updated.id ? updated : p))
            );
          } else if (payload.eventType === 'DELETE') {
            const deletedId = payload.old.id;
            setProducts((prev) => prev.filter((p) => p.id !== deletedId));
          }
        }
      )
      .subscribe();

    // Realtime store_settings channel
    const settingsChannel = supabase
      .channel('realtime:store_settings')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'store_settings' },
        (payload) => {
          setIsCloudConnected(true);
          if (payload.new && payload.new.id === 'default') {
            if (payload.new.storeConfig) setStoreConfig(payload.new.storeConfig);
            if (payload.new.offerSettings) setOfferSettings(payload.new.offerSettings);
            if (payload.new.aboutSettings) setAboutSettings(payload.new.aboutSettings);
          }
        }
      )
      .subscribe();

    // Realtime categories channel
    const categoriesChannel = supabase
      .channel('realtime:categories')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'categories' },
        (payload) => {
          setIsCloudConnected(true);
          if (payload.eventType === 'INSERT') {
            const newCat = normalizeCategory(payload.new);
            setCategories((prev) => {
              if (prev.some((c) => c.id === newCat.id)) return prev;
              return [...prev, newCat];
            });
          } else if (payload.eventType === 'UPDATE') {
            const updated = normalizeCategory(payload.new);
            setCategories((prev) =>
              prev.map((c) => (c.id === updated.id ? updated : c))
            );
          } else if (payload.eventType === 'DELETE') {
            const deletedId = payload.old.id;
            setCategories((prev) => prev.filter((c) => c.id !== deletedId));
          }
        }
      )
      .subscribe();

    // Realtime orders channel
    const ordersChannel = supabase
      .channel('realtime:orders')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'orders' },
        (payload) => {
          setIsCloudConnected(true);
          if (payload.eventType === 'INSERT') {
            const newOrd = normalizeOrder(payload.new);
            setOrders((prev) => [newOrd, ...prev.filter((o) => o.id !== newOrd.id)]);
          } else if (payload.eventType === 'UPDATE') {
            const updated = normalizeOrder(payload.new);
            setOrders((prev) =>
              prev.map((o) => (o.id === updated.id ? updated : o))
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(productChannel);
      supabase.removeChannel(settingsChannel);
      supabase.removeChannel(categoriesChannel);
      supabase.removeChannel(ordersChannel);
    };
  }, []);

  // --- AUTH METHODS (BANK-GRADE SECURE) ---
  const loginShopkeeper = async (email, password) => {
    if (!supabase || !isSupabaseConfigured) {
      throw new Error('Supabase client is not connected.');
    }
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password: password.trim(),
    });
    if (error) throw error;
    setCurrentUser(data.user);
    return data;
  };

  const logoutShopkeeper = async () => {
    if (supabase) {
      await supabase.auth.signOut();
    }
    setCurrentUser(null);
  };

  const updateShopkeeperPassword = async (newPassword) => {
    if (!supabase || !isSupabaseConfigured) {
      throw new Error('Supabase client is not connected.');
    }
    const { data, error } = await supabase.auth.updateUser({
      password: newPassword.trim(),
    });
    if (error) throw error;
    return data;
  };

  // --- ABOUT SETTINGS ---
  const updateAboutSettings = async (updated) => {
    const merged = { ...aboutSettings, ...updated };
    setAboutSettings(merged);

    if (supabase && isSupabaseConfigured) {
      try {
        await supabase.from('store_settings').upsert({
          id: 'default',
          aboutSettings: merged,
          updated_at: new Date().toISOString(),
        });
      } catch (err) {
        console.error('Supabase updateAboutSettings failed:', err);
      }
    }
  };

  // --- CRUD ACTIONS FOR STORE CONFIG ---
  const updateStoreConfig = async (updatedFields) => {
    const newConfig = {
      ...storeConfig,
      ...updatedFields,
      address: {
        ...storeConfig.address,
        ...(updatedFields.address || {}),
      },
      delivery: {
        ...storeConfig.delivery,
        ...(updatedFields.delivery || {}),
      },
      openingHours: {
        ...storeConfig.openingHours,
        ...(updatedFields.openingHours || {}),
      },
    };
    setStoreConfig(newConfig);

    if (supabase && isSupabaseConfigured) {
      try {
        await supabase.from('store_settings').upsert({
          id: 'default',
          storeConfig: newConfig,
          updated_at: new Date().toISOString(),
        });
      } catch (err) {
        console.error('Supabase updateStoreConfig failed:', err);
      }
    }
  };

  // --- CRUD ACTIONS FOR PRODUCTS ---
  const addProduct = async (newProduct) => {
    const id = newProduct.id || 'prod-' + Date.now();
    const productWithId = { ...newProduct, id };
    setProducts((prev) => [productWithId, ...prev]);

    if (supabase && isSupabaseConfigured) {
      try {
        const { error } = await supabase
          .from('products')
          .insert([toDbProduct(productWithId)]);
        if (error) console.error('Supabase addProduct failed:', error);
      } catch (err) {
        console.error('Supabase addProduct exception:', err);
      }
    }
    return productWithId;
  };

  const updateProduct = async (id, updatedFields) => {
    setProducts((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updatedFields } : item))
    );

    if (supabase && isSupabaseConfigured) {
      try {
        const current = products.find((p) => p.id === id) || {};
        const merged = { ...current, ...updatedFields, id };
        const { error } = await supabase
          .from('products')
          .update(toDbProduct(merged))
          .eq('id', id);
        if (error) console.error('Supabase updateProduct failed:', error);
      } catch (err) {
        console.error('Supabase updateProduct exception:', err);
      }
    }
  };

  const deleteProduct = async (id) => {
    setProducts((prev) => prev.filter((item) => item.id !== id));

    if (supabase && isSupabaseConfigured) {
      try {
        const { error } = await supabase.from('products').delete().eq('id', id);
        if (error) console.error('Supabase deleteProduct failed:', error);
      } catch (err) {
        console.error('Supabase deleteProduct exception:', err);
      }
    }
  };

  // --- CRUD ACTIONS FOR CATEGORIES ---
  const addCategory = async (newCategory) => {
    const id = newCategory.id || ('cat-' + Date.now());
    const catWithId = {
      id,
      name: newCategory.name,
      hindiName: newCategory.hindiName || '',
      icon: newCategory.icon || '🛍️',
      image: newCategory.image || 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=400&q=80',
      description: newCategory.description || '',
      itemCount: '0 Items',
      display_order: categories.length,
    };

    setCategories((prev) => [...prev, catWithId]);

    if (supabase && isSupabaseConfigured) {
      try {
        const { error } = await supabase.from('categories').upsert({
          id: catWithId.id,
          name: catWithId.name,
          hindiName: catWithId.hindiName,
          icon: catWithId.icon,
          image: catWithId.image,
          description: catWithId.description,
          display_order: catWithId.display_order,
        });
        if (error) console.error('Supabase addCategory failed:', error);
      } catch (err) {
        console.error('Supabase addCategory exception:', err);
      }
    }
    return catWithId;
  };

  const updateCategory = async (id, updatedFields) => {
    setCategories((prev) =>
      prev.map((cat) => (cat.id === id ? { ...cat, ...updatedFields } : cat))
    );

    if (supabase && isSupabaseConfigured) {
      try {
        const existing = categories.find((c) => c.id === id) || {};
        const merged = { ...existing, ...updatedFields };
        const { error } = await supabase.from('categories').upsert({
          id,
          name: merged.name,
          hindiName: merged.hindiName || '',
          icon: merged.icon || '🛍️',
          image: merged.image || '',
          description: merged.description || '',
          itemCount: merged.itemCount || '',
          display_order: merged.display_order ?? 0,
        });
        if (error) console.error('Supabase updateCategory failed:', error);
      } catch (err) {
        console.error('Supabase updateCategory exception:', err);
      }
    }
  };

  const deleteCategory = async (id) => {
    setCategories((prev) => prev.filter((cat) => cat.id !== id));

    if (supabase && isSupabaseConfigured) {
      try {
        const { error } = await supabase.from('categories').delete().eq('id', id);
        if (error) console.error('Supabase deleteCategory failed:', error);
      } catch (err) {
        console.error('Supabase deleteCategory exception:', err);
      }
    }
  };

  // --- CRUD ACTIONS FOR OFFERS ---
  const updateOfferSettings = async (updated) => {
    const merged = { ...offerSettings, ...updated };
    setOfferSettings(merged);

    if (supabase && isSupabaseConfigured) {
      try {
        await supabase.from('store_settings').upsert({
          id: 'default',
          offerSettings: merged,
          updated_at: new Date().toISOString(),
        });
      } catch (err) {
        console.error('Supabase updateOfferSettings failed:', err);
      }
    }
  };

  // --- ORDER MANAGEMENT ---
  const createOrder = async (orderPayload) => {
    const orderId = orderPayload.orderId || `ORD-${Date.now()}`;
    const orderItem = {
      id: orderId,
      orderId: orderId,
      customerName: orderPayload.customer?.name || '',
      customerPhone: orderPayload.customer?.phone || '',
      customerAddress: orderPayload.customer?.address || '',
      customerLandmark: orderPayload.customer?.landmark || '',
      orderType: orderPayload.orderType || 'delivery',
      orderNote: orderPayload.orderNote || '',
      subtotal: Number(orderPayload.subtotal || 0),
      deliveryFee: Number(orderPayload.deliveryFee || 0),
      total: Number(orderPayload.total || 0),
      items: orderPayload.items || [],
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    setOrders((prev) => [orderItem, ...prev.filter((o) => o.id !== orderId)]);

    if (supabase && isSupabaseConfigured) {
      try {
        await supabase.from('orders').insert([{
          id: orderItem.id,
          orderId: orderItem.orderId,
          customerName: orderItem.customerName,
          customerPhone: orderItem.customerPhone,
          customerAddress: orderItem.customerAddress,
          customerLandmark: orderItem.customerLandmark,
          orderType: orderItem.orderType,
          orderNote: orderItem.orderNote,
          subtotal: orderItem.subtotal,
          deliveryFee: orderItem.deliveryFee,
          total: orderItem.total,
          items: orderItem.items,
          status: orderItem.status,
          created_at: orderItem.createdAt,
        }]);
      } catch (err) {
        console.error('Supabase createOrder failed:', err);
      }
    }
    return orderItem;
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );

    if (supabase && isSupabaseConfigured) {
      try {
        await supabase
          .from('orders')
          .update({ status: newStatus })
          .eq('id', orderId);
      } catch (err) {
        console.error('Supabase updateOrderStatus failed:', err);
      }
    }
  };

  // --- RESET ALL DATA TO DEMO DEFAULTS IN SUPABASE ---
  const resetToDefaultData = async () => {
    setStoreConfig(defaultStoreConfig);
    setProducts(initialProducts);
    setCategories(defaultCategories);
    setOfferSettings(defaultOfferSettings);
    setAboutSettings(defaultAboutSettings);
    setOrders([]);

    if (supabase && isSupabaseConfigured) {
      try {
        await supabase.from('store_settings').upsert({
          id: 'default',
          storeConfig: defaultStoreConfig,
          offerSettings: defaultOfferSettings,
          aboutSettings: defaultAboutSettings,
          updated_at: new Date().toISOString(),
        });
      } catch (err) {
        console.error('Supabase reset sync failed:', err);
      }
    }
  };

  const value = {
    isCloudConnected,
    isLoading,
    authLoading,
    currentUser,
    loginShopkeeper,
    logoutShopkeeper,
    updateShopkeeperPassword,
    fetchCloudData,
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
    orders,
    createOrder,
    updateOrderStatus,
    resetToDefaultData,
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export default StoreContext;
