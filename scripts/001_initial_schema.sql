-- Create product_categories table
CREATE TABLE IF NOT EXISTS product_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  image_url TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID NOT NULL REFERENCES product_categories(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  specifications TEXT,
  image_url TEXT,
  min_quantity INTEGER DEFAULT 100,
  unit TEXT DEFAULT 'cái',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create news table
CREATE TABLE IF NOT EXISTS news (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  image_url TEXT,
  category TEXT,
  published_at TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create quotes table
CREATE TABLE IF NOT EXISTS quotes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  quantity INTEGER NOT NULL,
  specifications TEXT,
  delivery_address TEXT,
  notes TEXT,
  status TEXT DEFAULT 'pending',
  quoted_price DECIMAL(10, 2),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create contact_inquiries table
CREATE TABLE IF NOT EXISTS contact_inquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'new',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create company_info table
CREATE TABLE IF NOT EXISTS company_info (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT NOT NULL UNIQUE,
  value TEXT,
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create admin_users table
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  role TEXT DEFAULT 'editor',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Enable RLS on all tables
ALTER TABLE product_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE news ENABLE ROW LEVEL SECURITY;
ALTER TABLE quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Public read access for product_categories
CREATE POLICY "product_categories_select_public" ON product_categories FOR SELECT USING (TRUE);

-- Public read access for products
CREATE POLICY "products_select_public" ON products FOR SELECT USING (TRUE);

-- Public read access for news
CREATE POLICY "news_select_public" ON news FOR SELECT USING (TRUE);

-- Public write access for contact_inquiries (anyone can submit)
CREATE POLICY "contact_inquiries_insert_public" ON contact_inquiries FOR INSERT WITH CHECK (TRUE);
CREATE POLICY "contact_inquiries_select_public" ON contact_inquiries FOR SELECT USING (TRUE);

-- Public write access for quotes (anyone can request)
CREATE POLICY "quotes_insert_public" ON quotes FOR INSERT WITH CHECK (TRUE);
CREATE POLICY "quotes_select_public" ON quotes FOR SELECT USING (TRUE);

-- Public read access for company_info
CREATE POLICY "company_info_select_public" ON company_info FOR SELECT USING (TRUE);

-- Admin only access for management
CREATE POLICY "admin_users_select_admin" ON admin_users FOR SELECT USING (
  EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid() AND role IN ('admin', 'editor'))
);

CREATE POLICY "product_categories_admin" ON product_categories FOR UPDATE USING (
  EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid() AND role IN ('admin', 'editor'))
);

CREATE POLICY "product_categories_admin_insert" ON product_categories FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid() AND role IN ('admin', 'editor'))
);

CREATE POLICY "product_categories_admin_delete" ON product_categories FOR DELETE USING (
  EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid() AND role IN ('admin', 'editor'))
);

CREATE POLICY "products_admin" ON products FOR UPDATE USING (
  EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid() AND role IN ('admin', 'editor'))
);

CREATE POLICY "products_admin_insert" ON products FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid() AND role IN ('admin', 'editor'))
);

CREATE POLICY "products_admin_delete" ON products FOR DELETE USING (
  EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid() AND role IN ('admin', 'editor'))
);

CREATE POLICY "news_admin" ON news FOR UPDATE USING (
  EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid() AND role IN ('admin', 'editor'))
);

CREATE POLICY "news_admin_insert" ON news FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid() AND role IN ('admin', 'editor'))
);

CREATE POLICY "news_admin_delete" ON news FOR DELETE USING (
  EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid() AND role IN ('admin', 'editor'))
);

CREATE POLICY "quotes_admin" ON quotes FOR SELECT USING (
  EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid() AND role IN ('admin', 'editor'))
);

CREATE POLICY "quotes_admin_update" ON quotes FOR UPDATE USING (
  EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid() AND role IN ('admin', 'editor'))
);

CREATE POLICY "contact_inquiries_admin" ON contact_inquiries FOR SELECT USING (
  EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid() AND role IN ('admin', 'editor'))
);

CREATE POLICY "contact_inquiries_admin_update" ON contact_inquiries FOR UPDATE USING (
  EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid() AND role IN ('admin', 'editor'))
);

CREATE POLICY "company_info_admin_update" ON company_info FOR UPDATE USING (
  EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid() AND role IN ('admin', 'editor'))
);

CREATE POLICY "company_info_admin_insert" ON company_info FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid() AND role IN ('admin', 'editor'))
);
