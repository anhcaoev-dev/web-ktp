-- Align Supabase schema with current application code
-- Safe to run multiple times (uses IF NOT EXISTS / conditional blocks)

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 1) Product categories
CREATE TABLE IF NOT EXISTS product_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  image_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2) Products (current app uses category as text, plus price)
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'tieu_chuan',
  description TEXT,
  price NUMERIC(12, 2) NOT NULL DEFAULT 0,
  image_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Backfill/align columns if products table existed with old structure
ALTER TABLE products ADD COLUMN IF NOT EXISTS category TEXT;
ALTER TABLE products ALTER COLUMN category SET DEFAULT 'tieu_chuan';
UPDATE products SET category = 'tieu_chuan' WHERE category IS NULL;
ALTER TABLE products ALTER COLUMN category SET NOT NULL;

ALTER TABLE products ADD COLUMN IF NOT EXISTS price NUMERIC(12, 2) DEFAULT 0;
UPDATE products SET price = 0 WHERE price IS NULL;
ALTER TABLE products ALTER COLUMN price SET NOT NULL;

ALTER TABLE products ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT FALSE;
UPDATE products SET is_featured = FALSE WHERE is_featured IS NULL;
ALTER TABLE products ALTER COLUMN is_featured SET NOT NULL;

ALTER TABLE products ADD COLUMN IF NOT EXISTS image_url TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE products ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- 3) News articles
CREATE TABLE IF NOT EXISTS news_articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  excerpt TEXT,
  content TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'tin_tuc',
  author TEXT NOT NULL DEFAULT 'Admin',
  featured BOOLEAN NOT NULL DEFAULT FALSE,
  status TEXT NOT NULL DEFAULT 'draft',
  image_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE news_articles ADD COLUMN IF NOT EXISTS excerpt TEXT;
ALTER TABLE news_articles ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT FALSE;
UPDATE news_articles SET featured = FALSE WHERE featured IS NULL;
ALTER TABLE news_articles ALTER COLUMN featured SET NOT NULL;

ALTER TABLE news_articles ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'draft';
UPDATE news_articles SET status = 'draft' WHERE status IS NULL;
ALTER TABLE news_articles ALTER COLUMN status SET NOT NULL;

ALTER TABLE news_articles ADD COLUMN IF NOT EXISTS author TEXT DEFAULT 'Admin';
UPDATE news_articles SET author = 'Admin' WHERE author IS NULL;
ALTER TABLE news_articles ALTER COLUMN author SET NOT NULL;

ALTER TABLE news_articles ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'tin_tuc';
UPDATE news_articles SET category = 'tin_tuc' WHERE category IS NULL;
ALTER TABLE news_articles ALTER COLUMN category SET NOT NULL;

ALTER TABLE news_articles ADD COLUMN IF NOT EXISTS image_url TEXT;
ALTER TABLE news_articles ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE news_articles ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- 4) Quote requests
CREATE TABLE IF NOT EXISTS quote_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  company TEXT,
  product_type TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  specifications TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5) Contact messages used by admin dashboard
CREATE TABLE IF NOT EXISTS contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  subject TEXT NOT NULL DEFAULT 'Liên hệ từ website',
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'unread',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6) Contacts used by /api/contact route
CREATE TABLE IF NOT EXISTS contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  company TEXT,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'new',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7) Admin auth tables
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  name TEXT,
  role TEXT NOT NULL DEFAULT 'editor',
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS admin_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID NOT NULL REFERENCES admin_users(id) ON DELETE CASCADE,
  token TEXT NOT NULL UNIQUE,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8) Shared company settings (header/footer/contact/logo)
