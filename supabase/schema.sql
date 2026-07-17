-- ============================================================
-- CRM 2026 (RJ) — Schema inicial para Supabase (Postgres)
-- Rode este arquivo inteiro no SQL Editor do Supabase.
-- ============================================================

-- ---------- ENUMS (listas padrão) ----------

create type etapa_negocio as enum (
  'Novo lead',
  '1º contato',
  'Qualificação',
  'Apresentação de opções',
  'Visita / Stand',
  'Proposta',
  'Negociação',
  'Documentação / Crédito',
  'Fechado – Ganho',
  'Fechado – Perdido',
  'Pós-venda'
);

create type regiao as enum (
  'Zona Sul',
  'Sudoeste'
);

create type origem_lead as enum (
  'Inforce',
  'Lista da imobiliária',
  'Indicação',
  'Redes sociais',
  'Portais'
);

create type tipo_comissao as enum (
  '% do valor',
  'Valor fixo'
);

create type status_comissao as enum (
  'A prever',
  'Prevista',
  'A receber',
  'Recebida',
  'Cancelada'
);

-- ---------- TABELAS PRINCIPAIS ----------

-- 1. Clientes
create table clientes (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  telefone text,
  email text,
  origem origem_lead,
  bairro_interesse text[],           -- multi-select de bairros
  regiao_interesse regiao,
  observacoes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 5. Empreendimentos (Lançamentos)
create table empreendimentos (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  incorporadora text,
  bairro text,
  regiao regiao,
  comissao_padrao_pct numeric(5,2),
  regra_pagamento text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 6. Tipologias (vinculadas a um empreendimento)
create table tipologias (
  id uuid primary key default gen_random_uuid(),
  empreendimento_id uuid references empreendimentos(id) on delete cascade,
  nome text not null,                -- ex: "2 quartos c/ suíte - 68m²"
  area_m2 numeric(8,2),
  quartos int,
  suites int,
  vagas int,
  valor_base numeric(14,2),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 7. Imóveis prontos
create table imoveis_prontos (
  id uuid primary key default gen_random_uuid(),
  titulo text not null,
  bairro text,
  regiao regiao,
  area_m2 numeric(8,2),
  quartos int,
  suites int,
  vagas int,
  valor numeric(14,2),
  vendido boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 8. Unidades (Fechamento) — unidade específica vendida em um lançamento
create table unidades (
  id uuid primary key default gen_random_uuid(),
  empreendimento_id uuid references empreendimentos(id),
  tipologia_id uuid references tipologias(id),
  numero_unidade text,
  valor_fechamento numeric(14,2),
  data_fechamento date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 1. Negócios (Funil de Vendas)
create table negocios (
  id uuid primary key default gen_random_uuid(),
  cliente_id uuid references clientes(id) on delete cascade,
  etapa etapa_negocio not null default 'Novo lead',
  titulo text,
  regiao regiao,

  -- Comissão
  comissao_pct numeric(5,2),
  tipo_comissao tipo_comissao,
  valor_base numeric(14,2),
  comissao_prevista numeric(14,2) generated always as (
    case
      when tipo_comissao = '% do valor' and valor_base is not null and comissao_pct is not null
        then round(valor_base * comissao_pct / 100, 2)
      else null
    end
  ) stored,
  status_comissao status_comissao default 'A prever',
  data_prevista_recebimento date,
  comissao_recebida numeric(14,2),
  data_recebimento date,
  diferenca_comissao numeric(14,2) generated always as (
    case
      when comissao_recebida is not null then
        comissao_recebida - coalesce(
          case
            when tipo_comissao = '% do valor' and valor_base is not null and comissao_pct is not null
              then round(valor_base * comissao_pct / 100, 2)
            else null
          end, 0)
      else null
    end
  ) stored,

  -- vínculo com fechamento
  unidade_id uuid references unidades(id),
  imovel_pronto_id uuid references imoveis_prontos(id),

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 3. Atividades (Follow-up)
create table atividades (
  id uuid primary key default gen_random_uuid(),
  negocio_id uuid references negocios(id) on delete cascade,
  cliente_id uuid references clientes(id) on delete cascade,
  tipo text,                         -- ex: ligação, whatsapp, e-mail, reunião
  descricao text,
  data_atividade timestamptz not null default now(),
  concluida boolean not null default false,
  created_at timestamptz not null default now()
);

-- 4. Apresentações / Visitas (ponte entre Negócios e Tipologias/Imóveis prontos)
create table apresentacoes (
  id uuid primary key default gen_random_uuid(),
  negocio_id uuid references negocios(id) on delete cascade,
  tipologia_id uuid references tipologias(id),
  imovel_pronto_id uuid references imoveis_prontos(id),
  data_apresentacao timestamptz not null default now(),
  observacoes text,
  created_at timestamptz not null default now(),

  constraint apresentacao_um_vinculo check (
    (tipologia_id is not null and imovel_pronto_id is null) or
    (tipologia_id is null and imovel_pronto_id is not null)
  )
);

-- Parceiros / Incorporadoras
create table parceiros (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  tipo text,                         -- ex: incorporadora, corretor parceiro
  contato text,
  telefone text,
  email text,
  created_at timestamptz not null default now()
);

-- ---------- ÍNDICES ----------
create index idx_negocios_cliente on negocios(cliente_id);
create index idx_negocios_etapa on negocios(etapa);
create index idx_atividades_negocio on atividades(negocio_id);
create index idx_tipologias_empreendimento on tipologias(empreendimento_id);
create index idx_apresentacoes_negocio on apresentacoes(negocio_id);

-- ---------- ROW LEVEL SECURITY ----------
-- Habilita RLS em todas as tabelas. Como é uso individual (você),
-- a policy libera tudo para usuários autenticados.
alter table clientes enable row level security;
alter table negocios enable row level security;
alter table atividades enable row level security;
alter table apresentacoes enable row level security;
alter table empreendimentos enable row level security;
alter table tipologias enable row level security;
alter table imoveis_prontos enable row level security;
alter table unidades enable row level security;
alter table parceiros enable row level security;

create policy "authenticated_full_access" on clientes for all using (auth.role() = 'authenticated');
create policy "authenticated_full_access" on negocios for all using (auth.role() = 'authenticated');
create policy "authenticated_full_access" on atividades for all using (auth.role() = 'authenticated');
create policy "authenticated_full_access" on apresentacoes for all using (auth.role() = 'authenticated');
create policy "authenticated_full_access" on empreendimentos for all using (auth.role() = 'authenticated');
create policy "authenticated_full_access" on tipologias for all using (auth.role() = 'authenticated');
create policy "authenticated_full_access" on imoveis_prontos for all using (auth.role() = 'authenticated');
create policy "authenticated_full_access" on unidades for all using (auth.role() = 'authenticated');
create policy "authenticated_full_access" on parceiros for all using (auth.role() = 'authenticated');
