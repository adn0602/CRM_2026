import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import type { Empreendimento } from '../types'

export default function Empreendimentos() {
  const [itens, setItens] = useState<Empreendimento[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase
      .from('empreendimentos')
      .select('*')
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        setItens((data as Empreendimento[]) ?? [])
        setLoading(false)
      })
  }, [])

  return (
    <div>
      <h1 className="text-xl font-semibold mb-4">Empreendimentos (Lançamentos)</h1>
      {loading && <p className="text-slate-500">Carregando…</p>}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {itens.map((e) => (
          <div key={e.id} className="bg-white border rounded-lg p-4">
            <div className="font-medium">{e.nome}</div>
            <div className="text-sm text-slate-500">{e.incorporadora ?? '—'} · {e.bairro ?? '—'}</div>
            {e.comissao_padrao_pct != null && (
              <div className="text-xs text-slate-400 mt-1">Comissão padrão: {e.comissao_padrao_pct}%</div>
            )}
          </div>
        ))}
        {!loading && itens.length === 0 && (
          <p className="text-sm text-slate-400">Nenhum empreendimento cadastrado ainda.</p>
        )}
      </div>
    </div>
  )
}
