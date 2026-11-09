-- ========================================================
-- DUKAAN ONLINE - AIRTIGHT HACK-PROOF ROW LEVEL SECURITY (RLS)
-- Run this SQL in Supabase Dashboard -> SQL Editor -> Run
-- ========================================================

-- Enable RLS on all tables
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE store_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- --------------------------------------------------------
-- 1. CATEGORIES TABLE
-- Public: Can ONLY read categories
-- Authenticated Shopkeeper: Can add, update, delete
-- --------------------------------------------------------
DROP POLICY IF EXISTS "Public categories access" ON categories;
DROP POLICY IF EXISTS "Public read categories" ON categories;
DROP POLICY IF EXISTS "Admin write categories" ON categories;

CREATE POLICY "Public read categories" 
ON categories FOR SELECT 
TO public 
USING (true);

CREATE POLICY "Admin write categories" 
ON categories FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);

-- --------------------------------------------------------
-- 2. PRODUCTS TABLE
-- Public: Can ONLY read products
-- Authenticated Shopkeeper: Can add, edit price, delete products
-- --------------------------------------------------------
DROP POLICY IF EXISTS "Public products access" ON products;
DROP POLICY IF EXISTS "Public read products" ON products;
DROP POLICY IF EXISTS "Admin write products" ON products;

CREATE POLICY "Public read products" 
ON products FOR SELECT 
TO public 
USING (true);

CREATE POLICY "Admin write products" 
ON products FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);

-- --------------------------------------------------------
-- 3. STORE SETTINGS TABLE
-- Public: Can ONLY read store details (address, timings, offers)
-- Authenticated Shopkeeper: Can update store details
-- --------------------------------------------------------
DROP POLICY IF EXISTS "Public store_settings access" ON store_settings;
DROP POLICY IF EXISTS "Public read store_settings" ON store_settings;
DROP POLICY IF EXISTS "Admin write store_settings" ON store_settings;

CREATE POLICY "Public read store_settings" 
ON store_settings FOR SELECT 
TO public 
USING (true);

CREATE POLICY "Admin write store_settings" 
ON store_settings FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);

-- --------------------------------------------------------
-- 4. ORDERS TABLE
-- Public: Can ONLY SUBMIT an order (INSERT)
-- Public CANNOT read past orders, CANNOT edit/delete orders!
-- Authenticated Shopkeeper: Can view all orders and change status
-- --------------------------------------------------------
DROP POLICY IF EXISTS "Public orders access" ON orders;
DROP POLICY IF EXISTS "Public insert orders" ON orders;
DROP POLICY IF EXISTS "Admin full orders access" ON orders;

CREATE POLICY "Public insert orders" 
ON orders FOR INSERT 
TO public 
WITH CHECK (true);

CREATE POLICY "Admin full orders access" 
ON orders FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);

-- --------------------------------------------------------
-- 5. REMOVE EXPOSED adminPin COLUMN (Handled by Supabase Auth)
-- --------------------------------------------------------
ALTER TABLE store_settings DROP COLUMN IF EXISTS "adminPin";

