import { useState } from 'react'
import { Plus, Trash } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import { useToast } from '@/hooks/use-toast'
import useAppStore from '@/stores/main'

export function NewTemplateDialog() {
  const { addEvaluationTemplate } = useAppStore()
  const { toast } = useToast()
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [desc, setDesc] = useState('')
  const [type, setType] = useState('student')
  const [criteria, setCriteria] = useState([{ id: '1', name: '', weight: 1 }])

  const handleAddCriterion = () => {
    setCriteria([
      ...criteria,
      { id: Math.random().toString(), name: '', weight: 1 },
    ])
  }

  const handleRemoveCriterion = (id: string) => {
    if (criteria.length > 1) {
      setCriteria(criteria.filter((c) => c.id !== id))
    }
  }

  const handleUpdateCriterion = (
    id: string,
    field: 'name' | 'weight',
    val: string | number,
  ) => {
    setCriteria(criteria.map((c) => (c.id === id ? { ...c, [field]: val } : c)))
  }

  const handleSave = () => {
    if (!name || criteria.some((c) => !c.name)) {
      toast({
        title: 'Preencha todos os campos obrigatórios.',
        variant: 'destructive',
      })
      return
    }

    addEvaluationTemplate({
      name,
      description: desc,
      type: type as any,
      status: 'active',
      criteria,
    })
    toast({ title: 'Modelo criado com sucesso!' })
    setOpen(false)
    setName('')
    setDesc('')
    setCriteria([{ id: '1', name: '', weight: 1 }])
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Novo Modelo
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Criar Modelo de Avaliação</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label>Nome do Modelo</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Avaliação Inicial"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Descrição</Label>
              <Input value={desc} onChange={(e) => setDesc(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Tipo de Aplicação</Label>
              <Select value={type} onValueChange={setType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="student">Aluno</SelectItem>
                  <SelectItem value="employee">Funcionário</SelectItem>
                  <SelectItem value="service">Qualidade do Serviço</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="pt-4 border-t">
            <div className="flex items-center justify-between mb-2">
              <Label>Critérios Avaliativos (Pesos)</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddCriterion}
              >
                <Plus className="h-4 w-4 mr-1" /> Adicionar
              </Button>
            </div>
            <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
              {criteria.map((c, i) => (
                <div key={c.id} className="flex items-center gap-2">
                  <div className="flex-1">
                    <Input
                      placeholder={`Critério ${i + 1}`}
                      value={c.name}
                      onChange={(e) =>
                        handleUpdateCriterion(c.id, 'name', e.target.value)
                      }
                    />
                  </div>
                  <div className="w-24">
                    <Input
                      type="number"
                      min="1"
                      placeholder="Peso"
                      value={c.weight}
                      onChange={(e) =>
                        handleUpdateCriterion(
                          c.id,
                          'weight',
                          Number(e.target.value),
                        )
                      }
                    />
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveCriterion(c.id)}
                  >
                    <Trash className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <Button className="w-full mt-4" onClick={handleSave}>
            Salvar Modelo
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
