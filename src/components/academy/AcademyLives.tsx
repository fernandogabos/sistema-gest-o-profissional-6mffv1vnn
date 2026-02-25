import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import useAppStore from '@/stores/main'
import { Video, Calendar, Clock, Bell } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

export function AcademyLives() {
  const { academyContents } = useAppStore()
  const { toast } = useToast()
  const lives = academyContents.filter(
    (c) => c.type === 'live' || c.type === 'mentorship',
  )

  return (
    <div className="space-y-4">
      {lives.map((live) => (
        <Card key={live.id}>
          <CardContent className="p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
              <Video className="w-8 h-8" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <Badge variant="outline">
                  {live.format === 'live'
                    ? 'Live ao Vivo'
                    : 'Mentoria Especial'}
                </Badge>
                <Badge
                  variant="secondary"
                  className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100 border-none"
                >
                  {live.isFree ? 'Gratuito' : `Premium`}
                </Badge>
              </div>
              <h3 className="text-xl font-bold">{live.title}</h3>
              <p className="text-muted-foreground text-sm mb-2">
                {live.description}
              </p>
              <div className="flex items-center gap-4 text-sm font-medium">
                <span className="flex items-center gap-1 text-muted-foreground">
                  <Calendar className="w-4 h-4" /> {live.date}
                </span>
                <span className="flex items-center gap-1 text-muted-foreground">
                  <Clock className="w-4 h-4" /> {live.time}
                </span>
              </div>
            </div>
            <div className="flex flex-col gap-2 shrink-0 w-full sm:w-auto mt-4 sm:mt-0">
              <Button
                onClick={() => window.open(live.link, '_blank')}
                className="w-full"
              >
                <Video className="w-4 h-4 mr-2" /> Entrar na Sala
              </Button>
              <Button
                variant="outline"
                onClick={() =>
                  toast({
                    title: 'Lembrete Ativado',
                    description:
                      'Você será notificado minutos antes do início.',
                  })
                }
              >
                <Bell className="w-4 h-4 mr-2" /> Receber Lembrete
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
      {lives.length === 0 && (
        <div className="text-center py-12 text-muted-foreground border border-dashed rounded-lg bg-muted/20">
          Nenhuma live programada no momento.
        </div>
      )}
    </div>
  )
}
