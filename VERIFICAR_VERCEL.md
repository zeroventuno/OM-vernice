# Checklist Vercel - Configuração Crítica

## 1. Variáveis de Ambiente do Vercel

Acesse: **Vercel Dashboard → Seu Projeto → Settings → Environment Variables**

### Verifique se TODAS estas variáveis estão configuradas:

✅ **NEXT_PUBLIC_SUPABASE_URL**
- Exemplo: `https://xxxxxxxxxxxxx.supabase.co`
- ⚠️ DEVE começar com `NEXT_PUBLIC_`

✅ **NEXT_PUBLIC_SUPABASE_ANON_KEY**
- Exemplo: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
- ⚠️ DEVE começar com `NEXT_PUBLIC_`
- ⚠️ É uma string MUITO longa (~200+ caracteres)

✅ **RESEND_API_KEY** (se estiver usando)
- Exemplo: `re_xxxxxxxxxxxxxxxxxxxxx`

### ⚠️ IMPORTANTE:
- As variáveis devem estar em **todos os ambientes**: Production, Preview, Development
- Após adicionar/modificar, você DEVE fazer **Redeploy** manualmente

## 2. Verificar Build Logs do Vercel

1. Vá em: **Vercel Dashboard → Deployments**
2. Clique no deployment mais recente
3. Vá na aba **Build Logs**
4. Procure por erros ou warnings

Procure especificamente por:
- ❌ `Error: Environment variable not found`
- ❌ `Module not found`
- ⚠️ `Warning: Missing environment variables`

## 3. Verificar Runtime Logs

1. Ainda na página do deployment
2. Vá na aba **Runtime Logs** ou **Functions**
3. Clique em "Stream Logs"
4. Tente acessar a página de edição no Vercel
5. Veja o que aparece nos logs em tempo real

## 4. Teste de Diagnóstico

Vou criar uma página de diagnóstico para você testar. 

Acesse no Vercel:
```
https://seu-app.vercel.app/test-auth
```

Esta página vai mostrar:
- ✅ Se as variáveis de ambiente estão carregadas
- ✅ Se o Supabase está conectado
- ✅ Se o usuário está autenticado
- ✅ Status do usuário

## 5. Limpar Cache do Vercel

Se mesmo com tudo certo ainda não funcionar:

1. Vá em: **Vercel Dashboard → Settings**
2. Role até **Caching**
3. Clique em **Clear Build Cache**
4. Faça um novo deploy

## 6. Forçar Redeploy

Depois de verificar tudo:

1. Vá em **Deployments**
2. No último deployment, clique nos "..." (três pontos)
3. Clique em **Redeploy**
4. Marque **"Use existing Build Cache"** como **OFF**

---

## Me informe:

1. ✅ Todas as variáveis de ambiente estão configuradas no Vercel?
2. ✅ Há algum erro nos Build Logs?
3. ✅ O que aparece nos Runtime Logs ao tentar editar?
4. ✅ A página de teste `/test-auth` funciona ou dá erro?

Com essas informações conseguirei identificar o problema exato!
