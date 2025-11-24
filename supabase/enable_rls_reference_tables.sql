-- ==========================================
-- HABILITAR RLS EM TODAS AS TABELAS DE REFERÊNCIA
-- ==========================================

-- 1. HABILITAR RLS NAS TABELAS DE REFERÊNCIA
ALTER TABLE public.models ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.colors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.edit_history ENABLE ROW LEVEL SECURITY;

-- 2. CRIAR POLÍTICAS PARA LEITURA PÚBLICA (Todos usuários autenticados podem ler)

-- Políticas para MODELS
DROP POLICY IF EXISTS "Anyone can view models" ON public.models;
CREATE POLICY "Anyone can view models" ON public.models
  FOR SELECT 
  TO authenticated
  USING (true);

-- Políticas para AGENTS  
DROP POLICY IF EXISTS "Anyone can view agents" ON public.agents;
CREATE POLICY "Anyone can view agents" ON public.agents
  FOR SELECT 
  TO authenticated
  USING (true);

-- Políticas para COLORS
DROP POLICY IF EXISTS "Anyone can view colors" ON public.colors;
CREATE POLICY "Anyone can view colors" ON public.colors
  FOR SELECT 
  TO authenticated
  USING (true);

-- Políticas para EDIT_HISTORY
DROP POLICY IF EXISTS "Anyone can view edit history" ON public.edit_history;
CREATE POLICY "Anyone can view edit history" ON public.edit_history
  FOR SELECT 
  TO authenticated
  USING (true);

-- Permite que usuários autenticados criem entradas de histórico
DROP POLICY IF EXISTS "Users can insert edit history" ON public.edit_history;
CREATE POLICY "Users can insert edit history" ON public.edit_history
  FOR INSERT 
  TO authenticated
  WITH CHECK (auth.uid() = edited_by);

-- 3. POLÍTICAS PARA ADMINISTRAÇÃO (apenas admins podem modificar)

-- Models - apenas admins podem inserir/atualizar/deletar
DROP POLICY IF EXISTS "Admins can manage models" ON public.models;
CREATE POLICY "Admins can manage models" ON public.models
  FOR ALL
  TO authenticated
  USING (
    (SELECT role FROM public.users WHERE id = auth.uid()) = 'admin'
  )
  WITH CHECK (
    (SELECT role FROM public.users WHERE id = auth.uid()) = 'admin'
  );

-- Agents - apenas admins podem inserir/atualizar/deletar
DROP POLICY IF EXISTS "Admins can manage agents" ON public.agents;
CREATE POLICY "Admins can manage agents" ON public.agents
  FOR ALL
  TO authenticated
  USING (
    (SELECT role FROM public.users WHERE id = auth.uid()) = 'admin'
  )
  WITH CHECK (
    (SELECT role FROM public.users WHERE id = auth.uid()) = 'admin'
  );

-- Colors - apenas admins podem inserir/atualizar/deletar
DROP POLICY IF EXISTS "Admins can manage colors" ON public.colors;
CREATE POLICY "Admins can manage colors" ON public.colors
  FOR ALL
  TO authenticated
  USING (
    (SELECT role FROM public.users WHERE id = auth.uid()) = 'admin'
  )
  WITH CHECK (
    (SELECT role FROM public.users WHERE id = auth.uid()) = 'admin'
  );

-- 4. VERIFICAR SE AS ORDENS ESTÃO VISÍVEIS
-- Ver todas as ordens (para debug)
SELECT COUNT(*) as total_orders FROM public.orders;

-- 5. VERIFICAÇÃO FINAL
SELECT 
  schemaname, 
  tablename, 
  rowsecurity,
  CASE 
    WHEN rowsecurity THEN '✅ RLS Enabled'
    ELSE '❌ RLS Disabled'
  END as status
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('users', 'orders', 'edit_history', 'models', 'agents', 'colors')
ORDER BY tablename;

-- Listar todas as políticas
SELECT 
  tablename,
  policyname,
  cmd as operation,
  CASE 
    WHEN roles::text LIKE '%authenticated%' THEN 'authenticated users'
    ELSE roles::text
  END as applies_to
FROM pg_policies
WHERE schemaname = 'public'
AND tablename IN ('users', 'orders', 'edit_history', 'models', 'agents', 'colors')
ORDER BY tablename, policyname;

-- Mensagem de sucesso
DO $$
BEGIN
  RAISE NOTICE '✅ RLS habilitado em todas as tabelas de referência!';
  RAISE NOTICE '✅ Modelos, Agentes e Cores agora estão acessíveis';
  RAISE NOTICE '✅ Histórico de edições configurado';
  RAISE NOTICE '';
  RAISE NOTICE '📋 PRÓXIMOS PASSOS:';
  RAISE NOTICE '1. Recarregue a página do Vercel (Ctrl+F5)';
  RAISE NOTICE '2. Tente criar um novo pedido';
  RAISE NOTICE '3. Os dropdowns de Modelo, Agente e Cor devem funcionar';
  RAISE NOTICE '4. Verifique se os pedidos antigos aparecem na lista';
END $$;
