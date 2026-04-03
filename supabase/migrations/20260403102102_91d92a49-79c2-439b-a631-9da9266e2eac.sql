
-- Ratings table for rating donors/NGOs/volunteers
CREATE TABLE public.donation_ratings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  donation_id UUID NOT NULL,
  rated_user_id UUID NOT NULL,
  rated_by_user_id UUID NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.donation_ratings ENABLE ROW LEVEL SECURITY;

-- Anyone authenticated can view ratings
CREATE POLICY "Authenticated can view ratings" ON public.donation_ratings
  FOR SELECT TO authenticated USING (true);

-- Users can insert ratings
CREATE POLICY "Users can insert ratings" ON public.donation_ratings
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = rated_by_user_id);

-- Admins can manage all ratings
CREATE POLICY "Admins can manage ratings" ON public.donation_ratings
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));
