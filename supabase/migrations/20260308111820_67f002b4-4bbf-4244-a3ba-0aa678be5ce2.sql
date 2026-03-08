
-- Add delivery_photo_url column to food_donations
ALTER TABLE public.food_donations ADD COLUMN IF NOT EXISTS delivery_photo_url text;

-- Add ngo_verified columns
ALTER TABLE public.food_donations ADD COLUMN IF NOT EXISTS ngo_verified boolean DEFAULT false;
ALTER TABLE public.food_donations ADD COLUMN IF NOT EXISTS ngo_verified_at timestamptz;
ALTER TABLE public.food_donations ADD COLUMN IF NOT EXISTS ngo_verified_by uuid;

-- Create delivery-photos storage bucket
INSERT INTO storage.buckets (id, name, public) VALUES ('delivery-photos', 'delivery-photos', true) ON CONFLICT (id) DO NOTHING;

-- Storage policies for delivery-photos bucket (skip food-images since they exist)
DO $$ BEGIN
  CREATE POLICY "Authenticated users can upload delivery photos" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'delivery-photos');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE POLICY "Anyone can view delivery photos" ON storage.objects FOR SELECT USING (bucket_id = 'delivery-photos');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE POLICY "Authenticated users can upload food images" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'food-images');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE POLICY "Users can delete own food images" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'food-images' AND (storage.foldername(name))[1] = auth.uid()::text);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- Create function to auto-assign role and notify on approval
CREATE OR REPLACE FUNCTION public.handle_registration_approval()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  IF NEW.status = 'approved' AND (OLD.status IS NULL OR OLD.status != 'approved') THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.user_id, NEW.requested_role)
    ON CONFLICT (user_id, role) DO NOTHING;

    INSERT INTO public.notifications (user_id, title, message, type)
    VALUES (
      NEW.user_id,
      'Registration Approved! 🎉',
      'Your ' || NEW.requested_role || ' account has been approved. You can now access all features.',
      'approval'
    );
  END IF;

  IF NEW.status = 'rejected' AND (OLD.status IS NULL OR OLD.status != 'rejected') THEN
    INSERT INTO public.notifications (user_id, title, message, type)
    VALUES (
      NEW.user_id,
      'Registration Update',
      'Your registration request has been reviewed. Please contact support for more information.',
      'rejection'
    );
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_registration_status_change ON public.registration_requests;
CREATE TRIGGER on_registration_status_change
  AFTER UPDATE ON public.registration_requests
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_registration_approval();

-- Allow volunteers to update assigned donations
DO $$ BEGIN
  CREATE POLICY "Volunteers can update assigned donations" ON public.food_donations
    FOR UPDATE TO authenticated
    USING (auth.uid() = assigned_volunteer_id);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
