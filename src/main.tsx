import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App.tsx'
import Negocios from './pages/Negocios.tsx'
import Clientes from './pages/Clientes.tsx'
import Empreendimentos from './pages/Empreendimentos.tsx'
import ImoveisProntos from './pages/ImoveisProntos.tsx'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<Negocios />} />
          <Route path="clientes" element={<Clientes />} />
          <Route path="empreendimentos" element={<Empreendimentos />} />
          <Route path="imoveis-prontos" element={<ImoveisProntos />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
