-- Gearbox Backend — Seed Data Migration
-- Dummy marketplace data for MVP / development

-- Categories
INSERT INTO categories (name, slug, description, icon, sort_order) VALUES
  ('Camera', 'camera', 'Professional cameras and cinema bodies', 'camera', 1),
  ('Lens', 'lens', 'Prime and zoom lenses', 'aperture', 2),
  ('Drone', 'drone', 'Aerial photography and videography drones', 'plane', 3),
  ('Lighting', 'lighting', 'LED panels, strobes, and modifiers', 'lightbulb', 4),
  ('Audio', 'audio', 'Microphones and field recorders', 'mic', 5),
  ('Gimbal', 'gimbal', 'Stabilizers and gimbal systems', 'move-3d', 6)
ON CONFLICT (slug) DO NOTHING;

-- Cities
INSERT INTO cities (name, slug, state, country, is_active) VALUES
  ('Mumbai', 'mumbai', 'Maharashtra', 'India', true),
  ('Bangalore', 'bangalore', 'Karnataka', 'India', true),
  ('Delhi', 'delhi', 'Delhi', 'India', true),
  ('Hyderabad', 'hyderabad', 'Telangana', 'India', true),
  ('Chennai', 'chennai', 'Tamil Nadu', 'India', true),
  ('Pune', 'pune', 'Maharashtra', 'India', true),
  ('Goa', 'goa', 'Goa', 'India', true)
ON CONFLICT (slug) DO NOTHING;

-- Equipment (uses subqueries for city/category IDs)
INSERT INTO equipment (
  title, slug, description, daily_price, city_id, category_id,
  owner_name, verified_owner, rating, review_count,
  status, coming_soon, featured, popular, specifications
)
SELECT
  'Sony A7S III',
  'sony-a7s-iii',
  'Professional full-frame mirrorless camera perfect for filmmaking and low-light photography.',
  3500,
  c.id,
  cat.id,
  'Arjun Mehta',
  true,
  4.9,
  24,
  'published',
  true,
  true,
  true,
  '{"Sensor": "12.1MP Full-Frame", "Video": "4K 120fps", "Mount": "Sony E"}'::jsonb
FROM cities c, categories cat
WHERE c.slug = 'mumbai' AND cat.slug = 'camera'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO equipment (
  title, slug, description, daily_price, city_id, category_id,
  owner_name, verified_owner, rating, review_count,
  status, coming_soon, featured, popular, specifications
)
SELECT
  'Canon EOS R5 Cinema Kit',
  'canon-r5-cinema',
  '8K cinema-ready setup with RF 24-70mm f/2.8 lens.',
  4200,
  c.id,
  cat.id,
  'Priya Sharma',
  true,
  4.8,
  18,
  'published',
  true,
  true,
  true,
  '{"Sensor": "45MP Full-Frame", "Video": "8K RAW", "Mount": "Canon RF"}'::jsonb
FROM cities c, categories cat
WHERE c.slug = 'bangalore' AND cat.slug = 'camera'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO equipment (
  title, slug, description, daily_price, city_id, category_id,
  owner_name, verified_owner, rating, review_count,
  status, coming_soon, featured, popular, specifications
)
SELECT
  'Sigma 85mm f/1.4 DG DN Art',
  'sigma-85mm-art',
  'Stunning portrait lens with creamy bokeh. Sony E mount.',
  800,
  c.id,
  cat.id,
  'Rahul Kapoor',
  true,
  4.9,
  31,
  'published',
  true,
  true,
  false,
  '{"Focal Length": "85mm", "Aperture": "f/1.4", "Mount": "Sony E"}'::jsonb
FROM cities c, categories cat
WHERE c.slug = 'delhi' AND cat.slug = 'lens'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO equipment (
  title, slug, description, daily_price, city_id, category_id,
  owner_name, verified_owner, rating, review_count,
  status, coming_soon, featured, popular, specifications
)
SELECT
  'DJI Mavic 3 Pro',
  'dji-mavic-3-pro',
  'Triple-camera drone with Hasselblad main sensor.',
  2800,
  c.id,
  cat.id,
  'Sneha Reddy',
  true,
  4.8,
  15,
  'published',
  true,
  true,
  true,
  '{"Camera": "Hasselblad 4/3 CMOS", "Flight Time": "43 min", "Video": "5.1K 50fps"}'::jsonb
