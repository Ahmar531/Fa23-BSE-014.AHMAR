-- Doctor Hub - Supabase Database Schema
-- Run this in your Supabase SQL Editor

-- ============================
-- 1. USERS (extends auth.users)
-- ============================
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  phone TEXT,
  role TEXT NOT NULL DEFAULT 'patient' CHECK (role IN ('patient','doctor','assistant','admin','super_admin')),
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read own profile" ON public.users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Authenticated users read profiles" ON public.users FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Users can update own profile" ON public.users FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins read all users" ON public.users FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('admin','super_admin'))
);
CREATE POLICY "Admins update all users" ON public.users FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('admin','super_admin'))
);
CREATE POLICY "Insert own user" ON public.users FOR INSERT WITH CHECK (auth.uid() = id);

-- Creates the public role profile even when Supabase email confirmation is enabled.
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

-- ============================
-- 1A. PATIENTS
-- ============================
CREATE TABLE IF NOT EXISTS public.patients (
  id UUID PRIMARY KEY REFERENCES public.users(id) ON DELETE CASCADE,
  blood_group TEXT,
  emergency_contact TEXT,
  allergies TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.patients ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Patients manage own details" ON public.patients FOR ALL USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
CREATE POLICY "Admins manage all patients" ON public.patients FOR ALL USING (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('admin','super_admin'))
);

-- ============================
-- 1B. ASSISTANTS
-- ============================
CREATE TABLE IF NOT EXISTS public.assistants (
  id UUID PRIMARY KEY REFERENCES public.users(id) ON DELETE CASCADE,
  assigned_doctor_id UUID REFERENCES public.users(id),
  shift_time TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.assistants ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Assistants read own details" ON public.assistants FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Admins manage all assistants" ON public.assistants FOR ALL USING (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('admin','super_admin'))
);

-- ============================
-- 2. DOCTORS
-- ============================
CREATE TABLE IF NOT EXISTS public.doctors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  specialization TEXT,
  treatment_type TEXT CHECK (treatment_type IN ('Allopathic','Homeopathic','Herbal')),
  city TEXT,
  consultation_fee NUMERIC DEFAULT 0,
  experience_years INT DEFAULT 0,
  rating NUMERIC(3,2) DEFAULT 4.5,
  bio TEXT,
  is_approved BOOLEAN DEFAULT FALSE,
  is_available BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.doctors ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read approved doctors" ON public.doctors FOR SELECT USING (is_approved = TRUE OR auth.uid() = user_id);
CREATE POLICY "Doctor manages own profile" ON public.doctors FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Admin manages all doctors" ON public.doctors FOR ALL USING (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('admin','super_admin'))
);

-- ============================
-- 3. CLINICS
-- ============================
CREATE TABLE IF NOT EXISTS public.clinics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  doctor_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  address TEXT,
  city TEXT,
  schedule TEXT,
  fee NUMERIC DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.clinics ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Doctors manage own clinics" ON public.clinics FOR ALL USING (auth.uid() = doctor_id);
CREATE POLICY "Patients view clinics" ON public.clinics FOR SELECT USING (TRUE);

-- ============================
-- 4. APPOINTMENTS
-- ============================
CREATE TABLE IF NOT EXISTS public.appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  doctor_id UUID REFERENCES auth.users(id),
  patient_name TEXT,
  doctor_name TEXT,
  appointment_date DATE,
  appointment_time TEXT,
  notes TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending','confirmed','cancelled','completed')),
  fee NUMERIC DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Patient sees own appointments" ON public.appointments FOR SELECT USING (auth.uid() = patient_id);
CREATE POLICY "Doctor sees own appointments" ON public.appointments FOR SELECT USING (auth.uid() = doctor_id);
CREATE POLICY "Patient creates appointment" ON public.appointments FOR INSERT WITH CHECK (auth.uid() = patient_id);
CREATE POLICY "Doctor updates appointment" ON public.appointments FOR UPDATE USING (auth.uid() = doctor_id OR auth.uid() = patient_id);
CREATE POLICY "Assistant sees all appointments" ON public.appointments FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('assistant','admin','super_admin'))
);
CREATE POLICY "Assistant updates appointments" ON public.appointments FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('assistant','admin','super_admin'))
);

