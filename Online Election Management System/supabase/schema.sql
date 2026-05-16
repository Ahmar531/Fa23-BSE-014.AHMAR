-- ==========================================
-- VoteSecure Supabase Database Schema
-- ==========================================

-- Drop existing tables to avoid "relation already exists" errors
DROP TABLE IF EXISTS public.notifications CASCADE;
DROP TABLE IF EXISTS public.audit_logs CASCADE;
DROP TABLE IF EXISTS public.votes CASCADE;
DROP TABLE IF EXISTS public.secret_ids CASCADE;
DROP TABLE IF EXISTS public.voter_registrations CASCADE;
DROP TABLE IF EXISTS public.candidates CASCADE;
DROP TABLE IF EXISTS public.polls CASCADE;
DROP TABLE IF EXISTS public.elections CASCADE;
DROP TABLE IF EXISTS public.creator_requests CASCADE;
DROP TABLE IF EXISTS public.users CASCADE;

-- 1. Users Table (Extends Supabase Auth)
CREATE TABLE public.users (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  role TEXT NOT NULL DEFAULT 'voter' CHECK (role IN ('super_admin', 'admin', 'election_creator', 'voter')),
  verified BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own profile" ON public.users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Admins can view all users" ON public.users FOR SELECT USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('admin', 'super_admin')));
CREATE POLICY "Users can update their own profile" ON public.users FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert their own profile" ON public.users FOR INSERT WITH CHECK (auth.uid() = id);


-- 2. Creator Requests
CREATE TABLE public.creator_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  purpose TEXT NOT NULL,
  organization TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  rejection_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.creator_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own requests" ON public.creator_requests FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can create requests" ON public.creator_requests FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Admins can manage requests" ON public.creator_requests FOR ALL USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('admin', 'super_admin')));


-- 3. Elections
CREATE TABLE public.elections (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  creator_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT DEFAULT 'Other',
  start_at TIMESTAMPTZ NOT NULL,
  end_at TIMESTAMPTZ NOT NULL,
  deadline TIMESTAMPTZ,
  max_voters INTEGER,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'active', 'completed')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT end_after_start CHECK (end_at > start_at),
  CONSTRAINT deadline_before_start CHECK (deadline IS NULL OR deadline < start_at)
);
ALTER TABLE public.elections ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view published elections" ON public.elections FOR SELECT USING (status != 'draft');
CREATE POLICY "Creators can view their own elections" ON public.elections FOR SELECT USING (creator_id = auth.uid());
CREATE POLICY "Creators can manage their own elections" ON public.elections FOR ALL USING (creator_id = auth.uid());
CREATE POLICY "Admins can view all elections" ON public.elections FOR SELECT USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('admin', 'super_admin')));


-- 4. Polls (Multiple polls per election)
CREATE TABLE public.polls (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  election_id UUID REFERENCES public.elections(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.polls ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view polls for published elections" ON public.polls FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.elections e WHERE e.id = election_id AND e.status != 'draft')
);
CREATE POLICY "Creators can manage their own polls" ON public.polls FOR ALL USING (
  EXISTS (SELECT 1 FROM public.elections e WHERE e.id = election_id AND e.creator_id = auth.uid())
);


-- 5. Candidates
CREATE TABLE public.candidates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  poll_id UUID REFERENCES public.polls(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  photo_url TEXT,
  designation TEXT,
  manifesto TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.candidates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view candidates" ON public.candidates FOR SELECT USING (true);
CREATE POLICY "Creators can manage candidates" ON public.candidates FOR ALL USING (
  EXISTS (SELECT 1 FROM public.polls p JOIN public.elections e ON p.election_id = e.id WHERE p.id = poll_id AND e.creator_id = auth.uid())
);


-- 6. Voter Registrations
CREATE TABLE public.voter_registrations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  poll_id UUID REFERENCES public.polls(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'registered' CHECK (status IN ('registered', 'waitlisted', 'voted', 'rejected')),
  registered_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(poll_id, user_id)
);
ALTER TABLE public.voter_registrations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own registrations" ON public.voter_registrations FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can register themselves" ON public.voter_registrations FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Creators can view registrations for their polls" ON public.voter_registrations FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.polls p JOIN public.elections e ON p.election_id = e.id WHERE p.id = poll_id AND e.creator_id = auth.uid())
);


-- 7. Secret IDs (Emailed to user, hashed here)
CREATE TABLE public.secret_ids (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  poll_id UUID REFERENCES public.polls(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  hashed_secret TEXT NOT NULL,
  masked_secret TEXT NOT NULL, -- To show the user e.g. ****0001
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(poll_id, user_id)
);
ALTER TABLE public.secret_ids ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own secret ID metadata" ON public.secret_ids FOR SELECT USING (user_id = auth.uid());
-- Creators and Admins shouldn't directly read secrets, but they need to trigger generation (handled via secure edge functions usually)


-- 8. Votes (Anonymous, no user_id)
CREATE TABLE public.votes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  poll_id UUID REFERENCES public.polls(id) ON DELETE CASCADE,
  candidate_id UUID REFERENCES public.candidates(id) ON DELETE CASCADE,
  voted_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.votes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view aggregate votes" ON public.votes FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert votes securely" ON public.votes FOR INSERT WITH CHECK (auth.role() = 'authenticated');
-- Logic to prevent double voting must be enforced in the Edge Function that inserts the vote and updates voter_registrations.status to 'voted'


-- 9. Audit Logs
CREATE TABLE public.audit_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  action TEXT NOT NULL,
  actor_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  target_id UUID,
  details_json JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Only admins can view audit logs" ON public.audit_logs FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
);
-- Logs usually inserted via triggers or edge functions with elevated privileges

-- 10. Notifications
CREATE TABLE public.notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'unread',
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own notifications" ON public.notifications FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can update their own notifications" ON public.notifications FOR UPDATE USING (user_id = auth.uid());
