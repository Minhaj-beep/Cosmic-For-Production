/*
  # Categories and Products Schema

  1. New Tables
    - `categories` — Bicycle categories (Road, Mountain, Gravel, etc.)
      - `id`, `name`, `slug` (unique), `description`, `status`, `created_at`, `updated_at`
    - `products` — Main product catalog
      - `id`, `name`, `sku` (unique), `category_id` (FK), `subcategory`, `price`, `offer_price`
      - `stock` (enum: in_stock/low_stock/out_of_stock)
      - `status` (enum: published/draft)
      - `featured`, `new_arrival`, `bestseller` (booleans)
      - `description`, `specs` (jsonb), `images` (text[])
      - `created_at`, `updated_at`
    - `product_variants` — Size/color/stock variants per product
      - `id`, `product_id` (FK), `size`, `color`, `stock_qty`

  2. Security
    - RLS on all tables
    - Public can read published products and active categories
    - Authenticated admins can perform full CRUD

  3. Notes
    - specs stored as JSONB array: [{key: string, value: string}]
    - images stored as text array of URLs
*/

CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text DEFAULT '',
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read active categories"
  ON categories FOR SELECT
  USING (status = 'active');

CREATE POLICY "Authenticated can read all categories"
  ON categories FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated can insert categories"
  ON categories FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated can update categories"
  ON categories FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated can delete categories"
  ON categories FOR DELETE
  TO authenticated
  USING (true);

-- Products table
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  sku text UNIQUE NOT NULL,
  category_id uuid REFERENCES categories(id) ON DELETE SET NULL,
  subcategory text DEFAULT '',
  price numeric(10,2) NOT NULL DEFAULT 0,
  offer_price numeric(10,2),
  stock text NOT NULL DEFAULT 'in_stock' CHECK (stock IN ('in_stock', 'low_stock', 'out_of_stock')),
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('published', 'draft')),
  featured boolean NOT NULL DEFAULT false,
  new_arrival boolean NOT NULL DEFAULT false,
  bestseller boolean NOT NULL DEFAULT false,
  description text DEFAULT '',
  specs jsonb DEFAULT '[]',
  images text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read published products"
  ON products FOR SELECT
  USING (status = 'published');

CREATE POLICY "Authenticated can read all products"
  ON products FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated can insert products"
  ON products FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated can update products"
  ON products FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated can delete products"
  ON products FOR DELETE
  TO authenticated
  USING (true);

-- Product variants
CREATE TABLE IF NOT EXISTS product_variants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  size text NOT NULL DEFAULT '',
  color text NOT NULL DEFAULT '',
  stock_qty integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read variants of published products"
  ON product_variants FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM products
      WHERE products.id = product_variants.product_id
      AND products.status = 'published'
    )
  );

CREATE POLICY "Authenticated can read all variants"
  ON product_variants FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated can insert variants"
  ON product_variants FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated can update variants"
  ON product_variants FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated can delete variants"
  ON product_variants FOR DELETE
  TO authenticated
  USING (true);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_status ON products(status);
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(featured);
CREATE INDEX IF NOT EXISTS idx_product_variants_product ON product_variants(product_id);
