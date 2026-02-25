import { useMemo } from 'react'
import useAppStore from '@/stores/main'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import { parseISO, getDay } from 'date-fns'
import { formatBRL } from '@/lib/formatters'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import { Button } from '@/components/ui/button'
import { X, DollarSign, Activity, Percent, Clock } from 'lucide-react'

interface Props {
  onClose: () => void
}

export function AgendaProfitability({ onClose }: Props) {
  const { events, currentUser } = useAppStore()

  const stats = useMemo(() => {
    const myEvents = events.filter(
      (e) => e.userId === currentUser.id && e.type === 'session',
    )
    let gross = 0,
      net = 0,
      performed = 0,
      missed = 0,
      totalHours = 0

    const shifts = {
      Manhã: { net: 0, count: 0 },
      Tarde: { net: 0, count: 0 },
      Noite: { net: 0, count: 0 },
    }
    const timeSlots: Record<string, any> = {}
    const dayNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']

    myEvents.forEach((e) => {
      const [h, m] = e.startTime.split(':').map(Number)
      const [eh, em] = e.endTime.split(':').map(Number)
      const hrs = (eh * 60 + em - (h * 60 + m)) / 60
      const isPerformed = e.status === 'performed'
      const isMissed = e.status === 'no_show'

      if (isPerformed) {
        gross += e.value
        net += e.netValue
        performed += 1
        totalHours += hrs
        let shift = 'Manhã'
        if (h >= 12 && h < 18) shift = 'Tarde'
        if (h >= 18) shift = 'Noite'
        shifts[shift as keyof typeof shifts].net += e.netValue
        shifts[shift as keyof typeof shifts].count += 1
      } else if (isMissed) missed += 1

      if (isPerformed || isMissed) {
        const day = getDay(parseISO(e.date))
        const key = `${dayNames[day]} ${h.toString().padStart(2, '0')}:00`
        if (!timeSlots[key])
          timeSlots[key] = { key, net: 0, performed: 0, missed: 0, total: 0 }
        timeSlots[key].total += 1
        if (isPerformed) {
          timeSlots[key].performed += 1
          timeSlots[key].net += e.netValue
        } else timeSlots[key].missed += 1
      }
    })

    const attendanceRate =
      performed + missed > 0 ? (performed / (performed + missed)) * 100 : 0
    const netPerHour = totalHours > 0 ? net / totalHours : 0

    const topSlots = Object.values(timeSlots)
      .map((s) => ({
        ...s,
        attendance: (s.performed / s.total) * 100,
        avgNet: s.performed > 0 ? s.net / s.performed : 0,
      }))
      .sort((a, b) => b.net - a.net)
      .slice(0, 10)

    const shiftData = [
      { name: 'Manhã (06-12)', net: shifts['Manhã'].net },
      { name: 'Tarde (12-18)', net: shifts['Tarde'].net },
      { name: 'Noite (18-22)', net: shifts['Noite'].net },
    ]

    let maxHeatmapValue = 1
    const heatmap = Array.from({ length: 17 }, (_, i) => {
      const h = i + 6
      const row: any = { hour: `${h.toString().padStart(2, '0')}:00` }
      dayNames.forEach((d) => {
        const k = `${d} ${row.hour}`
        const val = timeSlots[k] ? timeSlots[k].net : 0
        if (val > maxHeatmapValue) maxHeatmapValue = val
        row[d] = val
      })
      return row
    })

    return {
      gross,
      net,
      attendanceRate,
      netPerHour,
      topSlots,
      shiftData,
      heatmap,
      dayNames,
      maxHeatmapValue,
    }
  }, [events, currentUser])

  return (
    <div className="flex-1 flex flex-col bg-background overflow-hidden relative animate-fade-in z-20">
      <div className="p-4 border-b flex justify-between items-center bg-card shadow-sm z-10 shrink-0">
        <div>
          <h2 className="text-xl font-bold tracking-tight">
            Dashboard de Rentabilidade
          </h2>
          <p className="text-sm text-muted-foreground">
            Análise histórica de receita e eficiência logística
          </p>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-5 w-5" />
        </Button>
      </div>
      <ScrollArea className="flex-1 p-6">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-emerald-600" /> Receita
                  Líquida Total
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-emerald-600">
                  {formatBRL(stats.net)}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Activity className="w-4 h-4 text-primary" /> Receita Bruta
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatBRL(stats.gross)}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Clock className="w-4 h-4 text-blue-500" /> Média por Hora
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">
                  {formatBRL(stats.netPerHour)}
                  <span className="text-sm font-normal text-muted-foreground">
                    /h
                  </span>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Percent className="w-4 h-4 text-orange-500" /> Taxa
                  Comparecimento
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stats.attendanceRate.toFixed(1)}%
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Receita por Turno</CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    net: {
                      label: 'Receita Líquida',
                      color: 'hsl(var(--primary))',
                    },
                  }}
                  className="h-[250px] w-full"
                >
                  <BarChart
                    data={stats.shiftData}
                    margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis
                      dataKey="name"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(v) => `R$${v}`}
                    />
                    <ChartTooltip
                      content={
                        <ChartTooltipContent
                          formatter={(v) => formatBRL(v as number)}
                        />
                      }
                    />
                    <Bar
                      dataKey="net"
                      fill="var(--color-net)"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top 10 Horários Mais Rentáveis</CardTitle>
              </CardHeader>
              <CardContent className="p-0 overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Horário</TableHead>
                      <TableHead className="text-right">R. Líquida</TableHead>
                      <TableHead className="text-right">
                        Média / Sessão
                      </TableHead>
                      <TableHead className="text-right">Frequência</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {stats.topSlots.map((s, i) => (
                      <TableRow key={s.key}>
                        <TableCell className="font-medium">
                          {i === 0 && (
                            <Badge className="mr-2 bg-amber-500 hover:bg-amber-600 px-1 py-0">
                              #1
                            </Badge>
                          )}
                          {s.key}
                        </TableCell>
                        <TableCell className="text-right font-bold text-emerald-600">
                          {formatBRL(s.net)}
                        </TableCell>
                        <TableCell className="text-right">
                          {formatBRL(s.avgNet)}
                        </TableCell>
                        <TableCell className="text-right">
                          {s.attendance.toFixed(0)}%
                        </TableCell>
                      </TableRow>
                    ))}
                    {stats.topSlots.length === 0 && (
                      <TableRow>
                        <TableCell
                          colSpan={4}
                          className="text-center p-4 text-muted-foreground"
                        >
                          Sem dados suficientes
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Mapa de Calor Semanal (Receita Líquida)</CardTitle>
              <CardDescription>
                Identifique facilmente os blocos mais lucrativos da sua semana
                baseados no histórico
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0 overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[80px] bg-muted/30">
                      Horário
                    </TableHead>
                    {stats.dayNames.map((d) => (
                      <TableHead key={d} className="text-center min-w-[80px]">
                        {d}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {stats.heatmap.map((row) => (
                    <TableRow key={row.hour}>
                      <TableCell className="font-medium bg-muted/10 text-xs">
                        {row.hour}
                      </TableCell>
                      {stats.dayNames.map((d) => {
                        const val = row[d]
                        const intensity =
                          val > 0
                            ? Math.max(
                                0.1,
                                Math.min(val / stats.maxHeatmapValue, 1),
                              )
                            : 0
                        return (
                          <TableCell key={d} className="p-1 border-l">
                            {val > 0 ? (
                              <div
                                className="w-full h-10 rounded flex items-center justify-center text-xs font-semibold shadow-sm transition-all hover:scale-105"
                                style={{
                                  backgroundColor: `hsl(var(--primary) / ${intensity})`,
                                  color: intensity > 0.4 ? 'white' : 'inherit',
                                }}
                                title={formatBRL(val)}
                              >
                                {formatBRL(val).replace('R$', '').trim()}
                              </div>
                            ) : (
                              <div className="w-full h-10 flex items-center justify-center text-muted-foreground/30 text-xs">
                                -
                              </div>
                            )}
                          </TableCell>
                        )
                      })}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </ScrollArea>
    </div>
  )
}
