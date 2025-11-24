# Corrigir Problema de Sessão no Vercel

## O Problema Identificado

O screenshot mostra: **Sessão: ❌ Nenhuma**

Isso significa que você NÃO está logado no Vercel, por isso redireciona para login ao tentar editar.

**Causa Raiz:** O Supabase não está salvando a sessão (cookies) corretamente no domínio do Vercel.

---

## Solução: Configurar URLs Autorizadas no Supabase

### Passo 1: Pegar URL do seu app no Vercel

1. No Vercel Dashboard, copie a URL do seu projeto
   - Exemplo: `https://seu-app.vercel.app`
   - Ou use uma custom domain se tiver

### Passo 2: Configurar no Supabase

1. **Acesse o Supabase Dashboard**
   - Vá para: https://supabase.com/dashboard
   - Selecione seu projeto

2. **Vá para Authentication**
   - No menu lateral, clique em **"Authentication"**
   - Clique em **"URL Configuration"**

3. **Adicione as URLs do Vercel**

   Na seção **"Site URL"**:
   ```
   https://seu-app.vercel.app
   ```

   Na seção **"Redirect URLs"** (adicione TODAS estas):
   ```
   http://localhost:3000/**
   https://seu-app.vercel.app/**
   https://*.vercel.app/**
   ```

   ⚠️ **IMPORTANTE:** O `**` no final é necessário!

4. **Clique em "Save"**

### Passo 3: Verificar Additional Redirect URLs

Ainda em **URL Configuration**, role para baixo até **"Additional Redirect URLs"**

Adicione (se não estiver):
```
http://localhost:3000/auth/callback
https://seu-app.vercel.app/auth/callback
```

### Passo 4: Verificar Configuração de Cookies

Em **Authentication → Settings**:

- **Secure cookie:** Deve estar **LIGADO** (ON)
- **Same-Site:** Deve estar como **"lax"** ou **"none"**

---

## Teste Após Configurar

1. **Aguarde 1-2 minutos** para o Supabase processar as mudanças

2. **Limpe o cache do navegador:**
   - `Ctrl+Shift+Delete` (Windows) ou `Cmd+Shift+Delete` (Mac)
   - Marque "Cookies" e "Cache"
   - Limpar

3. **Teste o Login no Vercel:**
   - Vá para `https://seu-app.vercel.app`
   - Faça logout (se estiver logado)
   - Faça login novamente
   - Vá para `/test-direct` e veja se mostra "Sessão: ✅ Ativa"

4. **Se mostrar "✅ Ativa", tente editar um pedido**

---

## Se Ainda Não Funcionar

### Verifique se o problema é de CORS

No Supabase Dashboard → **Project Settings → API**:

Role até **"CORS"** e verifique se sua URL do Vercel está listada.

Se não estiver, adicione:
```
https://seu-app.vercel.app
```

### Teste em Modo Anônimo

1. Abra uma janela anônima/privada do navegador
2. Acesse `https://seu-app.vercel.app`
3. Faça login
4. Veja se a sessão persiste

Se funcionar no modo anônimo mas não no normal, o problema são cookies bloqueados no seu navegador.

---

## Checklist Completo

- [ ] 1. Adicionar URL do Vercel em "Site URL" no Supabase
- [ ] 2. Adicionar `https://seu-app.vercel.app/**` em "Redirect URLs"
- [ ] 3. Adicionar `https://*.vercel.app/**` em "Redirect URLs"
- [ ] 4. Habilitar "Secure cookie" no Supabase
- [ ] 5. Limpar cookies do navegador
- [ ] 6. Fazer logout e login novamente no Vercel
- [ ] 7. Testar `/test-direct` para ver se sessão está ativa
- [ ] 8. Se sessão ativa, testar edição de pedido

---

## Resultado Esperado

Após estas configurações, quando você acessar `/test-direct`:

```
✅ Sessão: Ativa
✅ User ID: sua-uuid
✅ Email: seu@email.com
✅ Usuário encontrado: admin@officinemattio.com
✅ Acesso a pedidos OK
```

Aí sim o botão de Editar vai funcionar!
