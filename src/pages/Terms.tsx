import { useState } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Plus, Edit, FileText } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import useAppStore from '@/stores/main'
import { useToast } from '@/hooks/use-toast'
import { Term } from '@/stores/mockData'

export default function Terms() {
  const { terms, currentUser, addTerm, updateTerm } = useAppStore()
  const { toast } = useToast()

  const [isOpen, setIsOpen] = useState(false)
  const [editingTerm, setEditingTerm] = useState<Term | null>(null)

  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [isActive, setIsActive] = useState(true)

  const tenantTerms = terms.filter((t) => t.tenantId === currentUser.tenantId)

  const handleOpenDialog = (term?: Term) => {
    if (term) {
      setEditingTerm(term)
      setTitle(term.title)
      setContent(term.content)
      setIsActive(term.isActive)
    } else {
      setEditingTerm(null)
      setTitle('')
      setContent('')
      setIsActive(true)
    }
    setIsOpen(true)
  }

  const handleSave = () => {
    if (!title.trim() || !content.trim()) {
      toast({
        title: 'Campos obrigatórios',
        description: 'Preencha o título e o conteúdo do termo.',
        variant: 'destructive',
      })
      return
    }

    if (editingTerm) {
      updateTerm(editingTerm.id, { title, content, isActive })
      toast({ title: 'Termo atualizado com sucesso!' })
    } else {
      addTerm({ title, content, isActive })
      toast({ title: 'Novo termo criado!' })
    }
    setIsOpen(false)
  }

  const toggleStatus = (termId: string, currentStatus: boolean) => {
    updateTerm(termId, { isActive: !currentStatus })
    toast({
      title: 'Status atualizado',
      description: `O termo agora está ${!currentStatus ? 'ativo' : 'inativo'}.`,
    })
  }

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Termos e Contratos
          </h1>
          <p className="text-muted-foreground mt-1">
            Gerencie os documentos legais que os alunos devem aceitar na
            plataforma.
          </p>
        </div>
        <Button onClick={() => handleOpenDialog()} className="shrink-0 gap-2">
          <Plus className="h-4 w-4" /> Novo Termo
        </Button>
      </div>

      <div className="grid gap-4">
        {tenantTerms.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-10">
              <FileText className="h-10 w-10 text-muted-foreground/50 mb-4" />
              <p className="text-muted-foreground">Nenhum termo cadastrado.</p>
            </CardContent>
          </Card>
        ) : (
          tenantTerms.map((term) => (
            <Card key={term.id}>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <CardTitle className="text-lg">{term.title}</CardTitle>
                    <CardDescription className="mt-1 line-clamp-2">
                      {term.content}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-4 shrink-0">
                    <div className="flex items-center gap-2">
                      <Label
                        htmlFor={`status-${term.id}`}
                        className="text-xs text-muted-foreground cursor-pointer"
                      >
                        {term.isActive ? 'Ativo' : 'Inativo'}
                      </Label>
                      <Switch
                        id={`status-${term.id}`}
                        checked={term.isActive}
                        onCheckedChange={() =>
                          toggleStatus(term.id, term.isActive)
                        }
                      />
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleOpenDialog(term)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))
        )}
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {editingTerm ? 'Editar Termo' : 'Novo Termo'}
            </DialogTitle>
            <DialogDescription>
              Configure o título e o texto completo do termo legal.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Título do Termo</Label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ex: Termo de Responsabilidade"
              />
            </div>
            <div className="space-y-2">
              <Label>Conteúdo do Termo</Label>
              <Textarea
                className="min-h-[200px]"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Insira o texto completo do contrato ou termo de aceite..."
              />
            </div>
            <div className="flex items-center space-x-2 pt-2 border-t mt-4">
              <Switch
                id="active-new"
                checked={isActive}
                onCheckedChange={setIsActive}
              />
              <Label htmlFor="active-new" className="cursor-pointer">
                Tornar este termo obrigatório (Ativo) imediatamente.
              </Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSave}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
