import { Calendar } from '@/components/ui/calendar'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Plus, Sparkles, BarChart2 } from 'lucide-react'
import { AgendaView } from '@/pages/Agenda'

interface Props {
  selectedDate: Date
  setSelectedDate: (d: Date) => void
  view: AgendaView
  setView: (v: AgendaView) => void
  onNew: () => void
  onOpenOptimizer: () => void
  onOpenProfitability: () => void
}

export function AgendaSidebar({
  selectedDate,
  setSelectedDate,
  view,
  setView,
  onNew,
  onOpenOptimizer,
  onOpenProfitability,
}: Props) {
  return (
    <div className="w-72 shrink-0 border-r bg-muted/10 p-4 flex flex-col gap-6 overflow-y-auto hidden md:flex">
      <Button className="w-full shadow-sm font-semibold" onClick={onNew}>
        <Plus className="w-4 h-4 mr-2" /> Novo Agendamento
      </Button>

      <div className="flex gap-2">
        <Button
          variant="secondary"
          className="flex-1 shadow-sm text-xs px-2"
          onClick={onOpenOptimizer}
          title="Sugerir melhor horário"
        >
          <Sparkles className="w-4 h-4 mr-1 text-amber-500" /> Sugerir
        </Button>
        <Button
          variant="outline"
          className="flex-1 shadow-sm text-xs px-2"
          onClick={onOpenProfitability}
          title="Análise de Rentabilidade"
        >
          <BarChart2 className="w-4 h-4 mr-1 text-primary" /> Rentab.
        </Button>
      </div>

      <div className="bg-card rounded-md border p-2 shadow-sm flex justify-center">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={(d) => d && setSelectedDate(d)}
          className="rounded-md"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-muted-foreground ml-1">
          Visualização
        </label>
        <Select value={view} onValueChange={(v: any) => setView(v)}>
          <SelectTrigger className="bg-background">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="day">Dia</SelectItem>
            <SelectItem value="workWeek">Semana Útil</SelectItem>
            <SelectItem value="week">Semana</SelectItem>
            <SelectItem value="month">Mês</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="mt-4 p-4 border rounded-md bg-card/50 space-y-3">
        <h4 className="text-sm font-semibold">Legenda</h4>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <div className="w-3 h-3 rounded bg-blue-100 border border-blue-300" />{' '}
          Agendado
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <div className="w-3 h-3 rounded bg-primary/10 border border-primary/30" />{' '}
          Confirmado
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <div className="w-3 h-3 rounded bg-emerald-100 border border-emerald-300" />{' '}
          Realizado
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <div className="w-3 h-3 rounded bg-muted border border-muted-foreground/30" />{' '}
          Bloqueio
        </div>
      </div>
    </div>
  )
}
