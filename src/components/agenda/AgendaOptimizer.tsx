import { useState, useMemo } from 'react'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import useAppStore from '@/stores/main'
import { startOfWeek, addDays, format, parseISO, getDay } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Star, Clock, TrendingUp, Sparkles } from 'lucide-react'
import { formatBRL } from '@/lib/formatters'
import { cn } from '@/lib/utils'

interface Slot {
  date: string
  dateObj: Date
  startTime: string
  duration: number
  score: number
  attendanceRate: number
  avgRevenue: number
}

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  selectedDate: Date
  onSelectSlot: (slot: Slot) => void
}

export function AgendaOptimizer({
  open,
  onOpenChange,
  selectedDate,
  onSelectSlot,
}: Props) {
  const { events, currentUser } = useAppStore()
  const [minDuration, setMinDuration] = useState(50)
  const [travelMargin, setTravelMargin] = useState(30)

  const suggestions = useMemo(() => {
    const start = startOfWeek(selectedDate, { weekStartsOn: 1 })
    const myEvents = events.filter((e) => e.userId === currentUser.id)

    const historicalStats: Record<
      string,
      { netRevenue: number; attended: number; total: number }
    > = {}

    myEvents.forEach((e) => {
      if (e.type !== 'session') return
      const d = parseISO(e.date)
      const day = getDay(d)
      const hour = e.startTime.split(':')[0]
      const key = `${day}-${hour}`
      if (!historicalStats[key])
        historicalStats[key] = { netRevenue: 0, attended: 0, total: 0 }

      historicalStats[key].total += 1
      if (e.status === 'performed') {
        historicalStats[key].attended += 1
        historicalStats[key].netRevenue += e.netValue
      }
    })

    const slots: Slot[] = []

    for (let i = 0; i < 7; i++) {
      const currentDay = addDays(start, i)
      const dateStr = format(currentDay, 'yyyy-MM-dd')
      const dayEvents = myEvents
        .filter((e) => e.date === dateStr)
        .sort((a, b) => a.startTime.localeCompare(b.startTime))

      let currentTime = 6 * 60
      const endTime = 22 * 60

      const checkAndAddSlot = (
        startMin: number,
        endMin: number,
        prevLoc: string | null,
        nextLoc: string | null,
      ) => {
        let effStart = startMin
        let effEnd = endMin
        if (prevLoc) effStart += travelMargin
        if (nextLoc) effEnd -= travelMargin

        if (effEnd - effStart >= minDuration) {
          const hour = Math.floor(effStart / 60)
          const min = effStart % 60
          const timeStr = `${hour.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`
          const dayOfW = getDay(currentDay)
          const hKey = `${dayOfW}-${hour.toString().padStart(2, '0')}`

          const stats = historicalStats[hKey] || {
            netRevenue: 0,
            attended: 0,
            total: 0,
          }
          const attendanceRate =
            stats.total > 0 ? stats.attended / stats.total : 0.5
          const avgRevenue =
            stats.attended > 0 ? stats.netRevenue / stats.attended : 0

          const baseHourScore = hour >= 17 || hour <= 9 ? 20 : 0
          const score = attendanceRate * 100 + avgRevenue + baseHourScore

          slots.push({
            date: dateStr,
            dateObj: currentDay,
            startTime: timeStr,
            duration: effEnd - effStart,
            score,
            attendanceRate,
            avgRevenue,
          })
        }
      }

      let prevLocation: string | null = null
      dayEvents.forEach((ev) => {
        const [h, m] = ev.startTime.split(':').map(Number)
        const evStart = h * 60 + m
        const [eh, em] = ev.endTime.split(':').map(Number)
        const evEnd = eh * 60 + em

        if (evStart > currentTime)
          checkAndAddSlot(
            currentTime,
            evStart,
            prevLocation,
            ev.locationId || null,
          )
        currentTime = Math.max(currentTime, evEnd)
        prevLocation = ev.locationId || null
      })
      if (currentTime < endTime)
        checkAndAddSlot(currentTime, endTime, prevLocation, null)
    }

    return slots.sort((a, b) => b.score - a.score).slice(0, 10)
  }, [events, currentUser.id, selectedDate, minDuration, travelMargin])

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-amber-500" /> Sugestão de Horários
          </SheetTitle>
          <SheetDescription>
            Motor inteligente de otimização de agenda para maximizar
            rentabilidade.
          </SheetDescription>
        </SheetHeader>
        <div className="my-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Intervalo Mínimo (min)</Label>
              <Input
                type="number"
                value={minDuration}
                onChange={(e) => setMinDuration(Number(e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <Label>Margem Deslocamento (min)</Label>
              <Input
                type="number"
                value={travelMargin}
                onChange={(e) => setTravelMargin(Number(e.target.value))}
              />
            </div>
          </div>
        </div>
        <div className="space-y-4">
          <h3 className="font-semibold text-sm text-muted-foreground">
            Melhores Oportunidades (Ranking)
          </h3>
          {suggestions.map((slot, idx) => (
            <Card
              key={idx}
              className={cn(
                'cursor-pointer hover:border-primary transition-all',
                idx === 0 &&
                  'border-amber-500 bg-amber-50/50 dark:bg-amber-950/20',
              )}
              onClick={() => {
                onSelectSlot(slot)
                onOpenChange(false)
              }}
            >
              <CardContent className="p-4 flex items-center justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-lg capitalize">
                      {format(slot.dateObj, 'EEEE', { locale: ptBR })}
                    </span>
                    <Badge
                      variant={idx === 0 ? 'default' : 'secondary'}
                      className={
                        idx === 0 ? 'bg-amber-500 hover:bg-amber-600' : ''
                      }
                    >
                      {idx === 0 && (
                        <Star className="w-3 h-3 mr-1 fill-current" />
                      )}
                      {slot.startTime}
                    </Badge>
                  </div>
                  <div className="text-sm text-muted-foreground flex items-center gap-3">
                    <span className="flex items-center">
                      <Clock className="w-3 h-3 mr-1" /> {slot.duration} min
                      livres
                    </span>
                    <span className="flex items-center text-emerald-600">
                      <TrendingUp className="w-3 h-3 mr-1" />{' '}
                      {formatBRL(slot.avgRevenue)} / méd.
                    </span>
                  </div>
                </div>
                <Button size="sm" variant={idx === 0 ? 'default' : 'outline'}>
                  Agendar
                </Button>
              </CardContent>
            </Card>
          ))}
          {suggestions.length === 0 && (
            <div className="text-center p-8 text-muted-foreground border rounded-lg bg-muted/20">
              Nenhum horário livre encontrado com esses parâmetros nesta semana.
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
