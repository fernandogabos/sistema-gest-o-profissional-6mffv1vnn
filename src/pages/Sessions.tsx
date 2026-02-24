import { useState } from 'react'
import { Activity, Plus, FileEdit } from 'lucide-react'
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
import { Session } from '@/stores/mockData'

export default function Sessions() {
  const {
    sessions,
    students,
    locations,
    currentUser,
    addSession,
    updateSession,
  } = useAppStore()
  const { toast } = useToast()
  const [open, setOpen] = useState(false)
  const [error, setError] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [justification, setJustification] = useState('')

  const defaultForm = {
    alunoId: '',
    localId: '',
    data: new Date().toISOString().slice(0, 10),
    valor_bruto: '',
    status: 'realized' as any,
  }
  const [formData, setFormData] = useState(defaultForm)

  const tenantSessions = sessions.filter(
    (s) => s.tenantId === currentUser.tenantId,
  )
  const tenantStudents = students.filter(
    (s) => s.tenantId === currentUser.tenantId,
  )
  const tenantLocations = locations.filter(
    (l) => l.tenantId === currentUser.tenantId && l.ativo,
  )

  const handleOpenNew = () => {
    setEditingId(null)
    setFormData(defaultForm)
    setJustification('')
    setOpen(true)
  }

  const handleEdit = (session: Session) => {
    setEditingId(session.id)
    setFormData({
      alunoId: session.alunoId,
      localId: session.localId,
      data: session.data,
      valor_bruto: session.valor_bruto.toString(),
      status: session.status,
    })
    setJustification('')
    setOpen(true)
  }

  const handleSave = () => {
    if (!formData.alunoId || !formData.localId || !formData.valor_bruto) {
      setError('Preencha aluno, local e valor bruto.')
      return
    }
    if (editingId && !justification) {
      setError('Justificativa obrigatória para edições retroativas.')
      return
    }

    const payload = {
      alunoId: formData.alunoId,
      localId: formData.localId,
      data: formData.data,
      valor_bruto: Number(formData.valor_bruto),
      status: formData.status,
    }

    if (editingId) {
      updateSession(editingId, payload, justification)
      toast({ title: 'Sessão atualizada e registrada na auditoria.' })
    } else {
      addSession(payload)
      toast({
        title: 'Sessão registrada com sucesso!',
        description: 'Valores financeiros calculados automaticamente.',
      })
    }
    setOpen(false)
  }

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Sessões Operacionais
          </h1>
          <p className="text-muted-foreground mt-1">
            Registre sessões e acompanhe repasses e lucro líquido.
          </p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleOpenNew}>
              <Plus className="mr-2 h-4 w-4" /> Registrar Sessão
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingId ? 'Editar Sessão Retroativa' : 'Nova Sessão'}
              </DialogTitle>
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
                <Label>Local de Atendimento</Label>
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
                <Label>Valor Bruto da Sessão (R$)</Label>
                <Input
                  type="number"
                  value={formData.valor_bruto}
                  onChange={(e) =>
                    setFormData((f) => ({ ...f, valor_bruto: e.target.value }))
                  }
                />
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
                    <SelectItem value="realized">Realizada</SelectItem>
                    <SelectItem value="canceled">Cancelada</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {editingId && (
                <div className="space-y-2 border-t pt-4 mt-4">
                  <Label>Justificativa (Auditoria)</Label>
                  <Input
                    value={justification}
                    placeholder="Ex: Correção de valor de repasse"
                    onChange={(e) => setJustification(e.target.value)}
                  />
                </div>
              )}

              <Button className="w-full mt-4" onClick={handleSave}>
                Salvar e Processar Finanças
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
                <TableHead>Status</TableHead>
                <TableHead className="text-right">V. Bruto</TableHead>
                <TableHead className="text-right">Repasse</TableHead>
                <TableHead className="text-right">L. Líquido</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tenantSessions.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={8}
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
                        <TableCell>{loc?.name || 'Local Removido'}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              session.status === 'realized'
                                ? 'default'
                                : 'secondary'
                            }
                          >
                            {session.status === 'realized'
                              ? 'Realizada'
                              : 'Cancelada'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          {formatBRL(session.valor_bruto)}
                        </TableCell>
                        <TableCell className="text-right text-amber-600">
                          -{formatBRL(session.repasse_calculado)}
                        </TableCell>
                        <TableCell className="text-right text-emerald-600 font-bold">
                          {formatBRL(session.lucro_liquido)}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(session)}
                          >
                            <FileEdit className="h-4 w-4 text-muted-foreground" />
                          </Button>
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
