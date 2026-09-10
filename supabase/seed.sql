-- ============================================================
-- seed.sql
-- Zen Virtual Assistance – Demo Seed Data
-- ============================================================
-- INSTRUCTIONS:
-- 1. First create the three demo users in Supabase Auth dashboard
--    (or via the Supabase admin API) with these credentials:
--      admin@zenva.test    / Admin123!
--      employee@zenva.test / Employee123!
--      client@zenva.test   / Client123!
-- 2. Then run this SQL in the Supabase SQL editor.
-- 3. Replace the UUIDs below with the actual user UUIDs from auth.users.
-- ============================================================

-- NOTE: The trigger handle_new_user() auto-creates profiles on signup.
-- Update profiles with correct roles after creating users:

-- Update admin profile (replace UUID with actual auth user id)
UPDATE public.profiles
SET full_name = 'Alex Rivera', role = 'admin', status = 'active'
WHERE id = (SELECT id FROM auth.users WHERE email = 'admin@zenva.test');

-- Update employee profile
UPDATE public.profiles
SET full_name = 'Maria Santos', role = 'employee', status = 'active'
WHERE id = (SELECT id FROM auth.users WHERE email = 'employee@zenva.test');

-- Update client profile
UPDATE public.profiles
SET full_name = 'Juan Cruz', role = 'client', status = 'active'
WHERE id = (SELECT id FROM auth.users WHERE email = 'client@zenva.test');

-- ────────────────────────────────────────────────────────────
-- SAMPLE FILES
-- ────────────────────────────────────────────────────────────
INSERT INTO public.files (name, storage_path, accessible_roles, file_type) VALUES
  ('Client_Project.pdf',      'samples/Client_Project.pdf',      ARRAY['admin','employee','client'], 'application/pdf'),
  ('Brand_Guidelines.pdf',    'samples/Brand_Guidelines.pdf',    ARRAY['admin','employee','client'], 'application/pdf'),
  ('Monthly_Report.pdf',      'samples/Monthly_Report.pdf',      ARRAY['admin','employee','client'], 'application/pdf'),
  ('Employee_Handbook.pdf',   'samples/Employee_Handbook.pdf',   ARRAY['admin','employee'],          'application/pdf'),
  ('Admin_Dashboard_Guide.pdf','samples/Admin_Dashboard_Guide.pdf',ARRAY['admin'],                  'application/pdf')
ON CONFLICT DO NOTHING;

-- ────────────────────────────────────────────────────────────
-- SAMPLE TASKS
-- (Uses subqueries to get profile IDs by email)
-- ────────────────────────────────────────────────────────────
INSERT INTO public.tasks (title, description, status, assigned_to, created_by) VALUES
  (
    'Social Media Research',
    'Research trending topics in the virtual assistance industry for Q4 content calendar.',
    'in_progress',
    (SELECT id FROM auth.users WHERE email = 'employee@zenva.test'),
    (SELECT id FROM auth.users WHERE email = 'admin@zenva.test')
  ),
  (
    'Data Entry – Client Records',
    'Update client contact information and service history in the database.',
    'pending',
    (SELECT id FROM auth.users WHERE email = 'employee@zenva.test'),
    (SELECT id FROM auth.users WHERE email = 'admin@zenva.test')
  ),
  (
    'Client Report Preparation',
    'Compile monthly performance metrics for the client portfolio review.',
    'pending',
    (SELECT id FROM auth.users WHERE email = 'employee@zenva.test'),
    (SELECT id FROM auth.users WHERE email = 'admin@zenva.test')
  ),
  (
    'Email Management',
    'Organize and respond to the client inbox. Flag urgent items.',
    'completed',
    (SELECT id FROM auth.users WHERE email = 'employee@zenva.test'),
    (SELECT id FROM auth.users WHERE email = 'admin@zenva.test')
  ),
  (
    'Review Project Proposal',
    'Review and approve the virtual assistance proposal submitted for your account.',
    'pending',
    (SELECT id FROM auth.users WHERE email = 'client@zenva.test'),
    (SELECT id FROM auth.users WHERE email = 'admin@zenva.test')
  ),
  (
    'Onboarding Documentation',
    'Complete the onboarding checklist for your new virtual assistance service.',
    'in_progress',
    (SELECT id FROM auth.users WHERE email = 'client@zenva.test'),
    (SELECT id FROM auth.users WHERE email = 'admin@zenva.test')
  )
ON CONFLICT DO NOTHING;

-- ────────────────────────────────────────────────────────────
-- SAMPLE MESSAGES
-- ────────────────────────────────────────────────────────────
INSERT INTO public.messages (sender_id, receiver_id, content, read) VALUES
  (
    (SELECT id FROM auth.users WHERE email = 'admin@zenva.test'),
    (SELECT id FROM auth.users WHERE email = 'employee@zenva.test'),
    'Hi Maria, please prioritize the Social Media Research task this week.',
    TRUE
  ),
  (
    (SELECT id FROM auth.users WHERE email = 'employee@zenva.test'),
    (SELECT id FROM auth.users WHERE email = 'admin@zenva.test'),
    'Understood! I will have the research ready by Thursday.',
    TRUE
  ),
  (
    (SELECT id FROM auth.users WHERE email = 'admin@zenva.test'),
    (SELECT id FROM auth.users WHERE email = 'client@zenva.test'),
    'Welcome to Zen Virtual Assistance! Your account is now active. Let us know if you need anything.',
    FALSE
  )
ON CONFLICT DO NOTHING;
