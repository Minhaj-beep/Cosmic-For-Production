CREATE TABLE IF NOT EXISTS product_categories (
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  PRIMARY KEY (product_id, category_id)
);

ALTER TABLE product_categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "select_product_categories" ON product_categories
  FOR SELECT USING (true);

CREATE POLICY "insert_product_categories" ON product_categories
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "delete_product_categories" ON product_categories
  FOR DELETE TO authenticated USING (true);
