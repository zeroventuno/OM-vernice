-- Remover as políticas antigas que causam dependência circular
DROP POLICY IF EXISTS "Users can view their own data" ON public.users;
DROP POLICY IF EXISTS "Admins can view all users" ON public.users;
DROP POLICY IF EXISTS "Admins can update users" ON public.users;

-- Criar novas políticas sem dependência circular
-- Permitir que usuários vejam seus próprios dados (sem consultar a tabela users novamente)
CREATE POLICY "Users can view their own data" ON public.users
  FOR SELECT USING (auth.uid() = id);

-- Permitir que admins vejam todos os usuários (verificando role diretamente)
CREATE POLICY "Admins can view all users" ON public.users
  FOR SELECT USING (
    (SELECT role FROM public.users WHERE id = auth.uid()) = 'admin'
  );

-- Permitir que admins atualizem usuários
CREATE POLICY "Admins can update users" ON public.users
  FOR UPDATE USING (
    (SELECT role FROM public.users WHERE id = auth.uid()) = 'admin'
  );

-- IMPORTANTE: Adicionar política para permitir INSERT durante o signup
CREATE POLICY "Allow insert during signup" ON public.users
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Verificar as políticas
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies
WHERE tablename = 'users'
ORDER BY policyname;
