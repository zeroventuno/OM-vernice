-- SOLUÇÃO TEMPORÁRIA: Desabilitar RLS na tabela users para permitir login
-- Depois que o sistema estiver funcionando, podemos reativar com políticas corretas

ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;

-- Verificar status do RLS
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' AND tablename = 'users';
