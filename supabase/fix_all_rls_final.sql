-- ==========================================
-- SOLUÇÃO DEFINITIVA: REMOVER TODAS RECURSÕES
-- ==========================================

-- PROBLEMA: Qualquer política que faça "SELECT role FROM users WHERE id = auth.uid()"
-- cria recursão infinita quando RLS está habilitado em users.

-- SOLUÇÃO: Usar apenas auth.uid() sem consultar a tabela users

-- 1. CORRIGIR POLÍTICAS DA TABELA USERS
DROP POLICY IF EXISTS "Users can view their own data" ON public.users;
DROP POLICY IF EXISTS "Admins can view all users" ON public.users;
DROP POLICY IF EXISTS "Admins can update users" ON public.users;
DROP POLICY IF EXISTS "Allow insert during signup" ON public.users;

-- Usuários podem ver apenas seus próprios dados
CREATE POLICY "Users can view their own data" ON public.users
  FOR SELECT 
  TO authenticated
  USING (auth.uid() = id);

-- Permitir INSERT durante signup
CREATE POLICY "Allow insert during signup" ON public.users
  FOR INSERT 
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Para admins, usaremos service_role direto (não via RLS)
-- Isso evita recursão completamente

-- 2. TABELAS DE REFERÊNCIA - Leitura para todos
DROP POLICY IF EXISTS "Authenticated users can view models" ON public.models;
DROP POLICY IF EXISTS "Service role can manage models" ON public.models;
DROP POLICY IF EXISTS "Authenticated users can view agents" ON public.agents;
DROP POLICY IF EXISTS "Service role can manage agents" ON public.agents;
DROP POLICY IF EXISTS "Authenticated users can view colors" ON public.colors;
DROP POLICY IF EXISTS "Service role can manage colors" ON public.colors;

CREATE POLICY "Anyone authenticated can view models" ON public.models
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Anyone authenticated can view agents" ON public.agents
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Anyone authenticated can view colors" ON public.colors
  FOR SELECT TO authenticated USING (true);

-- 3. TABELA ORDERS - Todos podem ver e criar
DROP POLICY IF EXISTS "Users can view all orders" ON public.orders;
DROP POLICY IF EXISTS "Users can insert orders" ON public.orders;
DROP POLICY IF EXISTS "Users can update orders" ON public.orders;
DROP POLICY IF EXISTS "Admins can delete orders" ON public.orders;

CREATE POLICY "Authenticated can view orders" ON public.orders
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated can insert orders" ON public.orders
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Authenticated can update orders" ON public.orders
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

-- Delete será via service_role ou função específica

-- 4. EDIT HISTORY
DROP POLICY IF EXISTS "Anyone can view edit history" ON public.edit_history;
DROP POLICY IF EXISTS "Users can insert edit history" ON public.edit_history;

CREATE POLICY "Authenticated can view edit history" ON public.edit_history
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated can insert edit history" ON public.edit_history
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = edited_by);

-- 5. VERIFICAÇÕES
SELECT 'USERS POLICIES' as info;
SELECT policyname, cmd FROM pg_policies WHERE tablename = 'users' ORDER BY policyname;

SELECT 'REFERENCE TABLES POLICIES' as info;
SELECT tablename, policyname, cmd FROM pg_policies 
WHERE tablename IN ('models', 'agents', 'colors') 
ORDER BY tablename, policyname;

SELECT 'DATA COUNTS' as info;
SELECT 'models' as table_name, COUNT(*) FROM models
UNION ALL SELECT 'agents', COUNT(*) FROM agents
UNION ALL SELECT 'colors', COUNT(*) FROM colors
UNION ALL SELECT 'orders', COUNT(*) FROM orders;

DO $$
BEGIN
  RAISE NOTICE '✅ TODAS as políticas corrigidas!';
  RAISE NOTICE '✅ Recursão ELIMINADA';
  RAISE NOTICE '✅ Políticas simples usando apenas auth.uid()';
  RAISE NOTICE '';
  RAISE NOTICE '🔄 REINICIE o dev server:';
  RAISE NOTICE '1. No terminal, pressione Ctrl+C para parar';
  RAISE NOTICE '2. Execute: npm run dev';
  RAISE NOTICE '3. Acesse localhost:3000';
  RAISE NOTICE '4. Console deve mostrar arrays CHEIOS de dados!';
END $$;