-- ============================
-- 5. PAYMENTS
-- ============================
CREATE TABLE IF NOT EXISTS public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  appointment_id UUID REFERENCES public.appointments(id) ON DELETE CASCADE,
  patient_id UUID REFERENCES auth.users(id),
  doctor_id UUID REFERENCES auth.users(id),
  amount NUMERIC DEFAULT 0,
  screenshot_url TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending','verified','rejected')),
  verified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Patient sees own payments" ON public.payments FOR SELECT USING (auth.uid() = patient_id);
CREATE POLICY "Patient inserts payment" ON public.payments FOR INSERT WITH CHECK (auth.uid() = patient_id);
CREATE POLICY "Assistant manages payments" ON public.payments FOR ALL USING (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('assistant','admin','super_admin'))
);

-- ============================
-- 6. MEDICAL HISTORY (immutable)
-- ============================
CREATE TABLE IF NOT EXISTS public.medical_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  doctor_id UUID REFERENCES auth.users(id),
  doctor_name TEXT,
  appointment_id UUID REFERENCES public.appointments(id),
  diagnosis TEXT,
  symptoms TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.medical_history ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Patient reads own history" ON public.medical_history FOR SELECT USING (auth.uid() = patient_id);
CREATE POLICY "Doctor reads patient history" ON public.medical_history FOR SELECT USING (auth.uid() = doctor_id);
CREATE POLICY "Doctor inserts history" ON public.medical_history FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'doctor')
);
-- NO UPDATE or DELETE policies — history is immutable

-- ============================
-- 7. PRESCRIPTIONS (immutable)
-- ============================
CREATE TABLE IF NOT EXISTS public.prescriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  history_id UUID REFERENCES public.medical_history(id) ON DELETE CASCADE,
  doctor_id UUID REFERENCES auth.users(id),
  medicine_name TEXT NOT NULL,
  dosage TEXT,
  duration TEXT,
  instructions TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.prescriptions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Doctor adds prescription" ON public.prescriptions FOR INSERT WITH CHECK (auth.uid() = doctor_id);
CREATE POLICY "Patient reads own prescriptions" ON public.prescriptions FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.medical_history WHERE id = history_id AND patient_id = auth.uid())
);
CREATE POLICY "Doctor reads own prescriptions" ON public.prescriptions FOR SELECT USING (auth.uid() = doctor_id);
-- NO UPDATE or DELETE — prescriptions are immutable

-- ============================
-- 8. STORAGE BUCKET
-- ============================
INSERT INTO storage.buckets (id, name, public)
VALUES ('payment-screenshots', 'payment-screenshots', TRUE)
ON CONFLICT (id) DO UPDATE SET public = TRUE;

CREATE POLICY "Authenticated users upload payment screenshots" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'payment-screenshots'
  AND auth.role() = 'authenticated'
);

CREATE POLICY "Public reads payment screenshots" ON storage.objects
FOR SELECT USING (bucket_id = 'payment-screenshots');

-- ============================
-- 9. MESSAGES
-- ============================
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  receiver_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  appointment_id UUID REFERENCES public.appointments(id) ON DELETE SET NULL,
  content TEXT NOT NULL,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Participants read messages" ON public.messages FOR SELECT USING (
  auth.uid() = sender_id OR auth.uid() = receiver_id
);
CREATE POLICY "Participants send messages" ON public.messages FOR INSERT WITH CHECK (
  auth.uid() = sender_id
  AND EXISTS (
    SELECT 1 FROM public.users
    WHERE id = receiver_id
    AND role IN ('patient','doctor')
  )
);
CREATE POLICY "Receiver marks messages read" ON public.messages FOR UPDATE USING (auth.uid() = receiver_id);

CREATE INDEX IF NOT EXISTS messages_sender_receiver_idx ON public.messages(sender_id, receiver_id, created_at);
CREATE INDEX IF NOT EXISTS messages_receiver_sender_idx ON public.messages(receiver_id, sender_id, created_at);
