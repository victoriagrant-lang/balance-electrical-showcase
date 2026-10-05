-- Project brief fields and uploaded files for website enquiries.
ALTER TABLE public.balance_enquiries
  ADD COLUMN IF NOT EXISTS stage text,
  ADD COLUMN IF NOT EXISTS budget text,
  ADD COLUMN IF NOT EXISTS timeframe text,
  ADD COLUMN IF NOT EXISTS files jsonb NOT NULL DEFAULT '[]'::jsonb;

CREATE INDEX IF NOT EXISTS balance_enquiries_created_at_idx
  ON public.balance_enquiries (created_at DESC);

-- Private bucket for photos and plans sent with an enquiry. No storage policies:
-- only the edge functions (service role) can read or write it.
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'enquiry-files',
  'enquiry-files',
  false,
  10485760,
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif', 'application/pdf']
)
ON CONFLICT (id) DO NOTHING;
