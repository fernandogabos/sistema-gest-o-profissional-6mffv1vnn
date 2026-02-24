import { useState } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Switch } from '@/components/ui/switch'
import { Plus, MapPin, Settings2 } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import useAppStore from '@/stores/main'
import { formatBRL } from '@/lib/formatters'
import { Location } from '@/stores/mockData'

export default function Locations() {
  const { locations, currentUser, addLocation, updateLocation } = useAppStore()
  const { toast } = useToast()
  const [open, setOpen] = useState(false)
  const [error, setError] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [justification, setJustification] = useState('')

  const defaultForm = {
    name: '',
    address: '',
    tipo_repasse: 'percentage' as any,
    percentual_repasse: '',
    valor_fixo_por_sessao: '',
    valor_mensal_fixo: '',
    modelo_cobranca: '',
    ativo: true,
  }
  const [formData, setFormData] = useState(defaultForm)

  const userLocations = locations.filter(
    (l) => l.tenantId === currentUser.tenantId,
  )

  const handleEdit = (loc: Location) => {
    setEditingId(loc.id)
    setFormData({
      name: loc.name,
      address: loc.address,
      tipo_repasse: loc.tipo_repasse,
      percentual_repasse: loc.percentual_repasse.toString(),
      valor_fixo_por_sessao: loc.valor_fixo_por_sessao.toString(),
      valor_mensal_fixo: loc.valor_mensal_fixo.toString(),
      modelo_cobranca: loc.modelo_cobranca,
      ativo: loc.ativo,
    })
    setJustification('')
    setOpen(true)
  }

  const handleOpenNew = () => {
    setEditingId(null)
    setFormData(defaultForm)
    setJustification('')
    setOpen(true)
  }

  const handleSave = () => {
    if (!formData.name || !formData.address) {
      setError('Preencha nome e endereço.')
      return
    }
    if (editingId && !justification) {
      setError('Justificativa obrigatória para edições na auditoria.')
      return
    }

    const payload = {
      name: formData.name,
      address: formData.address,
      tipo_repasse: formData.tipo_repasse,
      percentual_repasse: Number(formData.percentual_repasse) || 0,
      valor_fixo_por_sessao: Number(formData.valor_fixo_por_sessao) || 0,
      valor_mensal_fixo: Number(formData.valor_mensal_fixo) || 0,
      modelo_cobranca: formData.modelo_cobranca,
      ativo: formData.ativo,
    }

    if (editingId) {
      updateLocation(editingId, payload, justification)
      toast({ title: 'Local atualizado e registrado no log de auditoria.' })
    } else {
      addLocation(payload)
      toast({ title: 'Local adicionado com sucesso!' })
    }
    setOpen(false)
  }

  const getRepasseLabel = (tipo: string) => {
    switch (tipo) {
      case 'percentage':
        return 'Percentual por sessão'
      case 'fixed':
        return 'Valor fixo por sessão'
      case 'monthly':
        return 'Aluguel mensal fixo'
      case 'none':
        return 'Sem repasse'
      case 'hybrid':
        return 'Híbrido (Perc + Fixo)'
      default:
        return tipo
    }
  }

  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Locais e Repasses
          </h1>
          <p className="text-muted-foreground mt-1">
            Gerencie locais de atendimento com regras avançadas financeiras.
          </p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleOpenNew}>
              <Plus className="mr-2 h-4 w-4" /> Novo Local
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingId ? 'Editar Local' : 'Adicionar Local'}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              {error && <p className="text-sm text-destructive">{error}</p>}
              <div className="space-y-2">
                <Label>Nome do Local</Label>
                <Input
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((f) => ({ ...f, name: e.target.value }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Endereço</Label>
                <Input
                  value={formData.address}
                  onChange={(e) =>
                    setFormData((f) => ({ ...f, address: e.target.value }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Modelo de Cobrança</Label>
                <Input
                  value={formData.modelo_cobranca}
                  placeholder="Ex: Avulso, Mensalidade..."
                  onChange={(e) =>
                    setFormData((f) => ({
                      ...f,
                      modelo_cobranca: e.target.value,
                    }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Regra de Repasse</Label>
                <Select
                  value={formData.tipo_repasse}
                  onValueChange={(v: any) =>
                    setFormData((f) => ({ ...f, tipo_repasse: v }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">
                      Percentual sobre sessão
                    </SelectItem>
                    <SelectItem value="fixed">Valor fixo por sessão</SelectItem>
                    <SelectItem value="monthly">Aluguel mensal fixo</SelectItem>
                    <SelectItem value="none">Sem repasse</SelectItem>
                    <SelectItem value="hybrid">
                      Híbrido (Percentual + Fixo)
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {(formData.tipo_repasse === 'percentage' ||
                formData.tipo_repasse === 'hybrid') && (
                <div className="space-y-2">
                  <Label>Percentual (%)</Label>
                  <Input
                    type="number"
                    value={formData.percentual_repasse}
                    onChange={(e) =>
                      setFormData((f) => ({
                        ...f,
                        percentual_repasse: e.target.value,
                      }))
                    }
                  />
                </div>
              )}

              {(formData.tipo_repasse === 'fixed' ||
                formData.tipo_repasse === 'hybrid') && (
                <div className="space-y-2">
                  <Label>Valor Fixo por Sessão (R$)</Label>
                  <Input
                    type="number"
                    value={formData.valor_fixo_por_sessao}
                    onChange={(e) =>
                      setFormData((f) => ({
                        ...f,
                        valor_fixo_por_sessao: e.target.value,
                      }))
                    }
                  />
                </div>
              )}

              {formData.tipo_repasse === 'monthly' && (
                <div className="space-y-2">
                  <Label>Valor Mensal Fixo (R$)</Label>
                  <Input
                    type="number"
                    value={formData.valor_mensal_fixo}
                    onChange={(e) =>
                      setFormData((f) => ({
                        ...f,
                        valor_mensal_fixo: e.target.value,
                      }))
                    }
                  />
                  <p className="text-xs text-muted-foreground">
                    Isso gerará uma despesa fixa automaticamente todo mês.
                  </p>
                </div>
              )}

              <div className="flex items-center justify-between pt-2 border-t">
                <Label>Local Ativo?</Label>
                <Switch
                  checked={formData.ativo}
                  onCheckedChange={(v) =>
                    setFormData((f) => ({ ...f, ativo: v }))
                  }
                />
              </div>

              {editingId && (
                <div className="space-y-2 border-t pt-4 mt-4">
                  <Label>Justificativa da Edição (Auditoria)</Label>
                  <Input
                    value={justification}
                    placeholder="Motivo da alteração"
                    onChange={(e) => setJustification(e.target.value)}
                  />
                </div>
              )}

              <Button className="w-full mt-4" onClick={handleSave}>
                Salvar Local
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {userLocations.map((loc) => (
          <Card
            key={loc.id}
            className="transition-all hover:shadow-md hover:-translate-y-1 duration-200 group relative"
          >
            {!loc.ativo && (
              <div className="absolute top-4 right-4">
                <Badge variant="secondary">Inativo</Badge>
              </div>
            )}
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start pr-16">
                <div className="p-2 bg-primary/10 rounded-lg text-primary">
                  <MapPin className="h-5 w-5" />
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-12"
                  onClick={() => handleEdit(loc)}
                >
                  <Settings2 className="h-4 w-4" />
                </Button>
              </div>
              <CardTitle className="mt-4 text-xl line-clamp-1">
                {loc.name}
              </CardTitle>
              <CardDescription className="line-clamp-1">
                {loc.address}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-muted/50 p-3 rounded-md space-y-2">
                <p className="text-sm font-medium flex justify-between">
                  <span className="text-muted-foreground">Modelo:</span>
                  <span>{loc.modelo_cobranca || '-'}</span>
                </p>
                <p className="text-sm font-medium flex justify-between">
                  <span className="text-muted-foreground">Regra:</span>
                  <span className="truncate ml-2 text-right">
                    {getRepasseLabel(loc.tipo_repasse)}
                  </span>
                </p>
                <div className="pt-2 mt-2 border-t border-border/50">
                  {loc.tipo_repasse === 'percentage' && (
                    <p className="text-sm font-bold text-primary text-right">
                      {loc.percentual_repasse}% / sessão
                    </p>
                  )}
                  {loc.tipo_repasse === 'fixed' && (
                    <p className="text-sm font-bold text-primary text-right">
                      {formatBRL(loc.valor_fixo_por_sessao)} / sessão
                    </p>
                  )}
                  {loc.tipo_repasse === 'monthly' && (
                    <p className="text-sm font-bold text-primary text-right">
                      {formatBRL(loc.valor_mensal_fixo)} / mês
                    </p>
                  )}
                  {loc.tipo_repasse === 'hybrid' && (
                    <p className="text-sm font-bold text-primary text-right">
                      {loc.percentual_repasse}% +{' '}
                      {formatBRL(loc.valor_fixo_por_sessao)}
                    </p>
                  )}
                  {loc.tipo_repasse === 'none' && (
                    <p className="text-sm font-bold text-primary text-right">
                      0 (Lucro 100%)
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
