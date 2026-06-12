/*
  # Accessories and Spare Parts Schema

  1. New Tables
    - `accessories` — Cycling accessories (helmets, bags, lights, etc.)
      - `id`, `name`, `sku`, `category`, `price`, `stock_qty`, `status`, `image`, `description`
      - `created_at`, `updated_at`
    - `spare_parts` — Bicycle spare parts catalog
      - `id`, `name`, `sku`, `category`, `price`, `stock_qty`, `compatibility`, `status`, `description`
      - `created_at`, `updated_at`

  2. Security
    - RLS on both tables
    - Public can read published items
    - Authenticated admins can do full CRUD
*/

CREATE TABLE IF NOT EXISTS accessories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  sku text UNIQUE NOT NULL,
  category text NOT NULL DEFAULT '',
  price numeric(10,2) NOT NULL DEFAULT 0,
  stock_qty integer NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('published', 'draft')),
  image text DEFAULT '',
  description text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE accessories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read published accessories"
  ON accessories FOR SELECT
  USING (status = 'published');

CREATE POLICY "Authenticated can read all accessories"
  ON accessories FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated can insert accessories"
  ON accessories FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated can update accessories"
  ON accessories FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated can delete accessories"
  ON accessories FOR DELETE
  TO authenticated
  USING (true);

-- Spare parts
CREATE TABLE IF NOT EXISTS spare_parts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  sku text UNIQUE NOT NULL,
  category text NOT NULL DEFAULT '',
  price numeric(10,2) NOT NULL DEFAULT 0,
  stock_qty integer NOT NULL DEFAULT 0,
  compatibility text DEFAULT '',
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('published', 'draft')),
  description text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE spare_parts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read published spare parts"
  ON spare_parts FOR SELECT
  USING (status = 'published');

CREATE POLICY "Authenticated can read all spare parts"
  ON spare_parts FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated can insert spare parts"
  ON spare_parts FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated can update spare parts"
  ON spare_parts FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated can delete spare parts"
  ON spare_parts FOR DELETE
  TO authenticated
  USING (true);

CREATE INDEX IF NOT EXISTS idx_accessories_status ON accessories(status);
CREATE INDEX IF NOT EXISTS idx_spare_parts_status ON spare_parts(status);
