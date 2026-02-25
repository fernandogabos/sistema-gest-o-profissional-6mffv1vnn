import { format, startOfWeek, addDays, isSameDay, startOfMonth } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import useAppStore from '@/stores/main'
import { cn } from '@/lib/utils'
import { ScrollArea } from '@/components/ui/scroll-area'
import { AgendaView } from '@/pages/Agenda'
import { AlertTriangle } from 'lucide-react'
import { AgendaEvent } from '@/stores/mockData'

interface Props {
  selectedDate: Date
  view: AgendaView
  selectedEventId: string | null
  setSelectedEventId: (id: string | null) => void
}

export function AgendaGrid({
  selectedDate,
  view,
  selectedEventId,
  setSelectedEventId,
}: Props) {
  const { events, currentUser, updateEvent } = useAppStore()

  const myEvents = ['master_admin'].includes(currentUser.role)
    ? events.filter((e) => e.tenantId === currentUser.tenantId)
    : events.filter((e) => e.userId === currentUser.id)

  const start =
    view === 'day'
      ? selectedDate
      : view === 'month'
        ? startOfWeek(startOfMonth(selectedDate), { weekStartsOn: 1 })
        : startOfWeek(selectedDate, { weekStartsOn: 1 })

  const daysCount =
    view === 'day' ? 1 : view === 'workWeek' ? 5 : view === 'month' ? 35 : 7
  const days = Array.from({ length: daysCount }, (_, i) => addDays(start, i))
  const hours = Array.from({ length: 17 }, (_, i) => i + 6)

  const handleDrop = (e: React.DragEvent, date: Date, hour: number) => {
    const id = e.dataTransfer.getData('eventId')
    if (id) {
      const event = myEvents.find((ev) => ev.id === id)
      if (event) {
        const [oh, om] = event.startTime.split(':').map(Number)
        const [eh, em] = event.endTime.split(':').map(Number)
        const dur = eh * 60 + em - (oh * 60 + om)

        const newStart = `${hour.toString().padStart(2, '0')}:00`
        const newEndHour = Math.floor((hour * 60 + dur) / 60)
        const newEndMin = (hour * 60 + dur) % 60
        const newEnd = `${newEndHour.toString().padStart(2, '0')}:${newEndMin.toString().padStart(2, '0')}`

        updateEvent(id, {
          date: format(date, 'yyyy-MM-dd'),
          startTime: newStart,
          endTime: newEnd,
        })
      }
    }
  }

  const hasConflict = (ev: AgendaEvent, dayEvents: AgendaEvent[]) => {
    if (ev.type === 'block') return false
    const sorted = [...dayEvents].sort((a, b) =>
      a.startTime.localeCompare(b.startTime),
    )
    const idx = sorted.findIndex((e) => e.id === ev.id)
    if (idx > 0) {
      const prev = sorted[idx - 1]
      if (prev.type === 'session' && prev.locationId !== ev.locationId) {
        const [ph, pm] = prev.endTime.split(':').map(Number)
        const [ch, cm] = ev.startTime.split(':').map(Number)
        const diff = ch * 60 + cm - (ph * 60 + pm)
        if (diff >= 0 && diff < 30) return true
      }
    }
    return false
  }

  if (view === 'month') {
    return (
      <div className="flex-1 flex flex-col bg-card overflow-hidden">
        <div className="grid grid-cols-7 border-b bg-muted/10">
          {['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'].map((d) => (
            <div
              key={d}
              className="p-2 text-center border-r font-medium text-sm"
            >
              {d}
            </div>
          ))}
        </div>
        <div className="flex-1 grid grid-cols-7 grid-rows-5 overflow-y-auto">
          {days.map((d) => {
            const dateStr = format(d, 'yyyy-MM-dd')
            const dayEvents = myEvents
              .filter((e) => e.date === dateStr)
              .sort((a, b) => a.startTime.localeCompare(b.startTime))
            const isToday = isSameDay(d, new Date())
            return (
              <div
                key={dateStr}
                className={cn(
                  'border-r border-b p-1 min-h-[100px]',
                  d.getMonth() !== selectedDate.getMonth() &&
                    'opacity-50 bg-muted/20',
                )}
              >
                <div
                  className={cn(
                    'text-xs font-medium text-muted-foreground mb-1 text-center w-6 h-6 leading-6 mx-auto rounded-full',
                    isToday && 'bg-primary text-primary-foreground',
                  )}
                >
                  {format(d, 'd')}
                </div>
                <div className="flex flex-col gap-1">
                  {dayEvents.slice(0, 4).map((ev) => (
                    <div
                      key={ev.id}
                      onClick={() => setSelectedEventId(ev.id)}
                      className={cn(
                        'text-[10px] px-1 py-0.5 rounded truncate cursor-pointer',
                        selectedEventId === ev.id ? 'ring-1 ring-primary' : '',
                        ev.type === 'block'
                          ? 'bg-muted text-muted-foreground'
                          : 'bg-primary/10 text-primary',
                      )}
                    >
                      {ev.startTime} - {ev.title}
                    </div>
                  ))}
                  {dayEvents.length > 4 && (
                    <div className="text-[10px] text-muted-foreground text-center">
                      +{dayEvents.length - 4} mais
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col bg-card overflow-hidden relative">
      <div className="flex border-b bg-muted/10 sticky top-0 z-20 shadow-sm">
        <div className="w-16 shrink-0 border-r" />
        {days.map((d) => (
          <div
            key={d.toISOString()}
            className="flex-1 text-center py-2 border-r font-medium text-sm"
          >
            {format(d, 'EEEE', { locale: ptBR })} <br />
            <span
              className={cn(
                'text-xl mt-1 inline-flex items-center justify-center',
                isSameDay(d, new Date()) &&
                  'bg-primary text-primary-foreground rounded-full w-8 h-8',
              )}
            >
              {format(d, 'd')}
            </span>
          </div>
        ))}
      </div>
      <ScrollArea className="flex-1">
        <div className="flex relative" style={{ height: hours.length * 60 }}>
          <div className="w-16 shrink-0 border-r flex flex-col bg-card relative z-10">
            {hours.map((h) => (
              <div
                key={h}
                className="h-[60px] text-xs text-right pr-2 text-muted-foreground pt-1 border-b border-transparent relative -top-3"
              >
                {h}:00
              </div>
            ))}
          </div>
          {days.map((d) => {
            const dateStr = format(d, 'yyyy-MM-dd')
            const dayEvents = myEvents.filter((e) => e.date === dateStr)
            return (
              <div key={d.toISOString()} className="flex-1 border-r relative">
                {hours.map((h) => (
                  <div
                    key={h}
                    className="h-[60px] border-b border-border/40 hover:bg-muted/10 transition-colors"
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => handleDrop(e, d, h)}
                  />
                ))}
                {dayEvents.map((ev) => {
                  const [h, m] = ev.startTime.split(':').map(Number)
                  const [eh, em] = ev.endTime.split(':').map(Number)
                  const top = h * 60 + m - 6 * 60
                  const height = eh * 60 + em - (h * 60 + m)
                  const conflict = hasConflict(ev, dayEvents)
                  return (
                    <div
                      key={ev.id}
                      draggable
                      onDragStart={(e) =>
                        e.dataTransfer.setData('eventId', ev.id)
                      }
                      onClick={() => setSelectedEventId(ev.id)}
                      className={cn(
                        'absolute left-1 right-1 rounded px-2 py-1 text-xs cursor-pointer shadow-sm border transition-all overflow-hidden group hover:z-20',
                        selectedEventId === ev.id
                          ? 'ring-2 ring-primary z-20'
                          : 'z-10 opacity-90 hover:opacity-100',
                        ev.type === 'block'
                          ? 'bg-muted text-muted-foreground border-muted-foreground/20'
                          : ev.status === 'performed'
                            ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                            : ev.status === 'scheduled'
                              ? 'bg-blue-100 text-blue-800 border-blue-200'
                              : 'bg-primary/10 text-primary border-primary/20',
                      )}
                      style={{ top: `${top}px`, height: `${height}px` }}
                    >
                      <div className="font-semibold truncate flex justify-between items-center">
                        {ev.title}
                        {conflict && (
                          <AlertTriangle
                            className="w-3 h-3 text-rose-500"
                            title="Conflito Logístico"
                          />
                        )}
                      </div>
                      <div className="truncate opacity-80">
                        {ev.startTime} - {ev.endTime}
                      </div>
                    </div>
                  )
                })}
              </div>
            )
          })}
        </div>
      </ScrollArea>
    </div>
  )
}
