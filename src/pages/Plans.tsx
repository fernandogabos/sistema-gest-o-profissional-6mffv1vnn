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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Plus } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import useAppStore from '@/stores/main'
import { formatBRL } from '@/lib/formatters'

export default function Plans() {
  const { plans, currentUser, addPlan } = useAppStore()
  const { toast } = useToast()
  const [open, setOpen] = useState(false)
  const [error, setError] = useState('')

  const [formData, setFormData] = useState({
    nome: '',
    valor: '',
    frequenciaSemanal: '',
  })

  const displayPlans =
    currentUser.role === 'master_admin'
      ? plans.filter((p) => p.isGlobal)
      : plans.filter((p) => p.tenantId === currentUser.tenantId)

  const handleSave = () => {
    if (!formData.nome || !formData.valor) {
      setError('Preencha nome e valor do plano.')
      return
    }
    addPlan({
      nome: formData.nome,
      valor: Number(formData.valor),
      frequenciaSemanal: Number(formData.frequenciaSemanal) || 0,
      isGlobal: currentUser.role === 'master_admin',
    })
    setOpen(false)
    toast({ title: 'Plano adicionado com sucesso!' })
  }

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Planos</h1>
          <p className="text-muted-foreground mt-1">
            {currentUser.role === 'master_admin'
              ? 'Gerencie os planos globais da plataforma.'
              : 'Configure os planos oferecidos aos seus alunos.'}
          </p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Novo Plano
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Adicionar Plano</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              {error && <p className="text-sm text-destructive">{error}</p>}
              <div className="space-y-2">
                <Label>Nome do Plano</Label>
                <Input
                  value={formData.nome}
                  onChange={(e) =>
                    setFormData((f) => ({ ...f, nome: e.target.value }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Valor Mensal (R$)</Label>
                <Input
                  type="number"
                  value={formData.valor}
                  onChange={(e) =>
                    setFormData((f) => ({ ...f, valor: e.target.value }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Frequência (Dias por semana)</Label>
                <Input
                  type="number"
                  value={formData.frequenciaSemanal}
                  onChange={(e) =>
                    setFormData((f) => ({
                      ...f,
                      frequenciaSemanal: e.target.value,
                    }))
                  }
                />
              </div>
              <Button className="w-full mt-4" onClick={handleSave}>
                Salvar Plano
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {displayPlans.map((p) => (
          <Card
            key={p.id}
            className="relative overflow-hidden hover:shadow-md transition-shadow"
          >
            {p.isGlobal && (
              <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-[10px] px-2 py-1 font-bold rounded-bl-lg">
                GLOBAL
              </div>
            )}
            <CardHeader>
              <CardTitle className="text-xl">{p.nome}</CardTitle>
              <CardDescription>
                {p.frequenciaSemanal > 0
                  ? `${p.frequenciaSemanal}x na semana`
                  : 'Frequência livre'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary mb-6">
                {formatBRL(p.valor)}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
