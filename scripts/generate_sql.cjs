const fs = require('fs');
const { initialProducts } = require('../src/data/products.js');
const { categories } = require('../src/data/categories.js');
const { storeConfig } = require('../src/data/storeConfig.js');

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

let sql = '-- ========================================================\n';
sql += '-- DUKAAN ONLINE - SUPABASE DATABASE SCHEMA & SEED DATA\n';
sql += '-- Run this SQL in Supabase Dashboard -> SQL Editor -> Run\n';
sql += '-- ========================================================\n\n';

sql += '-- 1. CATEGORIES TABLE\n';
sql += 'CREATE TABLE IF NOT EXISTS categories (\n';
sql += '  id TEXT PRIMARY KEY,\n';
sql += '  name TEXT NOT NULL,\n';
sql += '  "hindiName" TEXT,\n';
sql += '  icon TEXT,\n';
sql += '  image TEXT,\n';
sql += '  description TEXT,\n';
sql += '  "itemCount" TEXT,\n';
sql += '  display_order INTEGER DEFAULT 0\n';
sql += ');\n\n';

sql += '-- 2. PRODUCTS TABLE\n';
sql += 'CREATE TABLE IF NOT EXISTS products (\n';
sql += '  id TEXT PRIMARY KEY,\n';
sql += '  name TEXT NOT NULL,\n';
sql += '  "hindiName" TEXT,\n';
sql += '  brand TEXT,\n';
sql += '  category TEXT,\n';
sql += '  image TEXT,\n';
sql += '  "inStock" BOOLEAN DEFAULT true,\n';
sql += '  "isFeatured" BOOLEAN DEFAULT false,\n';
sql += '  "isBestOffer" BOOLEAN DEFAULT false,\n';
sql += '  description TEXT,\n';
sql += '  price NUMERIC,\n';
sql += '  "originalPrice" NUMERIC,\n';
sql += '  unit TEXT,\n';
sql += '  variants JSONB,\n';
sql += '  created_at TIMESTAMPTZ DEFAULT timezone(\'utc\'::text, now())\n';
sql += ');\n\n';

sql += '-- 3. STORE SETTINGS TABLE\n';
sql += 'CREATE TABLE IF NOT EXISTS store_settings (\n';
sql += '  id TEXT PRIMARY KEY DEFAULT \'default\',\n';
sql += '  "storeConfig" JSONB,\n';
sql += '  "offerSettings" JSONB,\n';
sql += '  "aboutSettings" JSONB,\n';
sql += '  "adminPin" TEXT DEFAULT \'1234\',\n';
sql += '  updated_at TIMESTAMPTZ DEFAULT timezone(\'utc\'::text, now())\n';
sql += ');\n\n';

sql += '-- 4. ORDERS TABLE\n';
sql += 'CREATE TABLE IF NOT EXISTS orders (\n';
sql += '  id TEXT PRIMARY KEY,\n';
sql += '  "orderId" TEXT,\n';
sql += '  "customerName" TEXT,\n';
sql += '  "customerPhone" TEXT,\n';
sql += '  "customerAddress" TEXT,\n';
sql += '  "customerLandmark" TEXT,\n';
sql += '  "orderType" TEXT DEFAULT \'delivery\',\n';
sql += '  "orderNote" TEXT,\n';
sql += '  subtotal NUMERIC DEFAULT 0,\n';
sql += '  "deliveryFee" NUMERIC DEFAULT 0,\n';
sql += '  total NUMERIC DEFAULT 0,\n';
sql += '  items JSONB DEFAULT \'[]\'::jsonb,\n';
sql += '  status TEXT DEFAULT \'pending\',\n';
sql += '  created_at TIMESTAMPTZ DEFAULT timezone(\'utc\'::text, now())\n';
sql += ');\n\n';

sql += '-- ========================================================\n';
sql += '-- ROW LEVEL SECURITY (RLS) POLICIES\n';
sql += '-- ========================================================\n';
sql += 'ALTER TABLE categories ENABLE ROW LEVEL SECURITY;\n';
sql += 'ALTER TABLE products ENABLE ROW LEVEL SECURITY;\n';
sql += 'ALTER TABLE store_settings ENABLE ROW LEVEL SECURITY;\n';
sql += 'ALTER TABLE orders ENABLE ROW LEVEL SECURITY;\n\n';

sql += 'DROP POLICY IF EXISTS "Public categories access" ON categories;\n';
sql += 'CREATE POLICY "Public categories access" ON categories FOR ALL USING (true) WITH CHECK (true);\n\n';

sql += 'DROP POLICY IF EXISTS "Public products access" ON products;\n';
sql += 'CREATE POLICY "Public products access" ON products FOR ALL USING (true) WITH CHECK (true);\n\n';

