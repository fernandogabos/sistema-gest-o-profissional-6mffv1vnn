import useAppStore from '@/stores/main'
import { startOfWeek, endOfWeek, isWithinInterval, parseISO } from 'date-fns'
import { formatBRL } from '@/lib/formatters'
import { Activity, Clock, DollarSign, XCircle, UserX } from 'lucide-react'

export function AgendaStats() {
  const { events, currentUser } = useAppStore()
  const myEvents = events.filter((e) => e.userId === currentUser.id)

  const start = startOfWeek(new Date(), { weekStartsOn: 1 })
  const end = endOfWeek(new Date(), { weekStartsOn: 1 })

  const weekEvents = myEvents.filter((e) =>
    isWithinInterval(parseISO(e.date), { start, end }),
  )
  const sessions = weekEvents.filter((e) => e.type === 'session')
  const performed = sessions.filter((e) => e.status === 'performed')
  const canceled = sessions.filter(
    (e) => e.status === 'canceled_student' || e.status === 'canceled_pro',
  )
  const noShows = sessions.filter((e) => e.status === 'no_show')

  const hoursWorked = performed.reduce((acc, ev) => {
    const [h, m] = ev.startTime.split(':').map(Number)
    const [eh, em] = ev.endTime.split(':').map(Number)
    return acc + (eh * 60 + em - (h * 60 + m)) / 60
  }, 0)

  const billing = performed.reduce((acc, ev) => acc + ev.value, 0)
  const cancelRate = sessions.length
    ? (canceled.length / sessions.length) * 100
    : 0
  const noShowRate = sessions.length
    ? (noShows.length / sessions.length) * 100
    : 0

  return (
    <div className="flex gap-6 p-3 border-b bg-card text-sm overflow-x-auto whitespace-nowrap shadow-sm z-10 shrink-0">
      <div className="flex items-center gap-3 border-r pr-6">
        <div className="p-2 bg-primary/10 rounded-md text-primary">
          <Clock className="w-5 h-5" />
        </div>
        <div>
          <p className="text-xs text-muted-foreground font-medium">
            Horas na Semana
          </p>
          <p className="font-bold text-lg leading-tight">
            {hoursWorked.toFixed(1)}h
          </p>
        </div>
      </div>
      <div className="flex items-center gap-3 border-r pr-6">
        <div className="p-2 bg-emerald-100 rounded-md text-emerald-600">
          <DollarSign className="w-5 h-5" />
        </div>
        <div>
          <p className="text-xs text-muted-foreground font-medium">
            Faturamento (Semana)
          </p>
          <p className="font-bold text-emerald-600 text-lg leading-tight">
            {formatBRL(billing)}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-3 border-r pr-6">
        <div className="p-2 bg-blue-100 rounded-md text-blue-600">
          <Activity className="w-5 h-5" />
        </div>
        <div>
          <p className="text-xs text-muted-foreground font-medium">
            Realizadas / Agendadas
          </p>
          <p className="font-bold text-lg leading-tight">
            {performed.length}{' '}
            <span className="text-muted-foreground text-sm font-normal">
              / {sessions.length}
            </span>
          </p>
        </div>
      </div>
      <div className="flex items-center gap-3 border-r pr-6">
        <div className="p-2 bg-rose-100 rounded-md text-rose-600">
          <XCircle className="w-5 h-5" />
        </div>
        <div>
          <p className="text-xs text-muted-foreground font-medium">
            Taxa Cancelamento
          </p>
          <p className="font-bold text-rose-600 text-lg leading-tight">
            {cancelRate.toFixed(1)}%
          </p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="p-2 bg-orange-100 rounded-md text-orange-600">
          <UserX className="w-5 h-5" />
        </div>
        <div>
          <p className="text-xs text-muted-foreground font-medium">
            Taxa de Faltas
          </p>
          <p className="font-bold text-orange-600 text-lg leading-tight">
            {noShowRate.toFixed(1)}%
          </p>
        </div>
      </div>
    </div>
  )
}
