import { Bell } from 'lucide-react'
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
  const {
    locations,
    currentLocationId,
    setCurrentLocation,
    currentUser,
    users,
    setCurrentUser,
  } = useAppStore()

  const userLocations = locations.filter(
    (l) => l.tenantId === currentUser.tenantId,
  )

  return (
    <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b bg-background px-4 shadow-sm z-10 sticky top-0">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="-ml-1" />
        <div className="hidden md:block w-px h-6 bg-border mx-2" />

        {currentUser.role !== 'master_admin' && (
          <Select value={currentLocationId} onValueChange={setCurrentLocation}>
            <SelectTrigger className="w-[200px] border-none shadow-none focus:ring-0 font-medium">
              <SelectValue placeholder="Selecione o Local" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os Locais</SelectItem>
              {userLocations.map((loc) => (
                <SelectItem key={loc.id} value={loc.id}>
                  {loc.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 bg-muted/50 rounded-md p-1 pl-3">
          <span className="text-xs text-muted-foreground mr-1">View as:</span>
          <Select value={currentUser.id} onValueChange={setCurrentUser}>
            <SelectTrigger className="h-8 border-none bg-transparent shadow-none w-[180px] font-medium">
              <SelectValue />
            </SelectTrigger>
            <SelectContent align="end">
              {users.map((u) => (
                <SelectItem key={u.id} value={u.id}>
                  {u.fullName} ({u.role})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="relative text-muted-foreground"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute top-2 right-2.5 h-2 w-2 rounded-full bg-destructive" />
        </Button>
        <div className="h-8 w-8 rounded-full overflow-hidden border">
          <img
            src={currentUser.avatarUrl}
            alt={currentUser.fullName}
            className="object-cover w-full h-full"
          />
        </div>
      </div>
    </header>
  )
}
