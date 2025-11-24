# Como Limpar Cache do Vercel e Forçar Redeploy

## Método 1: Redeploy sem Cache (Mais Rápido)

1. **Acesse o Vercel Dashboard**
   - Vá para: https://vercel.com/dashboard
   - Selecione seu projeto

2. **Vá para Deployments**
   - Clique na aba **"Deployments"**

3. **Redeploy o último deployment**
   - Encontre o deployment mais recente (o primeiro da lista)
   - Clique nos **três pontos** (...) no lado direito
   - Clique em **"Redeploy"**

4. **IMPORTANTE: Desmarque "Use existing Build Cache"**
   - Na janela que abrir, você verá uma opção:
     ```
     ☐ Use existing Build Cache
     ```
   - **DESMARQUE** esta opção (deixe desmarcada)
   
5. **Clique em "Redeploy"**
   - Aguarde o build completar (geralmente 1-3 minutos)
   - Você verá o status na aba "Building..."

---

## Método 2: Limpar Todo o Cache do Projeto (Mais Completo)

Se o Método 1 não resolver, use este:

1. **Acesse Settings do Projeto**
   - No dashboard do projeto, clique em **"Settings"**

2. **Vá para a seção "General"**
   - Role a página até encontrar **"Build & Development Settings"**

3. **Procure por "Caching"**
   - Role mais ainda até a seção **"Caching"** ou **"Build Cache"**

4. **Clique em "Clear Build Cache"**
   - Clique no botão vermelho **"Clear Build Cache"**
   - Confirme a ação

5. **Faça um novo deployment**
   - Vá para **Deployments** → três pontos → **Redeploy**
   - Certifique-se que **"Use existing Build Cache"** está DESMARCADO

---

## Método 3: Forçar Recompilação via Git

Este método força o Vercel a fazer um build completamente novo:

1. **Faça uma pequena alteração no código**
   ```bash
   cd /Users/cristianocunha/Documents/Antigravity/Projetos/Verniciatura
   ```

2. **Adicione um comentário em qualquer arquivo**
   Por exemplo, edite `README.md` e adicione uma linha:
   ```
   <!-- Cache clear: 2025-11-21 18:49 -->
   ```

3. **Commit e push**
   ```bash
   git add .
   git commit -m "Force rebuild - clear cache"
   git push origin main
   ```

4. **O Vercel vai detectar o push e fazer um novo build automático**

---

## Teste ANTES de Testar a Edição

Após o redeploy, teste esta URL PRIMEIRO:

```
https://seu-app.vercel.app/test-direct
```

Esta página **NÃO usa o layout do dashboard**, então vai nos dizer se:
- ✅ A autenticação está funcionando
- ✅ O Supabase está conectado
- ✅ As políticas RLS permitem acesso

**ME ENVIE UM SCREENSHOT DESTA PÁGINA!**

---

## Se Ainda Não Funcionar

Se após limpar o cache e ver `/test-direct` funcionando, mas `/orders/[id]/edit` ainda redirecionar:

1. **Abra o console do navegador** (F12)
2. Vá para a aba **Console**
3. Clique em "Editar"
4. **Copie TODOS os logs** que aparecem (principalmente os que começam com `[getCurrentUser]` e `[EditOrderPage]`)
5. Me envie os logs

---

## Dica Extra: Limpar Cache do NAVEGADOR

Às vezes o cache é do navegador, não do Vercel:

1. **No Chrome/Edge:**
   - Pressione `Ctrl+Shift+Delete` (Windows) ou `Cmd+Shift+Delete` (Mac)
   - Selecione "Imagens e arquivos em cache"
   - Clique em "Limpar dados"

2. **Ou use Modo Anônimo/Privado:**
   - `Ctrl+Shift+N` (Windows) ou `Cmd+Shift+N` (Mac)
   - Acesse seu app do Vercel no modo anônimo
   - Teste se funciona

---

## Checklist Completo (Faça nesta ordem):

- [ ] 1. Redeploy no Vercel SEM cache (Método 1)
- [ ] 2. Aguardar build completar
- [ ] 3. Limpar cache do navegador (Ctrl+Shift+Delete)
- [ ] 4. Acessar `/test-direct` e me enviar screenshot
- [ ] 5. Se `/test-direct` funcionar, tentar editar um pedido
- [ ] 6. Se ainda falhar, copiar logs do console e me enviar

Com essas etapas vamos isolar exatamente onde está o problema!
