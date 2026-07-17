export type EtapaNegocio =
  | 'Novo lead'
  | '1º contato'
  | 'Qualificação'
  | 'Apresentação de opções'
  | 'Visita / Stand'
  | 'Proposta'
  | 'Negociação'
  | 'Documentação / Crédito'
  | 'Fechado – Ganho'
  | 'Fechado – Perdido'
  | 'Pós-venda'

export const ETAPAS_NEGOCIO: EtapaNegocio[] = [
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
  'Pós-venda',
]

export type Regiao = 'Zona Sul' | 'Sudoeste'

export type OrigemLead =
  | 'Inforce'
  | 'Lista da imobiliária'
  | 'Indicação'
  | 'Redes sociais'
  | 'Portais'

export const ORIGENS_LEAD: OrigemLead[] = [
  'Inforce',
  'Lista da imobiliária',
  'Indicação',
  'Redes sociais',
  'Portais',
]

export const BAIRROS = [
  'Ipanema',
  'Leblon',
  'Barra da Tijuca',
  'Recreio dos Bandeirantes',
  'Barra Olímpica',
]

export interface Cliente {
  id: string
  nome: string
  telefone: string | null
  email: string | null
  origem: OrigemLead | null
  bairro_interesse: string[] | null
  regiao_interesse: Regiao | null
  observacoes: string | null
  created_at: string
  updated_at: string
}

export interface Negocio {
  id: string
  cliente_id: string | null
  etapa: EtapaNegocio
  titulo: string | null
  regiao: Regiao | null
  comissao_pct: number | null
  tipo_comissao: '% do valor' | 'Valor fixo' | null
  valor_base: number | null
  comissao_prevista: number | null
  status_comissao: 'A prever' | 'Prevista' | 'A receber' | 'Recebida' | 'Cancelada' | null
  data_prevista_recebimento: string | null
  comissao_recebida: number | null
  data_recebimento: string | null
  diferenca_comissao: number | null
  unidade_id: string | null
  imovel_pronto_id: string | null
  created_at: string
  updated_at: string
  clientes?: Cliente
}

export interface Empreendimento {
  id: string
  nome: string
  incorporadora: string | null
  bairro: string | null
  regiao: Regiao | null
  comissao_padrao_pct: number | null
  regra_pagamento: string | null
  created_at: string
  updated_at: string
}

export interface Tipologia {
  id: string
  empreendimento_id: string | null
  nome: string
  area_m2: number | null
  quartos: number | null
  suites: number | null
  vagas: number | null
  valor_base: number | null
  created_at: string
  updated_at: string
}

export interface ImovelPronto {
  id: string
  titulo: string
  bairro: string | null
  regiao: Regiao | null
  area_m2: number | null
  quartos: number | null
  suites: number | null
  vagas: number | null
  valor: number | null
  vendido: boolean
  created_at: string
  updated_at: string
}

export interface Atividade {
  id: string
  negocio_id: string | null
  cliente_id: string | null
  tipo: string | null
  descricao: string | null
  data_atividade: string
  concluida: boolean
  created_at: string
}
