import { Link, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  Users,
  MapPin,
  CircleDollarSign,
  Dumbbell,
  Settings,
} from 'lucide-react'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
} from '@/components/ui/sidebar'
import useAppStore from '@/stores/main'

export function AppSidebar() {
  const location = useLocation()
  const { theme } = useAppStore()

  const navItems = [
    { title: 'Dashboard', url: '/', icon: LayoutDashboard },
    { title: 'Alunos', url: '/alunos', icon: Users },
    { title: 'Locais', url: '/locais', icon: MapPin },
    { title: 'Financeiro', url: '/financeiro', icon: CircleDollarSign },
    { title: 'Treinos', url: '/treinos', icon: Dumbbell },
    { title: 'Configurações', url: '/configuracoes', icon: Settings },
  ]

  return (
    <Sidebar variant="inset">
      <SidebarHeader className="h-16 flex items-center justify-center border-b border-border/50">
        <div className="flex items-center gap-2 px-4 w-full">
          <img
            src={theme.logoUrl}
            alt="Logo"
            className="w-8 h-8 rounded-md bg-primary/10 p-1"
          />
          <span className="font-semibold text-lg truncate">{theme.name}</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu Principal</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={location.pathname === item.url}
                    tooltip={item.title}
                  >
                    <Link to={item.url}>
                      <item.icon className="w-4 h-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
