import { useState } from 'react'
import { Activity, Plus } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/hooks/use-toast'
import useAppStore from '@/stores/main'
import { formatBRL, formatDate } from '@/lib/formatters'

export default function Sessions() {
  const { sessions, students, locations, currentUser, addSession } =
    useAppStore()
  const { toast } = useToast()
  const [open, setOpen] = useState(false)
  const [error, setError] = useState('')

  const [formData, setFormData] = useState({
    alunoId: '',
    localId: '',
    data: new Date().toISOString().slice(0, 10),
    valorSessao: '',
  })

  const tenantSessions = sessions.filter(
    (s) => s.tenantId === currentUser.tenantId,
  )
  const tenantStudents = students.filter(
    (s) => s.tenantId === currentUser.tenantId,
  )
  const tenantLocations = locations.filter(
    (l) => l.tenantId === currentUser.tenantId,
  )

  const handleSave = () => {
    if (!formData.alunoId || !formData.localId || !formData.valorSessao) {
      setError('Preencha todos os campos.')
      return
    }
    addSession({
      alunoId: formData.alunoId,
      localId: formData.localId,
      data: formData.data,
      valorSessao: Number(formData.valorSessao),
    })
    setOpen(false)
    toast({
      title: 'Sessão registrada com sucesso!',
      description: 'Repasse calculado automaticamente.',
    })
  }

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Sessões Operacionais
          </h1>
          <p className="text-muted-foreground mt-1">
            Registre sessões e calcule repasses automaticamente.
          </p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Registrar Sessão
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nova Sessão</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              {error && <p className="text-sm text-destructive">{error}</p>}
              <div className="space-y-2">
                <Label>Data da Sessão</Label>
                <Input
                  type="date"
                  value={formData.data}
                  onChange={(e) =>
                    setFormData((f) => ({ ...f, data: e.target.value }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Aluno</Label>
                <Select
                  value={formData.alunoId}
                  onValueChange={(v) =>
                    setFormData((f) => ({ ...f, alunoId: v }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o aluno" />
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
                  value={formData.localId}
                  onValueChange={(v) =>
                    setFormData((f) => ({ ...f, localId: v }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o local" />
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
                  value={formData.valorSessao}
                  onChange={(e) =>
                    setFormData((f) => ({ ...f, valorSessao: e.target.value }))
                  }
                />
              </div>
              <Button className="w-full mt-4" onClick={handleSave}>
                Salvar e Calcular
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data</TableHead>
                <TableHead>Aluno</TableHead>
                <TableHead>Local</TableHead>
                <TableHead className="text-right">Valor</TableHead>
                <TableHead className="text-right">Repasse</TableHead>
                <TableHead className="text-right">Lucro Líquido</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tenantSessions.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="h-24 text-center text-muted-foreground"
                  >
                    Nenhuma sessão registrada.
                  </TableCell>
                </TableRow>
              ) : (
                tenantSessions
                  .sort((a, b) => b.data.localeCompare(a.data))
                  .map((session) => {
                    const student = students.find(
                      (s) => s.id === session.alunoId,
                    )
                    const loc = locations.find((l) => l.id === session.localId)
                    return (
                      <TableRow key={session.id}>
                        <TableCell>{formatDate(session.data)}</TableCell>
                        <TableCell className="font-medium">
                          {student?.nome}
                        </TableCell>
                        <TableCell>{loc?.name}</TableCell>
                        <TableCell className="text-right font-medium">
                          {formatBRL(session.valorSessao)}
                        </TableCell>
                        <TableCell className="text-right text-amber-600">
                          -{formatBRL(session.repasseCalculado)}
                        </TableCell>
                        <TableCell className="text-right text-emerald-600 font-bold">
                          {formatBRL(session.lucroLiquido)}
                        </TableCell>
                      </TableRow>
                    )
                  })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
