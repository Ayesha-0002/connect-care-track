
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

  -- Auto-assign role if provided during signup
  if new.raw_user_meta_data->>'role' is not null then
    insert into public.user_roles (user_id, role)
    values (new.id, (new.raw_user_meta_data->>'role')::app_role)
    on conflict (user_id, role) do nothing;
  end if;

  return new;
end;
$function$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
