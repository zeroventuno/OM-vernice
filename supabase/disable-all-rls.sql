-- Desabilitar RLS em todas as tabelas para desenvolvimento
-- Isso permite que o sistema funcione completamente enquanto desenvolvemos

ALTER TABLE public.orders DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.edit_history DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.models DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.agents DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.colors DISABLE ROW LEVEL SECURITY;

-- Verificar status do RLS em todas as tabelas
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
ORDER BY tablename;
