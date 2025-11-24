-- ==========================================
-- FIX TODOS OS PROBLEMAS DE SEGURANÇA
-- ==========================================

-- 1. HABILITAR RLS NA TABELA USERS (CRÍTICO!)
-- Este é o problema principal que está causando falha de autenticação
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Verificar se RLS foi habilitado
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'users' AND schemaname = 'public';

-- 2. VERIFICAR E RECRIAR POLÍTICAS DA TABELA USERS
-- Primeiro, remover políticas antigas (se existirem)
DROP POLICY IF EXISTS "Users can view their own data" ON public.users;
DROP POLICY IF EXISTS "Admins can view all users" ON public.users;
DROP POLICY IF EXISTS "Admins can update users" ON public.users;
DROP POLICY IF EXISTS "Allow insert during signup" ON public.users;

-- Recriar políticas corretas
-- Permitir que usuários vejam seus próprios dados
CREATE POLICY "Users can view their own data" ON public.users
  FOR SELECT 
  USING (auth.uid() = id);

-- Permitir que admins vejam todos os usuários
CREATE POLICY "Admins can view all users" ON public.users
  FOR SELECT 
  USING (
    (SELECT role FROM public.users WHERE id = auth.uid()) = 'admin'
  );

-- Permitir que admins atualizem usuários
CREATE POLICY "Admins can update users" ON public.users
  FOR UPDATE 
  USING (
    (SELECT role FROM public.users WHERE id = auth.uid()) = 'admin'
  );

-- Permitir INSERT durante signup
CREATE POLICY "Allow insert during signup" ON public.users
  FOR INSERT 
  WITH CHECK (auth.uid() = id);

-- 3. CORRIGIR SEARCH_PATH DAS FUNÇÕES
-- Fix update_updated_at_column
DROP FUNCTION IF EXISTS public.update_updated_at_column() CASCADE;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Recriar triggers que usam essa função
DROP TRIGGER IF EXISTS update_users_updated_at ON public.users;
DROP TRIGGER IF EXISTS update_orders_updated_at ON public.orders;

CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Fix handle_new_user
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.users (id, email, role, status)
  VALUES (
    NEW.id,
    NEW.email,
    'user',
    'pending'
  );
  RETURN NEW;
END;
$$;

-- Recriar trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- 4. VERIFICAR RLS NA TABELA ORDERS
-- Garantir que RLS está habilitado também na tabela orders
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- 5. VERIFICAÇÃO FINAL
-- Listar todas as políticas ativas
SELECT schemaname, tablename, policyname, permissive, roles, cmd
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- Verificar RLS habilitado em todas as tabelas
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('users', 'orders', 'edit_history')
ORDER BY tablename;

-- 6. MENSAGEM DE SUCESSO
DO $$
BEGIN
  RAISE NOTICE '✅ Todos os problemas de segurança foram corrigidos!';
  RAISE NOTICE '✅ RLS habilitado na tabela users';
  RAISE NOTICE '✅ RLS habilitado na tabela orders';
  RAISE NOTICE '✅ Funções corrigidas com search_path seguro';
  RAISE NOTICE '✅ Políticas recriadas corretamente';
  RAISE NOTICE '';
  RAISE NOTICE '⚠️ PRÓXIMOS PASSOS:';
  RAISE NOTICE '1. Aguarde 1-2 minutos para o Supabase processar as mudanças';
  RAISE NOTICE '2. Limpe os cookies do navegador (Ctrl+Shift+Delete)';
  RAISE NOTICE '3. Faça login novamente no Vercel';
  RAISE NOTICE '4. Teste a página /test-direct';
  RAISE NOTICE '5. Tente editar um pedido';
END $$;