FROM cities c, categories cat
WHERE c.slug = 'hyderabad' AND cat.slug = 'drone'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO equipment (
  title, slug, description, daily_price, city_id, category_id,
  owner_name, verified_owner, rating, review_count,
  status, coming_soon, featured, popular, specifications
)
SELECT
  'Aputure 600d Pro',
  'aputure-600d-pro',
  'Professional daylight LED with Bowens mount.',
  1500,
  c.id,
  cat.id,
  'Arjun Mehta',
  true,
  4.7,
  12,
  'published',
  true,
  false,
  false,
  '{"Output": "600W equivalent", "Color Temp": "5600K", "CRI": "96+"}'::jsonb
FROM cities c, categories cat
WHERE c.slug = 'mumbai' AND cat.slug = 'lighting'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO equipment (
  title, slug, description, daily_price, city_id, category_id,
  owner_name, verified_owner, rating, review_count,
  status, coming_soon, featured, popular, specifications
)
SELECT
  'DJI RS 4 Pro',
  'dji-rs-4-pro',
  'Professional 3-axis gimbal supporting up to 4.5kg.',
  1200,
  c.id,
  cat.id,
  'Rahul Kapoor',
  true,
  4.9,
  21,
  'published',
  true,
  true,
  false,
  '{"Payload": "4.5kg", "Battery": "12 hours", "Axis": "3-axis"}'::jsonb
FROM cities c, categories cat
WHERE c.slug = 'chennai' AND cat.slug = 'gimbal'
ON CONFLICT (slug) DO NOTHING;

-- Equipment images
INSERT INTO equipment_images (equipment_id, url, alt_text, sort_order, is_primary)
SELECT e.id, 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=1200&h=800&fit=crop', 'Sony A7S III', 0, true
FROM equipment e WHERE e.slug = 'sony-a7s-iii'
ON CONFLICT DO NOTHING;

INSERT INTO equipment_images (equipment_id, url, alt_text, sort_order, is_primary)
SELECT e.id, 'https://images.unsplash.com/photo-1606986628032-b6583437d565?w=1200&h=800&fit=crop', 'Canon EOS R5', 0, true
FROM equipment e WHERE e.slug = 'canon-r5-cinema'
ON CONFLICT DO NOTHING;

INSERT INTO equipment_images (equipment_id, url, alt_text, sort_order, is_primary)
SELECT e.id, 'https://images.unsplash.com/photo-1617005082133-548c45dd806e?w=1200&h=800&fit=crop', 'Sigma 85mm Art', 0, true
FROM equipment e WHERE e.slug = 'sigma-85mm-art'
ON CONFLICT DO NOTHING;

INSERT INTO equipment_images (equipment_id, url, alt_text, sort_order, is_primary)
SELECT e.id, 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=1200&h=800&fit=crop', 'DJI Mavic 3 Pro', 0, true
FROM equipment e WHERE e.slug = 'dji-mavic-3-pro'
ON CONFLICT DO NOTHING;

INSERT INTO equipment_images (equipment_id, url, alt_text, sort_order, is_primary)
SELECT e.id, 'https://images.unsplash.com/photo-1598484468202-a71105726265?w=1200&h=800&fit=crop', 'Aputure 600d Pro', 0, true
FROM equipment e WHERE e.slug = 'aputure-600d-pro'
ON CONFLICT DO NOTHING;

INSERT INTO equipment_images (equipment_id, url, alt_text, sort_order, is_primary)
SELECT e.id, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&h=800&fit=crop', 'DJI RS 4 Pro', 0, true
FROM equipment e WHERE e.slug = 'dji-rs-4-pro'
ON CONFLICT DO NOTHING;
