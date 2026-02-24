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
import { Plus, MapPin } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import useAppStore from '@/stores/main'
import { formatBRL } from '@/lib/formatters'

export default function Locations() {
  const { locations, currentUser, addLocation } = useAppStore()
  const { toast } = useToast()
  const [open, setOpen] = useState(false)
  const [error, setError] = useState('')

  const [formData, setFormData] = useState({
    name: '',
    address: '',
    repasseTipo: 'percentage' as 'percentage' | 'fixed',
    repassePercentual: '',
    repasseValorFixo: '',
    repasseMensal: true,
  })

  const userLocations = locations.filter(
    (l) => l.tenantId === currentUser.tenantId,
  )

  const handleSave = () => {
    if (!formData.name || !formData.address) {
      setError('Preencha os campos obrigatórios.')
      return
    }
    addLocation({
      name: formData.name,
      address: formData.address,
      repasseTipo: formData.repasseTipo,
      repassePercentual: Number(formData.repassePercentual) || 0,
      repasseValorFixo: Number(formData.repasseValorFixo) || 0,
      repasseMensal: formData.repasseMensal,
    })
    setOpen(false)
    toast({ title: 'Local adicionado com sucesso!' })
  }

  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Locais e Repasses
          </h1>
          <p className="text-muted-foreground mt-1">
            Gerencie locais de atendimento e regras de comissão.
          </p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Novo Local
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Adicionar Local</DialogTitle>
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
                <Label>Tipo de Repasse</Label>
                <Select
                  value={formData.repasseTipo}
                  onValueChange={(v: 'percentage' | 'fixed') =>
                    setFormData((f) => ({ ...f, repasseTipo: v }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">Percentual (%)</SelectItem>
                    <SelectItem value="fixed">Valor Fixo (R$)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {formData.repasseTipo === 'percentage' ? (
                <div className="space-y-2">
                  <Label>Percentual (%)</Label>
                  <Input
                    type="number"
                    value={formData.repassePercentual}
                    onChange={(e) =>
                      setFormData((f) => ({
                        ...f,
                        repassePercentual: e.target.value,
                      }))
                    }
                  />
                </div>
              ) : (
                <div className="space-y-2">
                  <Label>Valor Fixo (R$)</Label>
                  <Input
                    type="number"
                    value={formData.repasseValorFixo}
                    onChange={(e) =>
                      setFormData((f) => ({
                        ...f,
                        repasseValorFixo: e.target.value,
                      }))
                    }
                  />
                </div>
              )}
              <div className="flex items-center justify-between pt-2">
                <Label>Repasse Mensal Fixo?</Label>
                <Switch
                  checked={formData.repasseMensal}
                  onCheckedChange={(v) =>
                    setFormData((f) => ({ ...f, repasseMensal: v }))
                  }
                />
              </div>
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
            className="transition-all hover:shadow-md hover:-translate-y-1 duration-200 cursor-pointer group"
          >
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div className="p-2 bg-primary/10 rounded-lg text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <MapPin className="h-5 w-5" />
                </div>
              </div>
              <CardTitle className="mt-4 text-xl">{loc.name}</CardTitle>
              <CardDescription>{loc.address}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-muted/50 p-3 rounded-md">
                <p className="text-sm font-medium flex justify-between">
                  <span className="text-muted-foreground">Regra:</span>
                  <span className="capitalize">
                    {loc.repasseTipo === 'fixed' ? 'Taxa Fixa' : 'Porcentagem'}
                  </span>
                </p>
                <p className="text-sm font-medium flex justify-between mt-2">
                  <span className="text-muted-foreground">Valor:</span>
                  <span className="text-primary font-bold">
                    {loc.repasseTipo === 'fixed'
                      ? formatBRL(loc.repasseValorFixo)
                      : `${loc.repassePercentual}%`}
                  </span>
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
