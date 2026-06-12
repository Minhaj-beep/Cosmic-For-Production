/*
  # Dealers, SEO Metadata, Media Library, and Site Settings Schema

  1. New Tables
    - `dealers` — Authorized dealer / store locator entries
      - `id`, `name`, `address`, `city`, `state`, `pincode`, `phone`, `email`
      - `type` (enum: dealer/service_center/flagship), `status` (active/inactive)
      - `latitude`, `longitude` (numeric, for map support)
      - `created_at`, `updated_at`
    - `seo_metadata` — Per-page SEO configuration
      - `id`, `page` (human name), `route` (URL path, unique), `title`, `description`
      - `keywords`, `og_image`, `last_updated`
    - `media_library` — Uploaded media files
      - `id`, `name`, `url`, `storage_path`, `type`, `size_bytes`, `width`, `height`
      - `used_in` (text[], references), `uploaded_by` (FK auth.users)
      - `created_at`
    - `site_settings` — Key-value site configuration
      - `id`, `key` (unique), `value` (text), `updated_at`

  2. Security
    - Dealers and SEO are publicly readable
    - Media and settings require authentication to manage
    - Anonymous can read dealers (store locator is public)

  3. Notes
    - site_settings uses a key/value store pattern for flexibility
    - social_links stored as single JSON value under key 'social_links'
*/

-- Dealers / Store Locator
CREATE TABLE IF NOT EXISTS dealers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  address text DEFAULT '',
  city text DEFAULT '',
  state text DEFAULT '',
  pincode text DEFAULT '',
  phone text DEFAULT '',
  email text DEFAULT '',
  type text NOT NULL DEFAULT 'dealer' CHECK (type IN ('dealer', 'service_center', 'flagship')),
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  latitude numeric(10,7),
  longitude numeric(10,7),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE dealers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read active dealers"
  ON dealers FOR SELECT
  USING (status = 'active');

CREATE POLICY "Authenticated can read all dealers"
  ON dealers FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated can insert dealers"
  ON dealers FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated can update dealers"
  ON dealers FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated can delete dealers"
  ON dealers FOR DELETE
  TO authenticated
  USING (true);

-- SEO Metadata
CREATE TABLE IF NOT EXISTS seo_metadata (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page text NOT NULL,
  route text UNIQUE NOT NULL,
  title text DEFAULT '',
  description text DEFAULT '',
  keywords text DEFAULT '',
  og_image text DEFAULT '',
  last_updated timestamptz DEFAULT now()
);

ALTER TABLE seo_metadata ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read seo metadata"
  ON seo_metadata FOR SELECT
  USING (true);

CREATE POLICY "Authenticated can insert seo metadata"
  ON seo_metadata FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated can update seo metadata"
  ON seo_metadata FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated can delete seo metadata"
  ON seo_metadata FOR DELETE
  TO authenticated
  USING (true);

-- Media Library
CREATE TABLE IF NOT EXISTS media_library (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  url text NOT NULL,
  storage_path text DEFAULT '',
  type text NOT NULL DEFAULT 'image' CHECK (type IN ('image', 'video', 'document')),
  size_bytes bigint DEFAULT 0,
  width integer,
  height integer,
  used_in text[] DEFAULT '{}',
  uploaded_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE media_library ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read media library"
  ON media_library FOR SELECT
  USING (true);

CREATE POLICY "Authenticated can insert media"
  ON media_library FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = uploaded_by);

CREATE POLICY "Authenticated can update media"
  ON media_library FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated can delete media"
  ON media_library FOR DELETE
  TO authenticated
  USING (true);

-- Site Settings (key-value store)
CREATE TABLE IF NOT EXISTS site_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  value text NOT NULL DEFAULT '',
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read site settings"
  ON site_settings FOR SELECT
  USING (true);

CREATE POLICY "Authenticated can insert site settings"
  ON site_settings FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated can update site settings"
  ON site_settings FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated can delete site settings"
  ON site_settings FOR DELETE
  TO authenticated
  USING (true);

CREATE INDEX IF NOT EXISTS idx_dealers_status ON dealers(status);
CREATE INDEX IF NOT EXISTS idx_seo_metadata_route ON seo_metadata(route);
CREATE INDEX IF NOT EXISTS idx_media_library_type ON media_library(type);
