# Teste de Debug para Vercel

## Objetivo
Identificar exatamente onde e por que o sistema está falhando no Vercel (produção) mas funcionando no localhost.

## Passos para Debug no Vercel

### 1. Abrir Console do Navegador
1. Acesse sua aplicação no Vercel
2. Pressione `F12` ou `Cmd+Option+I` (Mac) para abrir DevTools
3. Vá na aba **Console**
4. Limpe o console (ícone 🚫)

### 2. Reproduzir o Erro
1. Faça login normalmente
2. Vá para a página de Pedidos
3. Clique no botão de **Editar** (ícone de lápis) em qualquer pedido
4. **IMEDIATAMENTE** olhe no console

### 3. O Que Procurar no Console

#### Erros Comuns no Vercel:

**A. Erro de Importação/Módulo:**
```
Error: Cannot find module 'date-fns/locale/...'
Module not found
```

**B. Erro de Autenticação:**
```
Error: User not authenticated
Error: Invalid session
```

**C. Erro de Supabase RLS:**
```
Error: row-level security policy
Error: permission denied for table orders
```

**D. Erro de Tradução:**
```
Error: Cannot read property 'editOrderPage' of undefined
TypeError: t.orders.editOrderPage is not defined
```

**E. Erro de Carregamento:**
```
Error loading order
404 Not Found
```

### 4. Verificar a Aba Network

1. Vá na aba **Network** do DevTools
2. Clique em **Editar** novamente
3. Procure por requisições em **vermelho** (failed)
4. Clique na requisição falha e veja:
   - Status Code (401, 403, 404, 500?)
   - Response (mensagem de erro)

### 5. Informações Necessárias

Por favor me envie:

1. **Mensagem de erro exata do Console**
2. **Stack trace** (se houver)
3. **Status code** de qualquer requisição falha
4. **URL que tentou acessar** quando clicou em editar

### 6. Teste Adicional - URL Direta

Tente acessar a URL de edição diretamente:
```
https://seu-app.vercel.app/orders/[algum-id-valido]/edit
```

- Funciona? Ou redireciona para login?
- Se redireciona, qual erro aparece no console?

---

## Possíveis Causas e Soluções

### Causa 1: Variáveis de Ambiente
**Sintoma:** Erro 401/403 ou "User not authenticated"

**Solução:**
- Verificar se `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY` estão configuradas no Vercel
- Ir em: Vercel Dashboard → Seu Projeto → Settings → Environment Variables

### Causa 2: RLS Policies do Supabase
**Sintoma:** "permission denied" ou "row-level security policy"

**Solução:**
- As políticas de RLS podem estar bloqueando SELECT na tabela orders
- Verificar se o usuário tem permissão para SELECT na produção

### Causa 3: Build/Bundle do Next.js
**Sintoma:** "Module not found" ou "Cannot find module"

**Solução:**
- Limpar cache do Vercel
- Forçar novo deploy

### Causa 4: Session/Cookie
**Sintoma:** Redireciona para login sem erro específico

**Solução:**
- Possível problema com cookies entre domínios
- Verificar configuração do Supabase para o domínio do Vercel

---

## Me Envie:
1. Screenshot do Console com o erro
2. Screenshot da aba Network (se houver requisição falha)
3. A URL exata que está tentando acessar

Com essas informações conseguirei identificar o problema exato!
