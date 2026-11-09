/**
 * Grocery Products Data with Variant Support
 * 
 * Each product can have:
 * - Direct unit & price
 * - OR a `variants` array (e.g. 250g, 500g, 1kg, 5kg) with custom prices
 */

export const initialProducts = [
  // 1. Atta & Rice
  {
    id: "prod-sugar",
    name: "Madhur Pure & Hygienic Sulfurless Sugar (चीनी)",
    hindiName: "शुद्ध सल्फर-मुक्त चीनी",
    brand: "Madhur",
    category: "atta-rice",
    image: "https://images.unsplash.com/photo-1581441363689-1f3c3c414635?auto=format&fit=crop&w=500&q=80",
    inStock: true,
    isFeatured: true,
    isBestOffer: true,
    description: "Refined 100% pure crystal white sulfur-free sugar for tea, sweets, and everyday cooking.",
    variants: [
      { id: "sug-250g", unit: "250 g", price: 15, originalPrice: 18 },
      { id: "sug-500g", unit: "500 g", price: 28, originalPrice: 32 },
      { id: "sug-1kg", unit: "1 kg", price: 52, originalPrice: 60 },
      { id: "sug-5kg", unit: "5 kg", price: 250, originalPrice: 290 }
    ]
  },
  {
    id: "prod-1",
    name: "Aashirvaad Shudh Chakki Whole Wheat Atta",
    hindiName: "आशीर्वाद शुद्ध चक्की आटा",
    brand: "Aashirvaad",
    category: "atta-rice",
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=500&q=80",
    inStock: true,
    isFeatured: true,
    isBestOffer: true,
    description: "100% whole wheat grains processed with 40-step quality check for soft rotis.",
    variants: [
      { id: "atta-1kg", unit: "1 kg", price: 55, originalPrice: 62 },
      { id: "atta-5kg", unit: "5 kg", price: 245, originalPrice: 280 },
      { id: "atta-10kg", unit: "10 kg", price: 475, originalPrice: 540 }
    ]
  },
  {
    id: "prod-2",
    name: "India Gate Basmati Rice Feast Rozzana",
    hindiName: "इंडिया गेट बासमती चावल",
    brand: "India Gate",
    category: "atta-rice",
    image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=500&q=80",
    inStock: true,
    isFeatured: true,
    isBestOffer: false,
    description: "Long grain aromatic basmati rice ideal for daily biryani, pulao, and steamed rice.",
    variants: [
      { id: "rice-1kg", unit: "1 kg", price: 110, originalPrice: 135 },
      { id: "rice-5kg", unit: "5 kg", price: 520, originalPrice: 640 }
    ]
  },
  {
    id: "prod-3",
    name: "Fortune Traditional Thick Poha (Flattened Rice)",
    hindiName: "फार्च्यून मोटा पोहा",
    brand: "Fortune",
    category: "atta-rice",
    unit: "500 g",
    originalPrice: 55,
    price: 45,
    image: "https://images.unsplash.com/photo-1627993041926-3843588960fa?auto=format&fit=crop&w=500&q=80",
    inStock: true,
    isFeatured: false,
    isBestOffer: false,
    description: "Healthy and fluffy flattened rice, rich in dietary fiber for morning breakfast."
  },
  {
    id: "prod-4",
    name: "Rajdhani Fine Sooji (Rava)",
    hindiName: "राजधानी बारीक सूजी",
    brand: "Rajdhani",
    category: "atta-rice",
    unit: "500 g",
    originalPrice: 42,
    price: 36,
    image: "https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?auto=format&fit=crop&w=500&q=80",
    inStock: true,
    isFeatured: false,
    isBestOffer: false,
    description: "Crispy and light granulated wheat semolina for delicious halwa, upma, and idli."
  },

  // 2. Dal & Pulses
  {
    id: "prod-5",
    name: "Tata Sampann Unpolished Toor Dal (Arhar)",
    hindiName: "टाटा सम्पन्न अरहर दाल",
    brand: "Tata Sampann",
    category: "dal-pulses",
    image: "https://images.unsplash.com/photo-1596797882870-8c33deeac224?auto=format&fit=crop&w=500&q=80",
    inStock: true,
    isFeatured: true,
    isBestOffer: true,
    description: "Naturally protein rich, unpolished toor dal that retains essential nutritional value.",
    variants: [
      { id: "toor-500g", unit: "500 g", price: 88, originalPrice: 102 },
      { id: "toor-1kg", unit: "1 kg", price: 168, originalPrice: 195 },
      { id: "toor-2kg", unit: "2 kg", price: 330, originalPrice: 385 }
    ]
  },
  {
    id: "prod-6",
    name: "Tata Sampann Premium Chana Dal",
    hindiName: "चना दाल",
    brand: "Tata Sampann",
    category: "dal-pulses",
    unit: "1 kg",
    originalPrice: 120,
    price: 104,
    image: "https://images.unsplash.com/photo-1585994192701-79b8c06782ff?auto=format&fit=crop&w=500&q=80",
    inStock: true,
    isFeatured: false,
    isBestOffer: false,
    description: "Clean unpolished chickpeas split dal, delicious for tadka and snacks."
  },
  {
    id: "prod-7",
    name: "Special Desi Chitra Rajma (Kidney Beans)",
    hindiName: "चित्रा राजमा",
    brand: "Local Select",
    category: "dal-pulses",
    unit: "500 g",
    originalPrice: 90,
    price: 78,
    image: "https://images.unsplash.com/photo-1551462147-37885acc36f1?auto=format&fit=crop&w=500&q=80",
    inStock: true,
    isFeatured: true,
    isBestOffer: false,
    description: "Premium grade melting soft Kashmiri chitra rajma for authentic curry."
  },
  {
    id: "prod-8",
    name: "Moong Dal Dhuli (Yellow Split)",
    hindiName: "मूंग दाल धुली",
    brand: "Local Select",
    category: "dal-pulses",
    unit: "1 kg",
    originalPrice: 145,
    price: 130,
    image: "https://images.unsplash.com/photo-1515543237350-b3eea1ec8082?auto=format&fit=crop&w=500&q=80",
    inStock: true,
    isFeatured: false,
    isBestOffer: false,
    description: "Light and easily digestible yellow split lentils for khichdi and soups."
  },

  // 3. Oil & Ghee
  {
    id: "prod-9",
    name: "Fortune Sunlite Refined Sunflower Oil",
    hindiName: "फार्च्यून सनफ्लावर तेल",
    brand: "Fortune",
    category: "oil-ghee",
    image: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=500&q=80",
    inStock: true,
    isFeatured: true,
    isBestOffer: true,
    description: "Enriched with Vitamins A & D, light and heart-healthy cooking oil.",
    variants: [
      { id: "oil-1l", unit: "1 L Pouch", price: 138, originalPrice: 160 },
      { id: "oil-5l", unit: "5 L Can", price: 675, originalPrice: 780 }
    ]
  },
  {
    id: "prod-10",
    name: "Amul Pure Cow Ghee Tin",
    hindiName: "अमुल शुद्ध गाय का घी",
    brand: "Amul",
    category: "oil-ghee",
    image: "https://images.unsplash.com/photo-1628088062854-d1870b4553da?auto=format&fit=crop&w=500&q=80",
    inStock: true,
    isFeatured: true,
    isBestOffer: false,
    description: "Aromatic golden granular pure cow ghee for dal tadka, sweets, and parathas.",
    variants: [
      { id: "ghee-500ml", unit: "500 ml", price: 315, originalPrice: 340 },
      { id: "ghee-1l", unit: "1 L", price: 615, originalPrice: 660 }
    ]
  },
  {
    id: "prod-11",
    name: "Engine Kacchi Ghani Mustard Oil (Sarson Tel)",
    hindiName: "इंजन कच्ची घानी सरसों तेल",
    brand: "Engine",
    category: "oil-ghee",
    unit: "1 L",
    originalPrice: 175,
    price: 154,
    image: "https://images.unsplash.com/photo-1543168256-418811576931?auto=format&fit=crop&w=500&q=80",
    inStock: true,
    isFeatured: false,
    isBestOffer: false,
    description: "Traditional strong pungency cold pressed mustard oil for authentic Indian cooking."
  },

  // 4. Dairy Products
  {
    id: "prod-12",
    name: "Amul Taaza Homogenised Toned Milk",
    hindiName: "अमुल ताज़ा टोंड दूध",
    brand: "Amul",
    category: "dairy-products",
    image: "https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=500&q=80",
    inStock: true,
    isFeatured: true,
    isBestOffer: false,
    description: "Long life fresh toned milk, free of bacteria, no boiling required before drinking.",
    variants: [
      { id: "milk-500ml", unit: "500 ml", price: 38, originalPrice: 40 },
      { id: "milk-1l", unit: "1 L Tetra", price: 72, originalPrice: 75 }
    ]
  },
  {
    id: "prod-13",
    name: "Amul Pasteurised Butter",
    hindiName: "अमुल मक्खन",
    brand: "Amul",
    category: "dairy-products",
    image: "https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?auto=format&fit=crop&w=500&q=80",
    inStock: true,
    isFeatured: true,
    isBestOffer: false,
    description: "Utterly butterly delicious creamy salted dairy butter for toast and cooking.",
    variants: [
      { id: "butter-100g", unit: "100 g", price: 58, originalPrice: 60 },
      { id: "butter-500g", unit: "500 g", price: 275, originalPrice: 285 }
    ]
  },
  {
    id: "prod-14",
    name: "Mother Dairy Fresh Malai Paneer",
    hindiName: "मदर डेयरी ताज़ा पनीर",
    brand: "Mother Dairy",
    category: "dairy-products",
    unit: "200 g",
    originalPrice: 95,
    price: 88,
    image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=500&q=80",
    inStock: true,
    isFeatured: false,
    isBestOffer: false,
    description: "Super soft and juicy cottage cheese cubes, rich in calcium and milk protein."
  },

  // 5. Snacks & Biscuits
  {
    id: "prod-15",
    name: "Parle-G Gold Gluco Biscuits Value Pack",
    hindiName: "पारले-जी गोल्ड बिस्कुट",
    brand: "Parle",
    category: "snacks-biscuits",
    unit: "1 kg",
    originalPrice: 140,
    price: 120,
    image: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&w=500&q=80",
    inStock: true,
    isFeatured: true,
    isBestOffer: true,
    description: "India's beloved glucose biscuit with more milk and wheat goodness."
  },
  {
    id: "prod-16",
    name: "Haldiram's Nagpur Aloo Bhujia",
    hindiName: "हल्दीराम आलू भुजिया",
    brand: "Haldiram's",
    category: "snacks-biscuits",
    unit: "400 g",
    originalPrice: 115,
    price: 99,
    image: "https://images.unsplash.com/photo-1566478989037-eec170784d0b?auto=format&fit=crop&w=500&q=80",
    inStock: true,
    isFeatured: true,
    isBestOffer: false,
    description: "Crispy fried potato strings tossed with tangy and spicy mint seasoning."
  },
  {
    id: "prod-17",
    name: "Maggi 2-Minute Masala Instant Noodles",
    hindiName: "मैगी मसाला नूडल्स",
    brand: "Nestle",
    category: "snacks-biscuits",
    unit: "Pack of 4 (280g)",
    originalPrice: 60,
    price: 54,
    image: "https://images.unsplash.com/photo-1612927601601-6638404737ce?auto=format&fit=crop&w=500&q=80",
    inStock: true,
    isFeatured: true,
    isBestOffer: false,
    description: "Favorite taste masala noodles made with 10 blend spices and wheat noodles."
  },

  // 6. Beverages
  {
    id: "prod-18",
    name: "Tata Tea Gold Leaf & Long Leaves Tea",
    hindiName: "टाटा टी गोल्ड चाय",
    brand: "Tata",
    category: "beverages",
    unit: "500 g",
    originalPrice: 340,
    price: 299,
    image: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=500&q=80",
    inStock: true,
    isFeatured: true,
    isBestOffer: true,
    description: "Rich taste of Assam tea with gently rolled aromatic long leaves."
  },
  {
    id: "prod-19",
    name: "Nescafe Classic 100% Pure Instant Coffee",
    hindiName: "नेस्कैफे क्लासिक कॉफी",
    brand: "Nescafe",
    category: "beverages",
    unit: "100 g Jar",
    originalPrice: 350,
    price: 315,
    image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=500&q=80",
    inStock: true,
    isFeatured: false,
    isBestOffer: false,
    description: "Rich aroma and distinctive full taste from carefully selected roasted coffee beans."
  },

  // 7. Personal Care
  {
    id: "prod-20",
    name: "Dettol Original Germ Protection Bathing Soap",
    hindiName: "डेटॉल बाथिंग सोप",
    brand: "Dettol",
    category: "personal-care",
    unit: "Buy 4 Get 1 Free (5x125g)",
    originalPrice: 220,
    price: 189,
    image: "https://images.unsplash.com/photo-1607006314640-5e87a206a2e4?auto=format&fit=crop&w=500&q=80",
    inStock: true,
    isFeatured: true,
    isBestOffer: true,
    description: "100% proven germ protection soap with soothing pine fragrance for complete family hygiene."
  },
  {
    id: "prod-21",
    name: "Colgate Strong Teeth Dental Cream Toothpaste",
    hindiName: "कोलगेट टूथपेस्ट",
    brand: "Colgate",
    category: "personal-care",
    unit: "500 g Value Saver",
    originalPrice: 240,
    price: 205,
    image: "https://images.unsplash.com/photo-1559599101-f09722fb4948?auto=format&fit=crop&w=500&q=80",
    inStock: true,
    isFeatured: false,
    isBestOffer: false,
    description: "With amino power formula that adds natural calcium to make teeth 2x stronger."
  },

  // 8. Household Essentials
  {
    id: "prod-22",
    name: "Surf Excel Quick Wash Detergent Powder",
    hindiName: "सर्फ एक्सेल डिटर्जेंट पाउडर",
    brand: "Surf Excel",
    category: "household-essentials",
    unit: "1 kg",
    originalPrice: 155,
    price: 135,
    image: "https://images.unsplash.com/photo-1585421514738-01798e348b17?auto=format&fit=crop&w=500&q=80",
    inStock: true,
    isFeatured: true,
    isBestOffer: false,
    description: "Dissolves fast and removes tough stains easily with X-tra clean particles."
  },
  {
    id: "prod-23",
    name: "Vim Lemon Dishwash Gel Bottle",
    hindiName: "विम डिशवॉश जेल",
    brand: "Vim",
    category: "household-essentials",
    unit: "750 ml",
    originalPrice: 190,
    price: 165,
    image: "https://images.unsplash.com/photo-1584813470613-5b1c1cad3d69?auto=format&fit=crop&w=500&q=80",
    inStock: true,
    isFeatured: false,
    isBestOffer: false,
    description: "Power of 100 lemons cleans grease easily without leaving any white residue."
  },
  {
    id: "prod-24",
    name: "Cycle Pure Agarbatti Yagna Incense Sticks",
    hindiName: "साइकिल अगरबत्ती",
    brand: "Cycle Pure",
    category: "household-essentials",
    unit: "Pack of 2 (250g)",
    originalPrice: 130,
    price: 110,
    image: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=500&q=80",
    inStock: true,
    isFeatured: false,
    isBestOffer: false,
    description: "Traditional aromatic herbal agarbatti for daily morning and evening pooja."
  }
];

export const products = initialProducts;
export default products;
