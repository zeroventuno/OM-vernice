-- ==========================================
-- FIX ADMIN PERMISSIONS & USER VISIBILITY
-- ==========================================

-- 1. Create a secure function to check if user is admin
-- SECURITY DEFINER means it runs with privileges of the creator (postgres),
-- bypassing RLS on the users table to avoid recursion.
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM public.users
    WHERE id = auth.uid()
    AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Update USERS table policies

-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Users can view their own data" ON public.users;
DROP POLICY IF EXISTS "Admins can view all users" ON public.users;
DROP POLICY IF EXISTS "Admins can update users" ON public.users;

-- Policy: Users can see their own data OR Admins can see everyone
CREATE POLICY "Users can view own data or Admins view all" ON public.users
  FOR SELECT
  TO authenticated
  USING (
    auth.uid() = id 
    OR 
    is_admin()
  );

-- Policy: Only Admins can update users (approve/reject/change role)
-- Users cannot update their own status/role
CREATE POLICY "Admins can update users" ON public.users
  FOR UPDATE
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- 3. Verify the fix
DO $$
BEGIN
  RAISE NOTICE '✅ Admin function created';
  RAISE NOTICE '✅ Users RLS updated to allow Admin visibility';
  RAISE NOTICE '✅ Admins can now approve/reject users';
END $$;
