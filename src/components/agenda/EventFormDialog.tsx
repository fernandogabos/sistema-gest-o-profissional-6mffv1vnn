import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import useAppStore from '@/stores/main'
import { AgendaEvent } from '@/stores/mockData'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  eventId: string | null
  onSuccess: () => void
}

export function EventFormDialog({
  open,
  onOpenChange,
  eventId,
  onSuccess,
}: Props) {
  const { events, students, locations, addEvent, updateEvent, currentUser } =
    useAppStore()

  const defaultForm = {
    type: 'session',
    title: '',
    date: new Date().toISOString().slice(0, 10),
    startTime: '08:00',
    endTime: '09:00',
    value: 0,
    status: 'scheduled',
  } as Partial<AgendaEvent>
  const [formData, setFormData] = useState<Partial<AgendaEvent>>(defaultForm)
  const [recurrenceWeeks, setRecurrenceWeeks] = useState(0)

  useEffect(() => {
    if (open) {
      if (eventId) {
        const ev = events.find((e) => e.id === eventId)
        if (ev) setFormData(ev)
      } else {
        setFormData(defaultForm)
        setRecurrenceWeeks(0)
      }
    }
  }, [eventId, open, events])

  const tenantStudents = students.filter(
    (s) => s.tenantId === currentUser.tenantId,
  )
  const tenantLocations = locations.filter(
    (l) => l.tenantId === currentUser.tenantId,
  )

  const handleSave = () => {
    if (!formData.title || !formData.date) return
    const loc = locations.find((l) => l.id === formData.locationId)
    let split = 0
    if (loc && formData.value) {
      if (loc.tipo_repasse === 'percentage')
        split = (formData.value * loc.percentual_repasse) / 100
      else if (loc.tipo_repasse === 'fixed') split = loc.valor_fixo_por_sessao
    }
    const payload = {
      ...formData,
      userId: currentUser.id,
      splitValue: split,
      netValue: (formData.value || 0) - split,
    } as any

    if (eventId) updateEvent(eventId, payload)
    else addEvent(payload, recurrenceWeeks)
    onSuccess()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {eventId ? 'Editar Agendamento' : 'Novo Agendamento'}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-2">
          <div className="space-y-2">
            <Label>Tipo</Label>
            <Select
              value={formData.type}
              onValueChange={(v: any) =>
                setFormData((f) => ({ ...f, type: v }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="session">Sessão / Aula</SelectItem>
                <SelectItem value="block">Bloqueio de Agenda</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Título / Descrição</Label>
            <Input
              value={formData.title}
              onChange={(e) =>
                setFormData((f) => ({ ...f, title: e.target.value }))
              }
              placeholder="Ex: Treino Força"
            />
          </div>

          {formData.type === 'session' ? (
            <>
              <div className="space-y-2">
                <Label>Aluno</Label>
                <Select
                  value={formData.studentId || ''}
                  onValueChange={(v) =>
                    setFormData((f) => ({ ...f, studentId: v }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent>
                    {tenantStudents.map((s) => (
                      <SelectItem key={s.id} value={s.id}>
                        {s.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Local</Label>
                <Select
                  value={formData.locationId || ''}
                  onValueChange={(v) =>
                    setFormData((f) => ({ ...f, locationId: v }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent>
                    {tenantLocations.map((l) => (
                      <SelectItem key={l.id} value={l.id}>
                        {l.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Valor da Sessão (R$)</Label>
                <Input
                  type="number"
                  value={formData.value || ''}
                  onChange={(e) =>
                    setFormData((f) => ({
                      ...f,
                      value: Number(e.target.value),
                    }))
                  }
                />
              </div>
            </>
          ) : (
            <div className="space-y-2">
              <Label>Motivo do Bloqueio</Label>
              <Select
                value={formData.blockReason || ''}
                onValueChange={(v: any) =>
                  setFormData((f) => ({ ...f, blockReason: v }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="lunch">Almoço</SelectItem>
                  <SelectItem value="travel">Deslocamento</SelectItem>
                  <SelectItem value="personal">Pessoal</SelectItem>
                  <SelectItem value="vacation">Férias</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Data</Label>
              <Input
                type="date"
                value={formData.date}
                onChange={(e) =>
                  setFormData((f) => ({ ...f, date: e.target.value }))
                }
              />
            </div>
            {!eventId && formData.type === 'session' && (
              <div className="space-y-2">
                <Label>Repetir (Semanas)</Label>
                <Input
                  type="number"
                  min="0"
                  max="52"
                  value={recurrenceWeeks}
                  onChange={(e) => setRecurrenceWeeks(Number(e.target.value))}
                />
              </div>
            )}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Início</Label>
              <Input
                type="time"
                value={formData.startTime}
                onChange={(e) =>
                  setFormData((f) => ({ ...f, startTime: e.target.value }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Término</Label>
              <Input
                type="time"
                value={formData.endTime}
                onChange={(e) =>
                  setFormData((f) => ({ ...f, endTime: e.target.value }))
                }
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Status</Label>
            <Select
              value={formData.status}
              onValueChange={(v: any) =>
                setFormData((f) => ({ ...f, status: v }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="scheduled">Agendado</SelectItem>
                <SelectItem value="confirmed">Confirmado</SelectItem>
                <SelectItem value="performed">Realizado</SelectItem>
                <SelectItem value="canceled_student">
                  Cancelado (Aluno)
                </SelectItem>
                <SelectItem value="canceled_pro">
                  Cancelado (Profissional)
                </SelectItem>
                <SelectItem value="no_show">Falta do Aluno</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button className="w-full mt-4" onClick={handleSave}>
            Salvar Agendamento
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