sql += 'DROP POLICY IF EXISTS "Public store_settings access" ON store_settings;\n';
sql += 'CREATE POLICY "Public store_settings access" ON store_settings FOR ALL USING (true) WITH CHECK (true);\n\n';

sql += 'DROP POLICY IF EXISTS "Public orders access" ON orders;\n';
sql += 'CREATE POLICY "Public orders access" ON orders FOR ALL USING (true) WITH CHECK (true);\n\n';

sql += '-- ========================================================\n';
sql += '-- ENABLE REALTIME NOTIFICATIONS\n';
sql += '-- ========================================================\n';
sql += 'DO $$\n';
sql += 'BEGIN\n';
sql += '  ALTER PUBLICATION supabase_realtime ADD TABLE products;\n';
sql += 'EXCEPTION WHEN OTHERS THEN NULL;\n';
sql += 'END $$;\n\n';
sql += 'DO $$\n';
sql += 'BEGIN\n';
sql += '  ALTER PUBLICATION supabase_realtime ADD TABLE store_settings;\n';
sql += 'EXCEPTION WHEN OTHERS THEN NULL;\n';
sql += 'END $$;\n\n';
sql += 'DO $$\n';
sql += 'BEGIN\n';
sql += '  ALTER PUBLICATION supabase_realtime ADD TABLE orders;\n';
sql += 'EXCEPTION WHEN OTHERS THEN NULL;\n';
sql += 'END $$;\n\n';

sql += '-- ========================================================\n';
sql += '-- SEED STORE SETTINGS\n';
sql += '-- ========================================================\n';
const configJson = JSON.stringify(storeConfig).replace(/'/g, "''");
const offerJson = JSON.stringify(defaultOfferSettings).replace(/'/g, "''");
const aboutJson = JSON.stringify(defaultAboutSettings).replace(/'/g, "''");

sql += `INSERT INTO store_settings (id, "storeConfig", "offerSettings", "aboutSettings", "adminPin")\nVALUES ('default', '${configJson}'::jsonb, '${offerJson}'::jsonb, '${aboutJson}'::jsonb, '1234')\nON CONFLICT (id) DO UPDATE SET\n  "storeConfig" = EXCLUDED."storeConfig",\n  "offerSettings" = EXCLUDED."offerSettings",\n  "aboutSettings" = EXCLUDED."aboutSettings",\n  updated_at = now();\n\n`;

sql += '-- ========================================================\n';
sql += '-- SEED CATEGORIES\n';
sql += '-- ========================================================\n';
categories.forEach((cat, idx) => {
  const esc = (s) => (s ? String(s).replace(/'/g, "''") : '');
  sql += `INSERT INTO categories (id, name, "hindiName", icon, image, description, "itemCount", display_order)\n`;
  sql += `VALUES ('${esc(cat.id)}', '${esc(cat.name)}', '${esc(cat.hindiName)}', '${esc(cat.icon)}', '${esc(cat.image)}', '${esc(cat.description)}', '${esc(cat.itemCount)}', ${idx})\n`;
  sql += `ON CONFLICT (id) DO NOTHING;\n`;
});
sql += '\n';

sql += '-- ========================================================\n';
sql += '-- SEED PRODUCTS\n';
sql += '-- ========================================================\n';
initialProducts.forEach((prod) => {
  const esc = (s) => (s ? String(s).replace(/'/g, "''") : '');
  const variantsJson = prod.variants ? JSON.stringify(prod.variants).replace(/'/g, "''") : null;
  const unitVal = prod.unit ? `'${esc(prod.unit)}'` : 'null';
  const priceVal = prod.price != null ? prod.price : 'null';
  const origPriceVal = prod.originalPrice != null ? prod.originalPrice : 'null';
  const varVal = variantsJson ? `'${variantsJson}'::jsonb` : 'null';

  sql += `INSERT INTO products (id, name, "hindiName", brand, category, image, "inStock", "isFeatured", "isBestOffer", description, price, "originalPrice", unit, variants)\n`;
  sql += `VALUES ('${esc(prod.id)}', '${esc(prod.name)}', '${esc(prod.hindiName)}', '${esc(prod.brand)}', '${esc(prod.category)}', '${esc(prod.image)}', ${Boolean(prod.inStock)}, ${Boolean(prod.isFeatured)}, ${Boolean(prod.isBestOffer)}, '${esc(prod.description)}', ${priceVal}, ${origPriceVal}, ${unitVal}, ${varVal})\n`;
  sql += `ON CONFLICT (id) DO NOTHING;\n`;
});

fs.writeFileSync('./supabase_schema.sql', sql, 'utf8');
console.log('Successfully generated supabase_schema.sql! Size:', sql.length, 'bytes');

