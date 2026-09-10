-- ============================================================
-- 002_rls_policies.sql
-- Zen Virtual Assistance – Row Level Security Policies
-- ============================================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.files ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

-- ────────────────────────────────────────────────────────────
-- Helper function: get current user's role
-- ────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS TEXT AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid()
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- ────────────────────────────────────────────────────────────
-- PROFILES policies
-- ────────────────────────────────────────────────────────────
-- Users can read their own profile; admins can read all
CREATE POLICY "profiles_select" ON public.profiles
  FOR SELECT USING (
    id = auth.uid() OR public.get_current_user_role() = 'admin'
  );

-- Users can update only their own profile
CREATE POLICY "profiles_update" ON public.profiles
  FOR UPDATE USING (id = auth.uid());

-- Service role can insert (via trigger or seed)
CREATE POLICY "profiles_insert_service" ON public.profiles
  FOR INSERT WITH CHECK (TRUE);

-- ────────────────────────────────────────────────────────────
-- TASKS policies
-- ────────────────────────────────────────────────────────────
-- Admins see all; employees/clients see their assigned tasks
CREATE POLICY "tasks_select" ON public.tasks
  FOR SELECT USING (
    public.get_current_user_role() = 'admin'
    OR assigned_to = auth.uid()
    OR created_by = auth.uid()
  );

-- Only admins can create tasks (in POC)
CREATE POLICY "tasks_insert" ON public.tasks
  FOR INSERT WITH CHECK (
    public.get_current_user_role() = 'admin'
  );

-- Assigned user can update status; admins can update everything
CREATE POLICY "tasks_update" ON public.tasks
  FOR UPDATE USING (
    public.get_current_user_role() = 'admin'
    OR assigned_to = auth.uid()
  );

-- ────────────────────────────────────────────────────────────
-- MESSAGES policies
-- ────────────────────────────────────────────────────────────
CREATE POLICY "messages_select" ON public.messages
  FOR SELECT USING (
    sender_id = auth.uid()
    OR receiver_id = auth.uid()
    OR public.get_current_user_role() = 'admin'
  );

CREATE POLICY "messages_insert" ON public.messages
  FOR INSERT WITH CHECK (sender_id = auth.uid());

-- ────────────────────────────────────────────────────────────
-- FILES policies
-- ────────────────────────────────────────────────────────────
CREATE POLICY "files_select" ON public.files
  FOR SELECT USING (
    public.get_current_user_role() = ANY(accessible_roles)
    OR public.get_current_user_role() = 'admin'
  );

-- Only admins can insert files in POC
CREATE POLICY "files_insert" ON public.files
  FOR INSERT WITH CHECK (public.get_current_user_role() = 'admin');

-- ────────────────────────────────────────────────────────────
-- ACTIVITY LOGS policies
-- CRITICAL: Regular users CANNOT read, modify, or delete logs.
-- Only admins can SELECT. Only service-role can INSERT.
-- ────────────────────────────────────────────────────────────
CREATE POLICY "activity_logs_select_admin" ON public.activity_logs
  FOR SELECT USING (public.get_current_user_role() = 'admin');

-- No UPDATE or DELETE policies = no one (except service role) can modify logs
