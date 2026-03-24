-- Fix approval flow so changing registration_requests.status to 'approved' assigns the requested role automatically
DROP TRIGGER IF EXISTS on_registration_request_review ON public.registration_requests;

CREATE TRIGGER on_registration_request_review
AFTER UPDATE OF status ON public.registration_requests
FOR EACH ROW
WHEN (OLD.status IS DISTINCT FROM NEW.status)
EXECUTE FUNCTION public.handle_registration_approval();

-- Backfill roles for any requests that may already have been approved before the trigger existed
INSERT INTO public.user_roles (user_id, role)
SELECT DISTINCT rr.user_id, rr.requested_role
FROM public.registration_requests rr
WHERE rr.status = 'approved'
ON CONFLICT (user_id, role) DO NOTHING;