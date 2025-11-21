-- Update models list
-- First, remove existing models (safe as orders use text column)
DELETE FROM public.models;

-- Insert new models list
INSERT INTO public.models (name) VALUES
  ('GRANFONDO'),
  ('BISALTA'),
  ('SL'),
  ('LEMMA RT'),
  ('SANTIAGO'),
  ('BRONDELLO DISC'),
  ('SL NEW DISC'),
  ('SL COMP 3K'),
  ('LEMMA 3.0'),
  ('SANTIAGO RT'),
  ('OM1'),
  ('OM1 RT');
