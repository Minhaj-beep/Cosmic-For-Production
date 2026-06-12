/*
  # Seed Default Site Settings and SEO Metadata

  Seeds the site_settings table with default values for Cosmic Bicycles.
  Seeds the seo_metadata table with default entries for all main pages.

  - All settings use upsert (INSERT ... ON CONFLICT DO UPDATE) to be safe
  - No data is overwritten if already present
*/

-- Site settings defaults
INSERT INTO site_settings (key, value) VALUES
  ('company_name', 'Cosmic Bicycles'),
  ('tagline', 'Sky Is The Limit'),
  ('email', 'info@cosmicbicycles.com'),
  ('phone', '+91 98765 43210'),
  ('address', 'Nandi Marketing, Mumbai, Maharashtra, India'),
  ('footer_about', 'Crafting precision performance bicycles since 2008.'),
  ('footer_copyright', '© 2026 Cosmic Bicycles. All rights reserved.'),
  ('maintenance_mode', 'false'),
  ('social_links', '[{"platform":"Instagram","url":"https://instagram.com/cosmicbicycles"},{"platform":"Facebook","url":"https://facebook.com/cosmicbicycles"},{"platform":"YouTube","url":"https://youtube.com/cosmicbicycles"},{"platform":"Twitter","url":"https://twitter.com/cosmicbicycles"}]')
ON CONFLICT (key) DO NOTHING;

-- SEO metadata defaults
INSERT INTO seo_metadata (page, route, title, description, keywords) VALUES
  ('Home', '/', 'Cosmic Bikes — Sky Is The Limit', 'Cosmic crafts premium performance bicycles for road, mountain, gravel, and urban riding.', 'cosmic bicycles, premium bikes, road bike, mountain bike India'),
  ('About', '/about', 'About Cosmic Bicycles', 'Learn about Cosmic Bicycles, our story, mission, and the team behind every bike.', 'about cosmic, bicycle brand India, cosmic history'),
  ('Products', '/products', 'All Bikes — Cosmic Bicycles', 'Browse our complete range of road, mountain, gravel, urban, and kids bicycles.', 'buy cosmic bike, bicycle price India'),
  ('Accessories', '/accessories', 'Cycling Accessories — Cosmic', 'Shop helmets, bags, lights, and cycling gear from Cosmic.', 'cycling accessories India, cosmic accessories'),
  ('Spare Parts', '/spare-parts', 'Bicycle Spare Parts — Cosmic', 'Genuine spare parts for all Cosmic bicycle models.', 'bicycle spare parts India, cosmic spare parts'),
  ('Careers', '/careers', 'Careers at Cosmic Bicycles', 'Join the Cosmic team. View open positions and grow with us.', 'cosmic careers, jobs cycling industry'),
  ('Contact', '/contact', 'Contact Cosmic Bicycles', 'Get in touch with Cosmic Bicycles for enquiries, support, and dealer partnerships.', 'cosmic contact, bicycle support India'),
  ('Store Locator', '/store-locator', 'Find a Cosmic Dealer Near You', 'Locate authorized Cosmic dealers and service centers across India.', 'cosmic dealer locator, bike shop India')
ON CONFLICT (route) DO NOTHING;
