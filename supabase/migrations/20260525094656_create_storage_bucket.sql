/*
  # Create Storage Bucket for Media Uploads

  Creates a 'media' storage bucket for product images and other uploads.
  Sets up public access for reading files (images rendered on site).
  Authenticated users can upload files to the bucket.

  Notes:
  - Bucket is public so images are accessible without auth
  - Upload requires authentication
  - Allowed mime types: images and documents
*/

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'media',
  'media',
  true,
  10485760,
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml', 'application/pdf']
)
ON CONFLICT (id) DO NOTHING;

-- Allow public to read files from the media bucket
CREATE POLICY "Public can read media files"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'media');

-- Allow authenticated users to upload
CREATE POLICY "Authenticated can upload media"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'media');

-- Allow authenticated users to update their uploads
CREATE POLICY "Authenticated can update media"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'media')
  WITH CHECK (bucket_id = 'media');

-- Allow authenticated users to delete media
CREATE POLICY "Authenticated can delete media"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'media');
