import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster'
import { Toaster as Sonner } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import { AppProvider } from '@/stores/main'

import Layout from './components/Layout'
import Landing from './pages/Landing'
import Index from './pages/Index'
import Locations from './pages/Locations'
import Students from './pages/Students'
import Finance from './pages/Finance'
import Billing from './pages/Billing'
import Workouts from './pages/Workouts'
import Settings from './pages/Settings'
import Tenants from './pages/Tenants'
import Plans from './pages/Plans'
import Sessions from './pages/Sessions'
import Evaluations from './pages/Evaluations'
import Communication from './pages/Communication'
import Agenda from './pages/Agenda'
import Academy from './pages/Academy'
import NotFound from './pages/NotFound'

const App = () => (
  <AppProvider>
    <BrowserRouter
      future={{ v7_startTransition: false, v7_relativeSplatPath: false }}
    >
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<Index />} />
            <Route path="/agenda" element={<Agenda />} />
            <Route path="/locais" element={<Locations />} />
            <Route path="/alunos" element={<Students />} />
            <Route path="/avaliacoes" element={<Evaluations />} />
            <Route path="/comunicacao" element={<Communication />} />
            <Route path="/financeiro" element={<Finance />} />
            <Route path="/cobrancas" element={<Billing />} />
            <Route path="/sessoes" element={<Sessions />} />
            <Route path="/treinos" element={<Workouts />} />
            <Route path="/configuracoes" element={<Settings />} />
            <Route path="/inquilinos" element={<Tenants />} />
            <Route path="/planos" element={<Plans />} />
            <Route path="/academia" element={<Academy />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </TooltipProvider>
    </BrowserRouter>
  </AppProvider>
)

export default App
