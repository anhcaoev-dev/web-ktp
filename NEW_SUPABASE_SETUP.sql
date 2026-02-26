-- KỊCH BẢN SETUP DÀNH CHO SUPABASE MỚI TỪ A-Z (KHÔNG LÕI)
-- Bước 1: Copy toàn bộ nội dung file này
-- Bước 2: Vào project Supabase mới -> Chọn Tab SQL Editor -> Chọn "New Query" (hoặc dán đè vào query cũ)
-- Bước 3: Paste và bấm nút "Run" màu xanh nước biển ở góc phải
-- Bước 4: Sẽ có báo "Success. No rows returned." - Vậy là XONG!!!

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 1. Bảng Cài đặt công ty
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

-- Khởi tạo sẵn 1 dòng dữ liệu
INSERT INTO company_settings (company_name) VALUES ('Bao Bì Kim Thành Phát') ON CONFLICT DO NOTHING;

-- 2. Bảng Sản phẩm & Danh mục
CREATE TABLE IF NOT EXISTS product_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  image_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'tieu_chuan',
  description TEXT,
  price NUMERIC(12, 2) NOT NULL DEFAULT 0,
  image_url TEXT,
  is_featured BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Bảng Tin tức
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

-- 4. Bảng Nội dung trang tĩnh (Home Page)
CREATE TABLE IF NOT EXISTS page_contents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_key TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('draft', 'published')),
  content JSONB NOT NULL DEFAULT '{}'::jsonb,
  version INTEGER NOT NULL DEFAULT 1,
  updated_by TEXT,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(page_key, status)
);

CREATE TABLE IF NOT EXISTS page_content_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_key TEXT NOT NULL,
  source_status TEXT NOT NULL CHECK (source_status IN ('draft', 'published')),
  version_number INTEGER NOT NULL,
  action TEXT NOT NULL CHECK (action IN ('save_draft', 'publish', 'restore')),
  change_note TEXT,
  content JSONB NOT NULL,
  created_by TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. Bảng Hệ thống Liên hệ & Báo giá
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

-- 6. Bảng Quản trị viên (Admin)
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

-- Khởi tạo Tài khoản Admin mặc định
-- Tài khoản: kimthanhphatbb@gmail.com
-- Mật khẩu hash SHA256 tương ứng đã mã hoá: default password là "admin123"
INSERT INTO admin_users (email, name, password_hash, role, is_active, created_at, updated_at)
VALUES (
  'kimthanhphatbb@gmail.com',  
  'Admin',
  '8594fdb8ca65a9604f3331b95096fe6f44d75429b39ea5a4bcde090a2c4c1143', 
  'admin',
  true,
  NOW(),
  NOW()
)
ON CONFLICT (email) DO UPDATE SET password_hash = '8594fdb8ca65a9604f3331b95096fe6f44d75429b39ea5a4bcde090a2c4c1143';

-- 7. Thiết lập Storage chứa Hình Ảnh (Bucket website-assets)
INSERT INTO storage.buckets (id, name, public)
VALUES ('website-assets', 'website-assets', TRUE)
ON CONFLICT (id) DO NOTHING;

-- Thả Policy cũ
DROP POLICY IF EXISTS website_assets_select ON storage.objects;
DROP POLICY IF EXISTS website_assets_insert ON storage.objects;
DROP POLICY IF EXISTS website_assets_update ON storage.objects;
DROP POLICY IF EXISTS website_assets_delete ON storage.objects;

-- Thiết lập Quyền truy cập cho File ảnh
CREATE POLICY website_assets_select ON storage.objects FOR SELECT USING (bucket_id = 'website-assets');
CREATE POLICY website_assets_insert ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'website-assets');
CREATE POLICY website_assets_update ON storage.objects FOR UPDATE USING (bucket_id = 'website-assets') WITH CHECK (bucket_id = 'website-assets');
CREATE POLICY website_assets_delete ON storage.objects FOR DELETE USING (bucket_id = 'website-assets');

-- 8. Tắt hoàn toàn Row Level Security (RLS) để API Server tuỳ chỉnh được quyền đọc ghi
ALTER TABLE product_categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE products DISABLE ROW LEVEL SECURITY;
ALTER TABLE news_articles DISABLE ROW LEVEL SECURITY;
ALTER TABLE page_contents DISABLE ROW LEVEL SECURITY;
ALTER TABLE page_content_versions DISABLE ROW LEVEL SECURITY;
ALTER TABLE quote_requests DISABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages DISABLE ROW LEVEL SECURITY;
ALTER TABLE contacts DISABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users DISABLE ROW LEVEL SECURITY;
ALTER TABLE admin_sessions DISABLE ROW LEVEL SECURITY;
ALTER TABLE company_settings DISABLE ROW LEVEL SECURITY;

-- 9. Tạo Index hỗ trợ tìm kiếm tăng tốc
CREATE INDEX IF NOT EXISTS idx_products_created_at ON products(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_news_articles_status ON news_articles(status);
CREATE INDEX IF NOT EXISTS idx_news_articles_created_at ON news_articles(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_quote_requests_status ON quote_requests(status);
CREATE INDEX IF NOT EXISTS idx_quote_requests_created_at ON quote_requests(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contact_messages_status ON contact_messages(status);
CREATE INDEX IF NOT EXISTS idx_contact_messages_created_at ON contact_messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contacts_created_at ON contacts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_admin_sessions_token ON admin_sessions(token);
CREATE INDEX IF NOT EXISTS idx_page_contents_page_key_status ON page_contents(page_key, status);
