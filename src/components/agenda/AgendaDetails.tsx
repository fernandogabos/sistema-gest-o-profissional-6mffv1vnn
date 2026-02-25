import useAppStore from '@/stores/main'
import { Button } from '@/components/ui/button'
import {
  X,
  MapPin,
  User,
  DollarSign,
  Clock,
  FileText,
  Activity,
  AlertTriangle,
} from 'lucide-react'
import { formatBRL, formatDate } from '@/lib/formatters'
import { Badge } from '@/components/ui/badge'

interface Props {
  eventId: string
  onClose: () => void
  onEdit: () => void
}

export function AgendaDetails({ eventId, onClose, onEdit }: Props) {
  const { events, students, locations, updateEvent } = useAppStore()
  const event = events.find((e) => e.id === eventId)
  if (!event) return null

  const student = students.find((s) => s.id === event.studentId)
  const loc = locations.find((l) => l.id === event.locationId)

  const markAsPerformed = () => {
    updateEvent(event.id, { status: 'performed' })
  }

  const markNoShow = () => {
    updateEvent(event.id, { status: 'no_show' })
  }

  return (
    <div className="w-80 shrink-0 border-l bg-card p-5 flex flex-col gap-6 overflow-y-auto animate-fade-in-down shadow-xl z-30">
      <div className="flex justify-between items-start">
        <h3 className="font-bold text-lg leading-tight">{event.title}</h3>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="h-6 w-6 -mr-2 -mt-2"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="space-y-4 text-sm">
        <div className="flex items-center gap-2 text-muted-foreground bg-muted/50 p-2 rounded-md border border-border/50">
          <Clock className="h-4 w-4 text-primary" />
          <span className="font-medium text-foreground">
            {formatDate(event.date)} • {event.startTime} - {event.endTime}
          </span>
        </div>

        {event.type === 'session' ? (
          <>
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 p-1.5 rounded-full">
                <User className="h-4 w-4 text-primary" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground">Aluno</span>
                <span className="font-medium">
                  {student?.nome || 'Nenhum aluno vinculado'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="bg-primary/10 p-1.5 rounded-full">
                <MapPin className="h-4 w-4 text-primary" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground">Local</span>
                <span className="font-medium">
                  {loc?.name || 'Local não definido'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="bg-primary/10 p-1.5 rounded-full">
                <DollarSign className="h-4 w-4 text-primary" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground">
                  Financeiro
                </span>
                <span className="font-medium">
                  Bruto: {formatBRL(event.value)}
                </span>
                <span className="text-xs text-emerald-600">
                  Líquido: {formatBRL(event.netValue)}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="bg-primary/10 p-1.5 rounded-full">
                <Activity className="h-4 w-4 text-primary" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground">Status</span>
                <Badge
                  variant={
                    event.status === 'performed'
                      ? 'default'
                      : event.status.includes('cancel')
                        ? 'destructive'
                        : 'outline'
                  }
                  className="mt-1 w-fit"
                >
                  {event.status === 'scheduled'
                    ? 'Agendado'
                    : event.status === 'confirmed'
                      ? 'Confirmado'
                      : event.status === 'performed'
                        ? 'Realizado'
                        : event.status === 'no_show'
                          ? 'Falta do Aluno'
                          : 'Cancelado'}
                </Badge>
              </div>
            </div>
          </>
        ) : (
          <div className="flex items-center gap-3">
            <div className="bg-muted p-1.5 rounded-full">
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground">
                Motivo do Bloqueio
              </span>
              <span className="font-medium capitalize">
                {event.blockReason || 'Pessoal'}
              </span>
            </div>
          </div>
        )}

        {event.notes && (
          <div className="bg-yellow-50 text-yellow-900 border border-yellow-200 p-3 rounded-md text-xs">
            <FileText className="h-3 w-3 inline mr-1 mb-0.5" /> {event.notes}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-2 mt-auto pt-4 border-t border-border/50">
        <Button variant="outline" className="w-full" onClick={onEdit}>
          Editar Detalhes
        </Button>
        {event.status !== 'performed' && event.type === 'session' && (
          <>
            <Button
              variant="default"
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm"
              onClick={markAsPerformed}
            >
              Marcar como Realizada
            </Button>
            {event.status !== 'no_show' && (
              <Button
                variant="ghost"
                className="w-full text-orange-600 hover:text-orange-700 hover:bg-orange-50"
                onClick={markNoShow}
              >
                Registrar Falta
              </Button>
            )}
          </>
        )}
      </div>
    </div>
  )
}
