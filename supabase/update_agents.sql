-- Update agents list
-- First, remove existing agents (safe as orders use text column)
DELETE FROM public.agents;

-- Insert new agents list
INSERT INTO public.agents (name) VALUES
  ('MICHELE'),
  ('GABRIEL'),
  ('SAMUELE'),
  ('GIOVANNI'),
  ('RICARDO'),
  ('CRISTIANO');
