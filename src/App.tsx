import { NavLink, Outlet } from 'react-router-dom'

const links = [
  { to: '/', label: 'Negócios', end: true },
  { to: '/clientes', label: 'Clientes' },
  { to: '/empreendimentos', label: 'Empreendimentos' },
  { to: '/imoveis-prontos', label: 'Imóveis prontos' },
]

export default function App() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b bg-white">
        <div className="mx-auto max-w-6xl px-4 py-4 flex items-center gap-8">
          <span className="font-semibold text-lg">CRM 2026</span>
          <nav className="flex gap-4 text-sm">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.end}
                className={({ isActive }) =>
                  isActive
                    ? 'text-slate-900 font-medium'
                    : 'text-slate-500 hover:text-slate-900'
                }
              >
                {l.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-6">
        <Outlet />
      </main>
    </div>
  )
}
