import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import useAppStore from '@/stores/main'
import { MapPin, Users, Calendar, QrCode } from 'lucide-react'
import { formatBRL } from '@/lib/formatters'
import { useToast } from '@/hooks/use-toast'

export function AcademyEvents() {
  const { academyContents } = useAppStore()
  const { toast } = useToast()
  const events = academyContents.filter((c) => c.type === 'event')

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {events.map((event) => (
        <Card key={event.id} className="flex flex-col overflow-hidden group">
          <div className="h-40 bg-muted relative">
            <img
              src={event.thumbnailUrl}
              alt={event.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
            />
            <Badge className="absolute top-2 right-2">
              {event.format === 'hybrid' ? 'Híbrido' : 'Presencial'}
            </Badge>
          </div>
          <CardContent className="p-6 flex-1 flex flex-col">
            <h3 className="text-xl font-bold mb-2">{event.title}</h3>
            <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
              {event.description}
            </p>

            <div className="space-y-2 text-sm mt-auto mb-6 bg-muted/30 p-3 rounded-md">
              <div className="flex items-center justify-between text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" /> {event.date} às {event.time}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" /> Sede Principal
                </span>
              </div>
              <div className="flex items-center justify-between text-muted-foreground border-t pt-2 mt-2">
                <span className="flex items-center gap-1">
                  <Users className="w-4 h-4" /> Vagas: {event.enrolledCount} /{' '}
                  {event.capacity || 'Ilimitado'}
                </span>
                <span className="font-bold text-primary">
                  {event.isFree ? 'Gratuito' : formatBRL(event.price)}
                </span>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                className="flex-1"
                onClick={() =>
                  toast({
                    title: 'Lista de Espera',
                    description:
                      'Você foi adicionado à lista de espera com sucesso.',
                  })
                }
              >
                Garantir Vaga
              </Button>
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    title="Check-in via QR Code"
                  >
                    <QrCode className="w-4 h-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-xs text-center flex flex-col items-center">
                  <DialogHeader>
                    <DialogTitle>Check-in do Evento</DialogTitle>
                  </DialogHeader>
                  <div className="bg-white p-4 rounded-lg border shadow-sm my-4">
                    <img
                      src={`https://img.usecurling.com/i?q=qr%20code&shape=lineal-color&color=black`}
                      alt="QR Code"
                      className="w-48 h-48"
                    />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Apresente este QR Code na recepção do evento para confirmar
                    sua presença rapidamente.
                  </p>
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
