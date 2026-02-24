import { Bell, User } from 'lucide-react'
import { SidebarTrigger } from '@/components/ui/sidebar'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import useAppStore from '@/stores/main'

export function AppHeader() {
  const { locations, currentLocationId, setCurrentLocation } = useAppStore()

  return (
    <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b bg-background px-4 shadow-sm z-10 sticky top-0">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="-ml-1" />
        <div className="hidden md:block w-px h-6 bg-border mx-2" />
        <Select value={currentLocationId} onValueChange={setCurrentLocation}>
          <SelectTrigger className="w-[200px] border-none shadow-none focus:ring-0 font-medium">
            <SelectValue placeholder="Selecione o Local" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os Locais</SelectItem>
            {locations.map((loc) => (
              <SelectItem key={loc.id} value={loc.id}>
                {loc.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="relative text-muted-foreground"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute top-2 right-2.5 h-2 w-2 rounded-full bg-destructive" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full bg-primary/10 text-primary hover:bg-primary/20 hover:text-primary"
        >
          <User className="h-5 w-5" />
        </Button>
      </div>
    </header>
  )
}
