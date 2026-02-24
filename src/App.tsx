import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster'
import { Toaster as Sonner } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import { AppProvider } from '@/stores/main'

import Layout from './components/Layout'
import Index from './pages/Index'
import Locations from './pages/Locations'
import Students from './pages/Students'
import Finance from './pages/Finance'
import Workouts from './pages/Workouts'
import Settings from './pages/Settings'
import Tenants from './pages/Tenants'
import Plans from './pages/Plans'
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
          <Route element={<Layout />}>
            <Route path="/" element={<Index />} />
            <Route path="/locais" element={<Locations />} />
            <Route path="/alunos" element={<Students />} />
            <Route path="/financeiro" element={<Finance />} />
            <Route path="/treinos" element={<Workouts />} />
            <Route path="/configuracoes" element={<Settings />} />
            <Route path="/inquilinos" element={<Tenants />} />
            <Route path="/planos" element={<Plans />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </TooltipProvider>
    </BrowserRouter>
  </AppProvider>
)

export default App
