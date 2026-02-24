import { Outlet } from 'react-router-dom'
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar'
import { AppSidebar } from './AppSidebar'
import { AppHeader } from './AppHeader'
import useAppStore, { themeOptions } from '@/stores/main'

export default function Layout() {
  const { theme } = useAppStore()

  // Apply dynamic white-label theme variables
  const activeTheme =
    themeOptions[theme.primaryColor as keyof typeof themeOptions] ||
    themeOptions.blue
  const styleVars = {
    '--primary': activeTheme.primary,
    // Provide a subtle secondary tone based on primary for highlights
    '--secondary': activeTheme.secondary,
  } as React.CSSProperties

  return (
    <div
      style={styleVars}
      className="min-h-screen bg-background text-foreground transition-colors duration-300 font-sans"
    >
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset className="bg-muted/10">
          <AppHeader />
          <main className="flex-1 overflow-y-auto">
            <Outlet />
          </main>
        </SidebarInset>
      </SidebarProvider>
    </div>
  )
}
