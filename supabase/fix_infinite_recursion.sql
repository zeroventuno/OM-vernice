-- ==========================================
-- CORRIGIR RECURSÃO INFINITA NAS POLÍTICAS RLS
-- ==========================================

-- O problema: Políticas que verificam role consultando 'users' causam recursão infinita
-- Solução: Permitir leitura para TODOS autenticados, sem verificar role

-- 1. REMOVER TODAS AS POLÍTICAS PROBLEMÁTICAS
DROP POLICY IF EXISTS "Anyone can view models" ON public.models;
DROP POLICY IF EXISTS "Admins can manage models" ON public.models;
DROP POLICY IF EXISTS "Anyone can view agents" ON public.agents;
DROP POLICY IF EXISTS "Admins can manage agents" ON public.agents;
DROP POLICY IF EXISTS "Anyone can view colors" ON public.colors;
DROP POLICY IF EXISTS "Admins can manage colors" ON public.colors;

-- 2. CRIAR POLÍTICAS SIMPLES (SEM RECURSÃO)

-- MODELS - Leitura livre, modificação restrita
CREATE POLICY "Authenticated users can view models" ON public.models
  FOR SELECT 
  TO authenticated
  USING (true);

CREATE POLICY "Service role can manage models" ON public.models
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- AGENTS - Leitura livre, modificação restrita
CREATE POLICY "Authenticated users can view agents" ON public.agents
  FOR SELECT 
  TO authenticated
  USING (true);

CREATE POLICY "Service role can manage agents" ON public.agents
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- COLORS - Leitura livre, modificação restrita
CREATE POLICY "Authenticated users can view colors" ON public.colors
  FOR SELECT 
  TO authenticated
  USING (true);

CREATE POLICY "Service role can manage colors" ON public.colors
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- 3. VERIFICAR POLÍTICAS
SELECT 
  tablename,
  policyname,
  cmd as operation
FROM pg_policies
WHERE schemaname = 'public'
AND tablename IN ('models', 'agents', 'colors')
ORDER BY tablename, policyname;

-- 4. TESTAR QUERIES
-- Se estas queries retornarem dados, está funcionando!
SELECT COUNT(*) as total_models FROM public.models;
SELECT COUNT(*) as total_agents FROM public.agents;  
SELECT COUNT(*) as total_colors FROM public.colors;

-- Mensagem de sucesso
DO $$
BEGIN
  RAISE NOTICE '✅ Políticas corrigidas - recursão eliminada!';
  RAISE NOTICE '✅ Todos usuários autenticados podem ler models, agents e colors';
  RAISE NOTICE '✅ Apenas service_role pode modificar (via API)';
  RAISE NOTICE '';
  RAISE NOTICE '📋 TESTE AGORA:';
  RAISE NOTICE '1. Recarregue localhost:3000 (Ctrl+F5)';
  RAISE NOTICE '2. Vá para criar novo pedido';
  RAISE NOTICE '3. Os dropdowns devem funcionar!';
END $$;
