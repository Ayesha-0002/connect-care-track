
-- 1. Remove privilege escalation: drop self-insert policy on user_roles
DROP POLICY IF EXISTS "Users can insert own role" ON public.user_roles;

-- 2. Fix notifications insert policy to only allow self-targeted notifications
DROP POLICY IF EXISTS "Authenticated can insert notifications" ON public.notifications;
CREATE POLICY "Users can insert own notifications"
ON public.notifications
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- 3. Fix profiles exposure: drop the overly broad authenticated select policy
DROP POLICY IF EXISTS "Authenticated users can view profiles" ON public.profiles;

-- 4. Make delivery-photos bucket private
UPDATE storage.buckets SET public = false WHERE id = 'delivery-photos';

-- 5. Add UPDATE storage policies
CREATE POLICY "Users can update own food images"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'food-images'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can update own delivery photos"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'delivery-photos'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- 6. Add SELECT policy for delivery-photos (since bucket is now private)
CREATE POLICY "Owner or admin can view delivery photos"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'delivery-photos'
  AND (
    (storage.foldername(name))[1] = auth.uid()::text
    OR public.has_role(auth.uid(), 'admin')
  )
);

-- 7. Change ai_safe default to false
ALTER TABLE public.food_donations ALTER COLUMN ai_safe SET DEFAULT false;
