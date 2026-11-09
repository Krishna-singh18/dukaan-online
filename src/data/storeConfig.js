/**
 * Store Configuration System
 * 
 * Update this file to customize shop details for different clients
 * without modifying any UI components.
 */

export const storeConfig = {
  // Store Identity
  name: import.meta.env.VITE_STORE_NAME || "Apna Kirana Store",
  tagline: "Shuddh, Taaza aur Bharosemand Daily Essentials",
  logoText: import.meta.env.VITE_STORE_NAME || "Apna Kirana",
  logoSubtext: "DIGITAL KIRANA STORE",
  badge: "Trusted Neighborhood Kirana",
  ownerName: import.meta.env.VITE_STORE_OWNER || "Store Owner",
  
  // Contact & Social Details
  // Note: WhatsApp number with country code (e.g., '919153267217')
  whatsappNumber: import.meta.env.VITE_STORE_WHATSAPP || "919153267217",
  displayPhone: import.meta.env.VITE_STORE_PHONE || "+91 91532 67217",
  email: import.meta.env.VITE_STORE_EMAIL || "store@example.com",
  
  // Physical Location & Working Hours
  address: {
    shopNo: "Shop No. 12, Ground Floor",
    landmark: "Central Market",
    area: import.meta.env.VITE_STORE_AREA || "Vikas Nagar",
    city: import.meta.env.VITE_STORE_CITY || "New Delhi",
    pincode: "110018",
    state: "Delhi",
    fullAddress: `${import.meta.env.VITE_STORE_AREA || "Vikas Nagar"}, ${import.meta.env.VITE_STORE_CITY || "New Delhi"}`,
    mapsUrl: `https://maps.google.com/?q=${encodeURIComponent(import.meta.env.VITE_STORE_NAME || "Kirana Store")}`
  },
  
  openingHours: {
    days: "Monday - Sunday (All 7 Days)",
    timing: "7:00 AM - 10:00 PM",
    deliveryTiming: "8:00 AM - 9:00 PM"
  },
  
  // Delivery & Order Policies
  delivery: {
    isAvailable: true,
    freeDeliveryAbove: 299,
    deliveryFee: 30,
    estimatedTime: "30 - 45 Mins",
    minOrderAmount: 99,
    deliveryRadius: "Within 4 km radius",
    deliveryAreas: [
      "Sector 14 & 15",
      "Vikas Nagar",
      "Shanti Park",
      "Model Colony",
      "Shivaji Enclave"
    ]
  },
  
  // Store Value Propositions / Guarantees
  benefits: [
    {
      id: "fast-delivery",
      title: "Fast Local Delivery",
      description: "Delivered to your doorstep within 45 minutes"
    },
    {
      id: "pure-quality",
      title: "100% Authentic Quality",
      description: "Directly sourced grains, staples & fresh dairy"
    },
    {
      id: "best-prices",
      title: "Fair Kirana Pricing",
      description: "Daily wholesale rates with genuine discounts"
    },
    {
      id: "whatsapp-ordering",
      title: "Easy WhatsApp Ordering",
      description: "No complicated apps, direct order on chat"
    }
  ],
  
  // Social Links (Optional)
  social: {
    facebook: "https://facebook.com",
    instagram: "https://instagram.com",
    whatsappChannel: "https://whatsapp.com"
  }
};

export default storeConfig;

