-- Restore public read access to the "Website Photos" storage bucket.
--
-- An earlier migration (20260624053822) dropped "balance_photos_public_read",
-- which is the SELECT policy that lets the anonymous/publishable key list the
-- bucket. Without it `storage.from("Website Photos").list(...)` returns an
-- empty array, so the portfolio/gallery fall back to bundled images instead of
-- loading The_Lake_House / Sparrowhawk / Mapleleaf from Supabase.
CREATE POLICY "balance_photos_public_read" ON storage.objects
  FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'Website Photos');
