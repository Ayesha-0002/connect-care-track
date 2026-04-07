
-- Re-attach triggers that are missing

-- 1. Trigger for auto-creating profile + role on signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 2. Trigger for auto-assigning role when registration is approved
DROP TRIGGER IF EXISTS on_registration_status_change ON public.registration_requests;
CREATE TRIGGER on_registration_status_change
  AFTER UPDATE ON public.registration_requests
  FOR EACH ROW EXECUTE FUNCTION public.handle_registration_approval();

-- 3. Add INSERT policy on profiles for the security definer function
-- (already bypasses RLS, but adding a user-level policy too for direct inserts)
CREATE POLICY "Users can insert own profile"
  ON public.profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);
