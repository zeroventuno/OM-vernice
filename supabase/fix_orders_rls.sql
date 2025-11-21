-- Verificar políticas RLS atuais da tabela orders
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies
WHERE tablename = 'orders'
ORDER BY policyname;

-- Se não houver políticas ou se estiverem bloqueando, use este SQL para criar políticas corretas:

-- Remover políticas antigas (se existirem)
DROP POLICY IF EXISTS "Users can view all orders" ON public.orders;
DROP POLICY IF EXISTS "Users can insert orders" ON public.orders;
DROP POLICY IF EXISTS "Users can update orders" ON public.orders;
DROP POLICY IF EXISTS "Users can delete orders" ON public.orders;
DROP POLICY IF EXISTS "Admins can delete orders" ON public.orders;

-- Habilitar RLS na tabela orders (se não estiver habilitado)
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Política para SELECT (leitura) - todos os usuários autenticados podem ver todos os pedidos
CREATE POLICY "Users can view all orders" ON public.orders
  FOR SELECT 
  TO authenticated
  USING (true);

-- Política para INSERT - usuários autenticados podem criar pedidos
CREATE POLICY "Users can insert orders" ON public.orders
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = created_by);

-- Política para UPDATE - usuários autenticados podem atualizar qualquer pedido
CREATE POLICY "Users can update orders" ON public.orders
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Política para DELETE - apenas admins podem deletar
CREATE POLICY "Admins can delete orders" ON public.orders
  FOR DELETE
  TO authenticated
  USING (
    (SELECT role FROM public.users WHERE id = auth.uid()) = 'admin'
  );

-- Verificar se as políticas foram criadas
SELECT schemaname, tablename, policyname, permissive, roles, cmd
FROM pg_policies
WHERE tablename = 'orders'
ORDER BY policyname;
