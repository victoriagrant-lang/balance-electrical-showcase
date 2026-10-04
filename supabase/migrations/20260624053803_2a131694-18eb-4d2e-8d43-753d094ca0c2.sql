CREATE POLICY "balance_photos_public_read" ON storage.objects FOR SELECT TO anon, authenticated USING (bucket_id = 'Website Photos');
CREATE POLICY "balance_photos_admin_insert" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'Website Photos' AND auth.uid() IS NOT NULL AND auth.jwt() ->> 'role' = 'service_role');
CREATE POLICY "balance_photos_admin_update" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'Website Photos' AND auth.jwt() ->> 'role' = 'service_role');
CREATE POLICY "balance_photos_admin_delete" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'Website Photos' AND auth.jwt() ->> 'role' = 'service_role');
