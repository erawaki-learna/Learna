-- ═══════════════════════════════════════════
-- LEARNA — Supabase Database Setup
-- Run this in Supabase SQL Editor
-- ═══════════════════════════════════════════

-- 1. PROFILES TABLE
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT,
  full_name TEXT,
  division TEXT,
  role TEXT DEFAULT 'requestor' CHECK (role IN ('admin', 'requestor')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. REQUESTS TABLE
CREATE TABLE IF NOT EXISTS requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  request_id TEXT,
  requestor_name TEXT,
  division TEXT,
  contact TEXT,
  business_problem TEXT,
  audience TEXT,
  urgency TEXT,
  manager_commitment BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'D1 Received',
  assigned_to TEXT,
  triage_decision TEXT,
  triage_notes TEXT,
  ai_analysis JSONB,
  priority TEXT DEFAULT 'Medium',
  target_completion DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. SESSIONS TABLE
CREATE TABLE IF NOT EXISTS sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  date DATE NOT NULL,
  start_time TEXT,
  end_time TEXT,
  location TEXT DEFAULT 'Classroom',
  max_participants INTEGER DEFAULT 20,
  programme_type TEXT DEFAULT 'Open Enrolment',
  facilitator TEXT,
  status TEXT DEFAULT 'Draft',
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. REGISTRATIONS TABLE
CREATE TABLE IF NOT EXISTS registrations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID REFERENCES sessions(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  registration_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status TEXT DEFAULT 'registered'
);

-- 5. SESSION REQUESTS TABLE
CREATE TABLE IF NOT EXISTS session_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  preferred_date DATE,
  preferred_time TEXT,
  topic TEXT,
  num_participants INTEGER,
  division TEXT,
  notes TEXT,
  status TEXT DEFAULT 'Pending',
  admin_response TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ═══════════════════════════════════════════
-- ROW LEVEL SECURITY
-- ═══════════════════════════════════════════

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE session_requests ENABLE ROW LEVEL SECURITY;

-- ── PROFILES POLICIES ──
CREATE POLICY "Users can read own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Admins can read all profiles"
  ON profiles FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- ── REQUESTS POLICIES ──
CREATE POLICY "Users can read own requests"
  ON requests FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can read all requests"
  ON requests FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Authenticated users can insert requests"
  ON requests FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can update any request"
  ON requests FOR UPDATE
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- ── SESSIONS POLICIES ──
CREATE POLICY "Anyone authenticated can read published sessions"
  ON sessions FOR SELECT
  USING (status = 'Published' OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admins can insert sessions"
  ON sessions FOR INSERT
  WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Admins can update sessions"
  ON sessions FOR UPDATE
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Admins can delete sessions"
  ON sessions FOR DELETE
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- ── REGISTRATIONS POLICIES ──
CREATE POLICY "Users can read own registrations"
  ON registrations FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can read all registrations"
  ON registrations FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Users can insert own registrations"
  ON registrations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own registrations"
  ON registrations FOR UPDATE
  USING (auth.uid() = user_id);

-- ── SESSION REQUESTS POLICIES ──
CREATE POLICY "Users can read own session requests"
  ON session_requests FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can read all session requests"
  ON session_requests FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Users can insert session requests"
  ON session_requests FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can update session requests"
  ON session_requests FOR UPDATE
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- ═══════════════════════════════════════════
-- AUTO-CREATE PROFILE ON SIGN UP
-- ═══════════════════════════════════════════

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    CASE
      WHEN NEW.email IN ('eranda.wakista@hnbassurance.com', 'eranda.wakista@gmail.com') THEN 'admin'
      ELSE 'requestor'
    END
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if any
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ═══════════════════════════════════════════
-- DONE
-- ═══════════════════════════════════════════
