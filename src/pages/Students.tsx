import { useState, useMemo } from 'react'
import { Plus, Search } from 'lucide-react'
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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { StudentProfileSheet } from '@/components/StudentProfileSheet'
import { useToast } from '@/hooks/use-toast'
import useAppStore from '@/stores/main'
import { Student } from '@/stores/mockData'

export default function Students() {
  const { students, plans, currentUser, addStudent } = useAppStore()
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
  const [open, setOpen] = useState(false)
  const [error, setError] = useState('')

  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    planId: '',
    status: 'active' as Student['status'],
  })

  const tenantPlans = plans.filter(
    (p) => p.tenantId === currentUser.tenantId || p.isGlobal,
  )

  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      const isMyTenant = s.tenantId === currentUser.tenantId
      const matchesSearch = s.nome
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
      return isMyTenant && matchesSearch
    })
  }, [students, searchTerm, currentUser.tenantId])

  const handleSave = () => {
    if (!formData.nome || !formData.email) {
      setError('Preencha nome e email.')
      return
    }
    addStudent({
      nome: formData.nome,
      email: formData.email,
      telefone: formData.telefone,
      planId: formData.planId,
      status: formData.status,
    })
    setOpen(false)
    toast({ title: 'Aluno registrado com sucesso!' })
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="default">Ativo</Badge>
      case 'delinquent':
        return <Badge variant="destructive">Inadimplente</Badge>
      default:
        return <Badge variant="secondary">Inativo</Badge>
    }
  }

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">CRM de Alunos</h1>
          <p className="text-muted-foreground mt-1">
            Gerencie seus alunos, planos e contatos.
          </p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Adicionar Aluno
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Novo Aluno</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              {error && <p className="text-sm text-destructive">{error}</p>}
              <div className="space-y-2">
                <Label>Nome Completo</Label>
                <Input
                  value={formData.nome}
                  onChange={(e) =>
                    setFormData((f) => ({ ...f, nome: e.target.value }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>E-mail</Label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData((f) => ({ ...f, email: e.target.value }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Telefone</Label>
                <Input
                  value={formData.telefone}
                  onChange={(e) =>
                    setFormData((f) => ({ ...f, telefone: e.target.value }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Vincular Plano</Label>
                <Select
                  value={formData.planId}
                  onValueChange={(v) =>
                    setFormData((f) => ({ ...f, planId: v }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um plano" />
                  </SelectTrigger>
                  <SelectContent>
                    {tenantPlans.map((p) => (
                      <SelectItem key={p.id} value={p.id}>
                        {p.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Status Inicial</Label>
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
                    <SelectItem value="active">Ativo</SelectItem>
                    <SelectItem value="inactive">Inativo</SelectItem>
                    <SelectItem value="delinquent">Inadimplente</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button className="w-full mt-4" onClick={handleSave}>
                Salvar Aluno
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="overflow-hidden">
        <div className="p-4 flex gap-4 border-b bg-muted/20">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nome..."
              className="pl-9 bg-background"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Aluno</TableHead>
                <TableHead>Contato</TableHead>
                <TableHead>Plano</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ação</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStudents.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="h-24 text-center text-muted-foreground"
                  >
                    Nenhum aluno encontrado.
                  </TableCell>
                </TableRow>
              ) : (
                filteredStudents.map((student) => {
                  const plan = plans.find((p) => p.id === student.planId)
                  return (
                    <TableRow
                      key={student.id}
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => setSelectedStudent(student)}
                    >
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9">
                            <AvatarImage src={student.avatarUrl} />
                            <AvatarFallback>
                              {student.nome.substring(0, 2)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="font-medium">{student.nome}</div>
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {student.email}
                        <br />
                        {student.telefone}
                      </TableCell>
                      <TableCell>{plan?.nome || 'Nenhum'}</TableCell>
                      <TableCell>{getStatusBadge(student.status)}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">
                          Ver Perfil
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

      <StudentProfileSheet
        student={selectedStudent}
        open={!!selectedStudent}
        onOpenChange={(open) => !open && setSelectedStudent(null)}
      />
    </div>
  )
}
