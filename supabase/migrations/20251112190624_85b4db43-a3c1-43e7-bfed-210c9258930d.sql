-- Add language preference to profiles table
ALTER TABLE public.profiles 
ADD COLUMN language VARCHAR(5) DEFAULT 'en';

-- Add comment
COMMENT ON COLUMN public.profiles.language IS 'User preferred language code (en, es, fr, de, zh, ar, pt, ru, ja, hi)';