import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { ORIGENS_LEAD, type Cliente, type OrigemLead } from '../types'

export default function Clientes() {
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [loading, setLoading] = useState(true)
  const [erro, setErro] = useState<string | null>(null)
  const [nome, setNome] = useState('')
  const [telefone, setTelefone] = useState('')
  const [origem, setOrigem] = useState<OrigemLead | ''>('')
  const [salvando, setSalvando] = useState(false)

  async function load() {
    setLoading(true)
    const { data, error } = await supabase
      .from('clientes')
      .select('*')
      .order('created_at', { ascending: false })
    if (error) setErro(error.message)
    else setClientes((data as Cliente[]) ?? [])
    setLoading(false)
  }

  useEffect(() => {
    load()
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!nome.trim()) return
    setSalvando(true)
    const { error } = await supabase.from('clientes').insert({
      nome,
      telefone: telefone || null,
      origem: origem || null,
    })
    setSalvando(false)
    if (error) {
      setErro(error.message)
      return
    }
    setNome('')
    setTelefone('')
    setOrigem('')
    load()
  }

  return (
    <div>
      <h1 className="text-xl font-semibold mb-4">Clientes</h1>

      <form onSubmit={handleSubmit} className="bg-white border rounded-lg p-4 mb-6 flex flex-wrap gap-3 items-end">
        <div>
          <label className="block text-xs text-slate-500 mb-1">Nome</label>
          <input
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            className="border rounded px-2 py-1 text-sm"
            placeholder="Nome do cliente"
          />
        </div>
        <div>
          <label className="block text-xs text-slate-500 mb-1">Telefone</label>
          <input
            value={telefone}
            onChange={(e) => setTelefone(e.target.value)}
            className="border rounded px-2 py-1 text-sm"
            placeholder="(21) 90000-0000"
          />
        </div>
        <div>
          <label className="block text-xs text-slate-500 mb-1">Origem</label>
          <select
            value={origem}
            onChange={(e) => setOrigem(e.target.value as OrigemLead)}
            className="border rounded px-2 py-1 text-sm"
          >
            <option value="">—</option>
            {ORIGENS_LEAD.map((o) => (
              <option key={o} value={o}>{o}</option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          disabled={salvando}
          className="bg-slate-900 text-white text-sm rounded px-3 py-1.5 disabled:opacity-50"
        >
          {salvando ? 'Salvando…' : 'Adicionar cliente'}
        </button>
      </form>

      {loading && <p className="text-slate-500">Carregando…</p>}
      {erro && <p className="text-red-600">Erro: {erro}</p>}

      <div className="bg-white border rounded-lg divide-y">
        {clientes.map((c) => (
          <div key={c.id} className="px-4 py-2 flex justify-between text-sm">
            <span className="font-medium">{c.nome}</span>
            <span className="text-slate-500">{c.telefone ?? '—'} · {c.origem ?? '—'}</span>
          </div>
        ))}
        {!loading && clientes.length === 0 && (
          <p className="px-4 py-3 text-sm text-slate-400">Nenhum cliente cadastrado ainda.</p>
        )}
      </div>
    </div>
  )
}
