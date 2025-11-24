# Sistema de Gestão de Pintura - Verniciatura

Sistema completo de gerenciamento de pedidos de pintura de bicicletas para a Officine Mattio.

## 🚀 Funcionalidades

- ✅ **Autenticação Segura**: Login e registro com validação de domínio @officinemattio.com
- ✅ **Aprovação de Usuários**: Sistema de aprovação manual por administradores
- ✅ **Gestão de Pedidos**: Formulário completo para especificação de pintura
- ✅ **Histórico de Edições**: Rastreamento automático de todas as alterações
- ✅ **Exportação Excel**: Exportação de pedidos selecionados
- ✅ **Geração de PDF**: Fichas profissionais em formato A5
- ✅ **Notificações por Email**: Envio automático para matteo@officinemattio.com
- ✅ **Interface Premium**: Design moderno e responsivo

## 📋 Pré-requisitos

- Node.js 18+ instalado
- Conta no Supabase
- Conta no Resend (para emails)
- Conta no Vercel (para deploy)

## 🛠️ Configuração

### 1. Instalar Dependências

```bash
npm install
```

### 2. Configurar Supabase

1. Crie um projeto no [Supabase](https://supabase.com)
2. Execute o script SQL em `supabase/schema.sql` no SQL Editor do Supabase
3. Copie as credenciais do projeto

### 3. Configurar Resend

1. Crie uma conta no [Resend](https://resend.com)
2. Gere uma API Key
3. **Importante**: Configure o domínio de envio ou use o domínio de teste

### 4. Variáveis de Ambiente

Copie `.env.local.example` para `.env.local` e preencha:

```env
NEXT_PUBLIC_SUPABASE_URL=sua_url_do_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anon
SUPABASE_SERVICE_ROLE_KEY=sua_service_role_key
RESEND_API_KEY=sua_api_key_do_resend
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 5. Criar Primeiro Admin

Após executar o schema SQL, você precisa criar manualmente o primeiro usuário admin:

1. Registre-se no sistema com o email: `admin@officinemattio.com`
2. No Supabase, vá em Authentication > Users
3. Copie o UUID do usuário criado
4. No SQL Editor, execute:

```sql
UPDATE public.users 
SET role = 'admin', status = 'approved' 
WHERE email = 'admin@officinemattio.com';
```

## 🚀 Executar Localmente

```bash
npm run dev
```

Acesse: http://localhost:3000

## 📦 Deploy no Vercel

### 1. Conectar ao GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin seu_repositorio_github
git push -u origin main
```

### 2. Deploy no Vercel

1. Acesse [Vercel](https://vercel.com)
2. Importe o repositório do GitHub
3. Configure as variáveis de ambiente (mesmas do `.env.local`)
4. Deploy!

## 📚 Estrutura do Projeto

```
├── app/
│   ├── (dashboard)/          # Páginas protegidas
│   │   ├── dashboard/        # Dashboard principal
│   │   ├── orders/           # Gestão de pedidos
│   │   └── admin/            # Painel admin
│   ├── auth/                 # Autenticação
│   ├── api/                  # API routes
│   └── globals.css           # Estilos globais
├── components/               # Componentes React
├── lib/                      # Utilitários
│   ├── auth.ts              # Funções de autenticação
│   ├── supabase.ts          # Cliente Supabase
│   ├── data.ts              # Dados de referência
│   ├── excel.ts             # Exportação Excel
│   └── pdf.ts               # Geração de PDF
└── supabase/
    └── schema.sql           # Schema do banco de dados
```

## 🎨 Customização

### Adicionar Novos Modelos

No Supabase SQL Editor:

```sql
INSERT INTO public.models (name) VALUES ('Nome do Modelo');
```

### Adicionar Novos Agentes

```sql
INSERT INTO public.agents (name) VALUES ('Nome do Agente');
```

### Adicionar Novas Cores

```sql
INSERT INTO public.colors (name, hex_code) VALUES ('Nome da Cor', '#HEXCODE');
```

## 📧 Configuração de Email

O sistema usa Resend para envio de emails. Para produção:

1. Adicione e verifique seu domínio no Resend
2. Atualize o `from` em `app/api/send-email/route.ts`:

```typescript
from: 'Verniciatura <noreply@seudominio.com>',
```

## 🔒 Segurança

- ✅ Row Level Security (RLS) habilitado no Supabase
- ✅ Validação de domínio de email
- ✅ Aprovação manual de usuários
- ✅ Autenticação JWT via Supabase
- ✅ Variáveis de ambiente protegidas

## 📱 Funcionalidades Principais

### Para Usuários

1. **Criar Pedidos**: Formulário completo com todas as especificações
2. **Editar Pedidos**: Qualquer usuário pode editar qualquer pedido
3. **Ver Histórico**: Visualizar todas as edições feitas em cada pedido
4. **Exportar**: Excel, impressão ou PDF de pedidos selecionados

### Para Administradores

1. **Aprovar Usuários**: Gerenciar solicitações de acesso
2. **Todas as funcionalidades de usuário**

## 🐛 Troubleshooting

### Erro ao enviar email

- Verifique se a API Key do Resend está correta
- Confirme que o domínio está verificado (ou use o domínio de teste)

### Erro de autenticação

- Verifique as credenciais do Supabase
- Confirme que o schema SQL foi executado corretamente

### Erro ao gerar PDF

- Verifique se a biblioteca jsPDF está instalada
- Confirme que há pedidos selecionados

## 📄 Licença

Propriedade da Officine Mattio

## 👨‍💻 Suporte

Para suporte, entre em contato com o administrador do sistema.
# Force rebuild Mon Nov 24 11:36:37 CET 2025
