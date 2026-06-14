-- Doctor Hub - deployment fix migration
-- Run this once in Supabase SQL Editor for an already deployed project.
-- It is safe to run again.

CREATE TABLE IF NOT EXISTS public.patients (
  id UUID PRIMARY KEY REFERENCES public.users(id) ON DELETE CASCADE,
  blood_group TEXT,
  emergency_contact TEXT,
  allergies TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.assistants (
  id UUID PRIMARY KEY REFERENCES public.users(id) ON DELETE CASCADE,
  assigned_doctor_id UUID REFERENCES public.users(id),
  shift_time TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  receiver_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  appointment_id UUID REFERENCES public.appointments(id) ON DELETE SET NULL,
  content TEXT NOT NULL,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assistants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Authenticated users read profiles" ON public.users;
CREATE POLICY "Authenticated users read profiles" ON public.users
FOR SELECT USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Patients manage own details" ON public.patients;
CREATE POLICY "Patients manage own details" ON public.patients
FOR ALL USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Admins manage all patients" ON public.patients;
CREATE POLICY "Admins manage all patients" ON public.patients
FOR ALL USING (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('admin','super_admin'))
);

DROP POLICY IF EXISTS "Assistants read own details" ON public.assistants;
CREATE POLICY "Assistants read own details" ON public.assistants
FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Admins manage all assistants" ON public.assistants;
CREATE POLICY "Admins manage all assistants" ON public.assistants
FOR ALL USING (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('admin','super_admin'))
);

DROP POLICY IF EXISTS "Participants read messages" ON public.messages;
CREATE POLICY "Participants read messages" ON public.messages
FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

DROP POLICY IF EXISTS "Participants send messages" ON public.messages;
CREATE POLICY "Participants send messages" ON public.messages
FOR INSERT WITH CHECK (
  auth.uid() = sender_id
  AND EXISTS (
    SELECT 1 FROM public.users
    WHERE id = receiver_id
    AND role IN ('patient','doctor')
  )
);

DROP POLICY IF EXISTS "Receiver marks messages read" ON public.messages;
CREATE POLICY "Receiver marks messages read" ON public.messages
FOR UPDATE USING (auth.uid() = receiver_id);

CREATE INDEX IF NOT EXISTS messages_sender_receiver_idx ON public.messages(sender_id, receiver_id, created_at);
CREATE INDEX IF NOT EXISTS messages_receiver_sender_idx ON public.messages(receiver_id, sender_id, created_at);

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  requested_role TEXT;
  resolved_role TEXT;
BEGIN
  requested_role := NEW.raw_user_meta_data ->> 'role';
  resolved_role := CASE
    WHEN requested_role IN ('patient','doctor','assistant','admin','super_admin') THEN requested_role
    ELSE 'patient'
  END;

  INSERT INTO public.users (id, email, full_name, phone, role)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data ->> 'full_name',
    NEW.raw_user_meta_data ->> 'phone',
    resolved_role
  )
  ON CONFLICT (id) DO NOTHING;

  IF resolved_role = 'patient' THEN
    INSERT INTO public.patients (id) VALUES (NEW.id)
    ON CONFLICT (id) DO NOTHING;
  ELSIF resolved_role = 'doctor' THEN
    IF NOT EXISTS (SELECT 1 FROM public.doctors WHERE user_id = NEW.id) THEN
      INSERT INTO public.doctors (
        user_id, specialization, treatment_type, city, consultation_fee,
        experience_years, rating, bio, is_approved, is_available
      )
      VALUES (
        NEW.id, 'General Physician', 'Allopathic', 'Pakistan', 1000,
        0, 4.5, 'Doctor profile pending admin approval.', FALSE, TRUE
      );
    END IF;
  ELSIF resolved_role = 'assistant' THEN
    INSERT INTO public.assistants (id) VALUES (NEW.id)
    ON CONFLICT (id) DO NOTHING;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

INSERT INTO public.users (id, email, full_name, phone, role)
SELECT
  au.id,
  au.email,
  au.raw_user_meta_data ->> 'full_name',
  au.raw_user_meta_data ->> 'phone',
  CASE
    WHEN au.raw_user_meta_data ->> 'role' IN ('patient','doctor','assistant','admin','super_admin')
      THEN au.raw_user_meta_data ->> 'role'
    ELSE 'patient'
  END
FROM auth.users au
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.patients (id)
SELECT id FROM public.users u
WHERE u.role = 'patient'
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.assistants (id)
SELECT id FROM public.users u
WHERE u.role = 'assistant'
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.doctors (
  user_id, specialization, treatment_type, city, consultation_fee,
  experience_years, rating, bio, is_approved, is_available
)
SELECT
  u.id, 'General Physician', 'Allopathic', 'Pakistan', 1000,
  0, 4.5, 'Doctor profile pending admin approval.', FALSE, TRUE
FROM public.users u
WHERE u.role = 'doctor'
  AND NOT EXISTS (SELECT 1 FROM public.doctors d WHERE d.user_id = u.id);

INSERT INTO storage.buckets (id, name, public)
VALUES ('payment-screenshots', 'payment-screenshots', TRUE)
ON CONFLICT (id) DO UPDATE SET public = TRUE;

DROP POLICY IF EXISTS "Authenticated users upload payment screenshots" ON storage.objects;
CREATE POLICY "Authenticated users upload payment screenshots" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'payment-screenshots'
  AND auth.role() = 'authenticated'
);

DROP POLICY IF EXISTS "Public reads payment screenshots" ON storage.objects;
CREATE POLICY "Public reads payment screenshots" ON storage.objects
FOR SELECT USING (bucket_id = 'payment-screenshots');
