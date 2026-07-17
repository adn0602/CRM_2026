import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { ETAPAS_NEGOCIO, type Negocio } from '../types'

export default function Negocios() {
  const [negocios, setNegocios] = useState<Negocio[]>([])
  const [loading, setLoading] = useState(true)
  const [erro, setErro] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      setLoading(true)
      const { data, error } = await supabase
        .from('negocios')
        .select('*, clientes(*)')
        .order('created_at', { ascending: false })

      if (error) setErro(error.message)
      else setNegocios((data as Negocio[]) ?? [])
      setLoading(false)
    }
    load()
  }, [])

  if (loading) return <p className="text-slate-500">Carregando negócios…</p>
  if (erro) return <p className="text-red-600">Erro: {erro}</p>

  return (
    <div>
      <h1 className="text-xl font-semibold mb-4">Funil de Negócios</h1>
      <div className="flex gap-4 overflow-x-auto pb-4">
        {ETAPAS_NEGOCIO.map((etapa) => {
          const itens = negocios.filter((n) => n.etapa === etapa)
          return (
            <div key={etapa} className="min-w-[260px] bg-white rounded-lg border p-3">
              <h2 className="text-sm font-medium text-slate-600 mb-2">
                {etapa} <span className="text-slate-400">({itens.length})</span>
              </h2>
              <div className="flex flex-col gap-2">
                {itens.map((n) => (
                  <div key={n.id} className="rounded border p-2 text-sm bg-slate-50">
                    <div className="font-medium">{n.clientes?.nome ?? n.titulo ?? 'Sem nome'}</div>
                    {n.comissao_prevista != null && (
                      <div className="text-xs text-slate-500">
                        Comissão prevista: R$ {n.comissao_prevista.toLocaleString('pt-BR')}
                      </div>
                    )}
                  </div>
                ))}
                {itens.length === 0 && (
                  <p className="text-xs text-slate-400">Nenhum negócio nesta etapa.</p>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
