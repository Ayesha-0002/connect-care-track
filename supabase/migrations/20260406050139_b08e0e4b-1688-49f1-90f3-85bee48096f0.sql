
-- Update handle_new_user to also save phone
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
begin
  insert into public.profiles (id, full_name, email, phone)
  values (
    new.id,
    new.raw_user_meta_data->>'full_name',
    new.email,
    new.raw_user_meta_data->>'phone'
  );
  return new;
end;
$function$;

-- Attach the trigger (recreate to be safe)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Also attach the registration approval trigger
DROP TRIGGER IF EXISTS on_registration_status_change ON public.registration_requests;
CREATE TRIGGER on_registration_status_change
  AFTER UPDATE ON public.registration_requests
  FOR EACH ROW EXECUTE FUNCTION public.handle_registration_approval();
