# CRM 2026

CRM imobiliário próprio (Zona Sul / Barra / Recreio - RJ), com funil de vendas,
clientes, lançamentos, imóveis prontos e controle de comissões.

Stack: React + TypeScript + Vite + Tailwind CSS v4 + Supabase.

## Configuração

1. Crie um projeto gratuito em https://supabase.com
2. No SQL Editor do Supabase, rode o conteúdo de `supabase/schema.sql`
3. Copie `.env.example` para `.env` e preencha com as credenciais do seu projeto Supabase
   (Project Settings > API > Project URL e anon public key)
4. `npm install`
5. `npm run dev`

## Deploy (Vercel)

1. Suba este repositório no GitHub
2. Importe o repositório em https://vercel.com/new
3. Configure as mesmas duas variáveis de ambiente (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY) em Project Settings > Environment Variables
4. Deploy
