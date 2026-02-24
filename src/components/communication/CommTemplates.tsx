import { useState } from 'react'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Switch } from '@/components/ui/switch'
import { Plus, Edit2, Trash2 } from 'lucide-react'
import useAppStore from '@/stores/main'
import { useToast } from '@/hooks/use-toast'

export function CommTemplates() {
  const {
    communicationTemplates,
    currentUser,
    addCommunicationTemplate,
    updateCommunicationTemplate,
    deleteCommunicationTemplate,
  } = useAppStore()
  const { toast } = useToast()

  const templates = communicationTemplates.filter(
    (t) => t.tenantId === currentUser.tenantId,
  )

  const [open, setOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  const defaultForm = {
    name: '',
    triggerEvent: 'manual' as any,
    content: '',
    isActive: true,
  }
  const [formData, setFormData] = useState(defaultForm)

  const handleOpenNew = () => {
    setEditingId(null)
    setFormData(defaultForm)
    setOpen(true)
  }

  const handleEdit = (tpl: any) => {
    setEditingId(tpl.id)
    setFormData({
      name: tpl.name,
      triggerEvent: tpl.triggerEvent,
      content: tpl.content,
      isActive: tpl.isActive,
    })
    setOpen(true)
  }

  const handleSave = () => {
    if (!formData.name || !formData.content) {
      toast({ title: 'Preencha todos os campos.', variant: 'destructive' })
      return
    }

    if (editingId) {
      updateCommunicationTemplate(editingId, formData)
      toast({ title: 'Template atualizado.' })
    } else {
      addCommunicationTemplate(formData)
      toast({ title: 'Template criado com sucesso.' })
    }
    setOpen(false)
  }

  const getTriggerLabel = (event: string) => {
    const map: Record<string, string> = {
      manual: 'Envio Manual / Massa',
      new_student: 'Novo Aluno (Contrato)',
      payment_overdue: 'Pagamento Atrasado',
      evaluation_completed: 'Avaliação Finalizada',
      monthly_report: 'Relatório Mensal',
      task_deadline: 'Prazo de Tarefa',
    }
    return map[event] || event
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Templates de Mensagem</h2>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleOpenNew}>
              <Plus className="mr-2 h-4 w-4" /> Novo Template
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingId ? 'Editar Template' : 'Criar Template'}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label>Nome do Template</Label>
                <Input
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((f) => ({ ...f, name: e.target.value }))
                  }
                  placeholder="Ex: Boas-vindas"
                />
              </div>
              <div className="space-y-2">
                <Label>Gatilho (Quando enviar?)</Label>
                <Select
                  value={formData.triggerEvent}
                  onValueChange={(v: any) =>
                    setFormData((f) => ({ ...f, triggerEvent: v }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="manual">Envio Manual / Massa</SelectItem>
                    <SelectItem value="new_student">
                      Novo Aluno (Contrato)
                    </SelectItem>
                    <SelectItem value="payment_overdue">
                      Pagamento Atrasado
                    </SelectItem>
                    <SelectItem value="evaluation_completed">
                      Avaliação Finalizada
                    </SelectItem>
                    <SelectItem value="monthly_report">
                      Relatório Mensal
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Conteúdo da Mensagem</Label>
                <Textarea
                  className="min-h-[120px]"
                  value={formData.content}
                  onChange={(e) =>
                    setFormData((f) => ({ ...f, content: e.target.value }))
                  }
                />
                <p className="text-xs text-muted-foreground">
                  Variáveis suportadas: {'{{client_name}}'}, {'{{amount}}'}{' '}
                  (para pagamentos).
                </p>
              </div>
              <div className="flex items-center justify-between border-t pt-4">
                <Label>Template Ativo?</Label>
                <Switch
                  checked={formData.isActive}
                  onCheckedChange={(v) =>
                    setFormData((f) => ({ ...f, isActive: v }))
                  }
                />
              </div>
              <Button className="w-full mt-4" onClick={handleSave}>
                Salvar Template
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((tpl) => (
          <Card
            key={tpl.id}
            className={`transition-all ${!tpl.isActive ? 'opacity-60 grayscale' : ''}`}
          >
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div className="bg-primary/10 text-primary text-xs font-semibold px-2 py-1 rounded-md">
                  {getTriggerLabel(tpl.triggerEvent)}
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleEdit(tpl)}
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive hover:bg-destructive/10"
                    onClick={() => {
                      deleteCommunicationTemplate(tpl.id)
                      toast({ title: 'Template removido.' })
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <CardTitle className="text-lg mt-2">{tpl.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground bg-muted/40 p-3 rounded-md min-h-[80px] italic">
                "
                {tpl.content.length > 100
                  ? tpl.content.substring(0, 100) + '...'
                  : tpl.content}
                "
              </div>
            </CardContent>
          </Card>
        ))}
        {templates.length === 0 && (
          <div className="col-span-full py-12 text-center border rounded-lg border-dashed">
            <p className="text-muted-foreground">
              Nenhum template configurado ainda.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
