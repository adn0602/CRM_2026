import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import type { ImovelPronto } from '../types'

export default function ImoveisProntos() {
  const [itens, setItens] = useState<ImovelPronto[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase
      .from('imoveis_prontos')
      .select('*')
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        setItens((data as ImovelPronto[]) ?? [])
        setLoading(false)
      })
  }, [])

  return (
    <div>
      <h1 className="text-xl font-semibold mb-4">Imóveis prontos</h1>
      {loading && <p className="text-slate-500">Carregando…</p>}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {itens.map((i) => (
          <div key={i.id} className="bg-white border rounded-lg p-4">
            <div className="font-medium">{i.titulo}</div>
            <div className="text-sm text-slate-500">{i.bairro ?? '—'} · {i.area_m2 ? `${i.area_m2}m²` : '—'}</div>
            <div className="text-xs text-slate-400 mt-1">
              {i.valor != null ? `R$ ${i.valor.toLocaleString('pt-BR')}` : '—'} · {i.vendido ? 'Vendido' : 'Disponível'}
            </div>
          </div>
        ))}
        {!loading && itens.length === 0 && (
          <p className="text-sm text-slate-400">Nenhum imóvel cadastrado ainda.</p>
        )}
      </div>
    </div>
  )
}
