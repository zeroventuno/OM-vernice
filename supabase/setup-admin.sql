-- Promover admin@officinemattio.com para admin e aprovar
UPDATE public.users
SET role = 'admin', status = 'approved'
WHERE email = 'admin@officinemattio.com';

-- Aprovar todos os outros usuários (opcional - remova se quiser aprovar manualmente)
-- UPDATE public.users
-- SET status = 'approved'
-- WHERE email != 'admin@officinemattio.com' AND status = 'pending';

-- Verificar os usuários
SELECT id, email, role, status, created_at
FROM public.users
ORDER BY created_at DESC;
