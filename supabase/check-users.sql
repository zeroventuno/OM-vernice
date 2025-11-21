-- Verificar todos os usuários e seus status
SELECT 
  u.id,
  u.email,
  u.role,
  u.status,
  u.created_at,
  au.email_confirmed_at,
  au.last_sign_in_at
FROM public.users u
LEFT JOIN auth.users au ON u.id = au.id
ORDER BY u.created_at DESC;

-- Verificar se há usuários na tabela auth.users mas não na public.users
SELECT 
  au.id,
  au.email,
  au.created_at,
  au.email_confirmed_at
FROM auth.users au
LEFT JOIN public.users pu ON au.id = pu.id
WHERE pu.id IS NULL;