CREATE TABLE IF NOT EXISTS company_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name TEXT NOT NULL DEFAULT 'Bao Bì Kim Thành Phát',
  short_name TEXT NOT NULL DEFAULT 'KTP',
  tagline TEXT NOT NULL DEFAULT 'Sản xuất thùng carton chuyên dụng',
  description TEXT NOT NULL DEFAULT 'Nhà sản xuất trực tiếp thùng carton theo yêu cầu với năng lực sản xuất lớn, giá sỉ tận xưởng.',
  phone TEXT NOT NULL DEFAULT 'Cập nhật số điện thoại',
  email TEXT NOT NULL DEFAULT 'Cập nhật email',
  address TEXT NOT NULL DEFAULT 'Cập nhật địa chỉ xưởng/văn phòng',
  working_hours TEXT NOT NULL DEFAULT E'Thứ 2 - Thứ 6: 08:00 - 17:00\nThứ 7: 08:00 - 12:00\nChủ Nhật: Đóng cửa',
  logo_url TEXT NOT NULL DEFAULT '',
  logo_text TEXT NOT NULL DEFAULT 'KTP',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_products_created_at ON products(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_news_articles_status ON news_articles(status);
CREATE INDEX IF NOT EXISTS idx_news_articles_created_at ON news_articles(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_quote_requests_status ON quote_requests(status);
CREATE INDEX IF NOT EXISTS idx_quote_requests_created_at ON quote_requests(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contact_messages_status ON contact_messages(status);
CREATE INDEX IF NOT EXISTS idx_contact_messages_created_at ON contact_messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contacts_created_at ON contacts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_admin_sessions_token ON admin_sessions(token);
CREATE INDEX IF NOT EXISTS idx_admin_sessions_expires_at ON admin_sessions(expires_at);

-- Enable RLS
ALTER TABLE product_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE news_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE quote_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_settings ENABLE ROW LEVEL SECURITY;

-- Drop old policies if they exist to avoid duplication errors
DROP POLICY IF EXISTS product_categories_all ON product_categories;
DROP POLICY IF EXISTS products_all ON products;
DROP POLICY IF EXISTS news_articles_all ON news_articles;
DROP POLICY IF EXISTS quote_requests_all ON quote_requests;
DROP POLICY IF EXISTS contact_messages_all ON contact_messages;
DROP POLICY IF EXISTS contacts_all ON contacts;
DROP POLICY IF EXISTS company_settings_all ON company_settings;
DROP POLICY IF EXISTS admin_users_select_public ON admin_users;
DROP POLICY IF EXISTS admin_sessions_insert_public ON admin_sessions;
DROP POLICY IF EXISTS admin_sessions_select_public ON admin_sessions;
DROP POLICY IF EXISTS admin_sessions_delete_public ON admin_sessions;

-- Current app uses custom admin token (not Supabase Auth JWT),
-- so allow anon/service role access for CRUD through API routes.
CREATE POLICY product_categories_all ON product_categories FOR ALL USING (TRUE) WITH CHECK (TRUE);
CREATE POLICY products_all ON products FOR ALL USING (TRUE) WITH CHECK (TRUE);
CREATE POLICY news_articles_all ON news_articles FOR ALL USING (TRUE) WITH CHECK (TRUE);
CREATE POLICY quote_requests_all ON quote_requests FOR ALL USING (TRUE) WITH CHECK (TRUE);
CREATE POLICY contact_messages_all ON contact_messages FOR ALL USING (TRUE) WITH CHECK (TRUE);
CREATE POLICY contacts_all ON contacts FOR ALL USING (TRUE) WITH CHECK (TRUE);
CREATE POLICY company_settings_all ON company_settings FOR ALL USING (TRUE) WITH CHECK (TRUE);
CREATE POLICY admin_users_select_public ON admin_users FOR SELECT USING (TRUE);
CREATE POLICY admin_sessions_insert_public ON admin_sessions FOR INSERT WITH CHECK (TRUE);
CREATE POLICY admin_sessions_select_public ON admin_sessions FOR SELECT USING (TRUE);
CREATE POLICY admin_sessions_delete_public ON admin_sessions FOR DELETE USING (TRUE);
