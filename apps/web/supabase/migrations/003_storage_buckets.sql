-- Gearbox — Storage Buckets (run after initial schema)
-- Prepares Supabase Storage for future marketplace features

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES
  ('equipment-images', 'equipment-images', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp']),
  ('avatars', 'avatars', true, 2097152, ARRAY['image/jpeg', 'image/png', 'image/webp']),
  ('kyc', 'kyc', false, 10485760, ARRAY['image/jpeg', 'image/png', 'application/pdf']),
  ('logos', 'logos', true, 2097152, ARRAY['image/jpeg', 'image/png', 'image/svg+xml', 'image/webp']),
  ('documents', 'documents', false, 20971520, ARRAY['application/pdf', 'image/jpeg', 'image/png'])
ON CONFLICT (id) DO NOTHING;

-- Public read for public buckets
CREATE POLICY "Public read equipment images bucket"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'equipment-images');

CREATE POLICY "Public read avatars bucket"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'avatars');

CREATE POLICY "Public read logos bucket"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'logos');

-- Service role handles writes; authenticated policies added when auth ships
