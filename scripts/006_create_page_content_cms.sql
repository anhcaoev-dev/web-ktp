-- CMS schema for editable page content (draft/published + version history)
-- Priority use-case: Home page content editor in admin.

CREATE EXTENSION IF NOT EXISTS pgcrypto;

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

CREATE INDEX IF NOT EXISTS idx_page_contents_page_key_status ON page_contents(page_key, status);
CREATE INDEX IF NOT EXISTS idx_page_content_versions_page_key_created_at
  ON page_content_versions(page_key, created_at DESC);

ALTER TABLE page_contents ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_content_versions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS page_contents_all ON page_contents;
DROP POLICY IF EXISTS page_content_versions_all ON page_content_versions;

CREATE POLICY page_contents_all ON page_contents FOR ALL USING (TRUE) WITH CHECK (TRUE);
CREATE POLICY page_content_versions_all ON page_content_versions FOR ALL USING (TRUE) WITH CHECK (TRUE);

-- Storage bucket for CMS image uploads
INSERT INTO storage.buckets (id, name, public)
VALUES ('website-assets', 'website-assets', TRUE)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS website_assets_select ON storage.objects;
DROP POLICY IF EXISTS website_assets_insert ON storage.objects;
DROP POLICY IF EXISTS website_assets_update ON storage.objects;
DROP POLICY IF EXISTS website_assets_delete ON storage.objects;

CREATE POLICY website_assets_select
ON storage.objects FOR SELECT
USING (bucket_id = 'website-assets');

CREATE POLICY website_assets_insert
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'website-assets');

CREATE POLICY website_assets_update
ON storage.objects FOR UPDATE
USING (bucket_id = 'website-assets')
WITH CHECK (bucket_id = 'website-assets');

CREATE POLICY website_assets_delete
ON storage.objects FOR DELETE
USING (bucket_id = 'website-assets');
