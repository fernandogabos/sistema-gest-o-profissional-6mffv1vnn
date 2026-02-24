import { useState } from 'react'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { Send, Users } from 'lucide-react'
import useAppStore from '@/stores/main'
import { useToast } from '@/hooks/use-toast'

export function CommBulk() {
  const { students, communicationTemplates, currentUser, sendCommunication } =
    useAppStore()
  const { toast } = useToast()

  const [filter, setFilter] = useState('all')
  const [templateId, setTemplateId] = useState('none')
  const [customContent, setCustomContent] = useState('')
  const [selectedIds, setSelectedIds] = useState<string[]>([])

  const manualTemplates = communicationTemplates.filter(
    (t) =>
      t.tenantId === currentUser.tenantId &&
      t.triggerEvent === 'manual' &&
      t.isActive,
  )
  const tenantStudents = students.filter(
    (s) => s.tenantId === currentUser.tenantId,
  )

  const filteredStudents = tenantStudents.filter((s) => {
    if (filter === 'active') return s.status === 'active'
    if (filter === 'delinquent') return s.status === 'delinquent'
    return true
  })

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(filteredStudents.map((s) => s.id))
    } else {
      setSelectedIds([])
    }
  }

  const toggleStudent = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    )
  }

  const handleSend = () => {
    if (selectedIds.length === 0) {
      toast({ title: 'Selecione ao menos um aluno.', variant: 'destructive' })
      return
    }
    if (templateId === 'none' && !customContent.trim()) {
      toast({
        title: 'Forneça o conteúdo ou selecione um template.',
        variant: 'destructive',
      })
      return
    }

    sendCommunication(
      selectedIds,
      templateId === 'none' ? undefined : templateId,
      customContent,
    )
    toast({
      title: `Mensagens em processamento para ${selectedIds.length} alunos.`,
    })
    setSelectedIds([])
    setCustomContent('')
    setTemplateId('none')
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Composição da Mensagem</CardTitle>
          <CardDescription>
            Escolha um template ou digite uma mensagem personalizada para envio
            manual/massa.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Usar Template (Opcional)</Label>
            <Select value={templateId} onValueChange={setTemplateId}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione um template..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Sem template (Texto livre)</SelectItem>
                {manualTemplates.map((t) => (
                  <SelectItem key={t.id} value={t.id}>
                    {t.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Conteúdo da Mensagem</Label>
            <Textarea
              className="min-h-[150px]"
              placeholder={
                templateId !== 'none'
                  ? 'O conteúdo do template será aplicado no envio...'
                  : 'Digite sua mensagem aqui. Use {{client_name}} para o nome do aluno.'
              }
              value={customContent}
              onChange={(e) => setCustomContent(e.target.value)}
              disabled={templateId !== 'none'}
            />
            {templateId === 'none' && (
              <p className="text-xs text-muted-foreground">
                Variáveis suportadas: {'{{client_name}}'}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Destinatários
            </CardTitle>
            <CardDescription>Filtre e selecione os alunos.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Filtrar por Status</Label>
              <Select value={filter} onValueChange={setFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="active">Apenas Ativos</SelectItem>
                  <SelectItem value="delinquent">
                    Apenas Inadimplentes
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="border rounded-md max-h-[300px] overflow-y-auto p-4 space-y-3 bg-muted/20">
              <div className="flex items-center space-x-2 border-b pb-3">
                <Checkbox
                  id="select-all"
                  checked={
                    selectedIds.length === filteredStudents.length &&
                    filteredStudents.length > 0
                  }
                  onCheckedChange={handleSelectAll}
                />
                <label
                  htmlFor="select-all"
                  className="text-sm font-medium leading-none"
                >
                  Selecionar Todos ({filteredStudents.length})
                </label>
              </div>

              {filteredStudents.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-2">
                  Nenhum aluno no filtro.
                </p>
              )}

              {filteredStudents.map((student) => (
                <div key={student.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={student.id}
                    checked={selectedIds.includes(student.id)}
                    onCheckedChange={() => toggleStudent(student.id)}
                  />
                  <label
                    htmlFor={student.id}
                    className="flex-1 flex justify-between items-center text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    <span className="truncate pr-2">{student.nome}</span>
                    {!student.whatsappConsent && (
                      <Badge
                        variant="outline"
                        className="text-[10px] bg-background"
                      >
                        Sem Consentimento
                      </Badge>
                    )}
                  </label>
                </div>
              ))}
            </div>

            <Button
              className="w-full"
              size="lg"
              onClick={handleSend}
              disabled={selectedIds.length === 0}
            >
              <Send className="mr-2 h-4 w-4" />
              Enviar para {selectedIds.length} Aluno(s)
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
