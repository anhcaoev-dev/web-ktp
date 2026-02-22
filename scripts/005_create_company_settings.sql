-- Create company_settings table for shared company/site metadata
-- Used by: admin /admin/thong-tin, Header, Footer, Contact page

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

ALTER TABLE company_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS company_settings_all ON company_settings;
CREATE POLICY company_settings_all ON company_settings FOR ALL USING (TRUE) WITH CHECK (TRUE);
