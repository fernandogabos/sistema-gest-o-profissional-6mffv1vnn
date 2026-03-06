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
import { SurveyQuestion } from '@/stores/mockData'

interface Props {
  type: 'satisfaction' | 'nps' | 'feedback'
}

export function NewSurveyDialog({ type }: Props) {
  const { addSurvey } = useAppStore()
  const { toast } = useToast()
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [desc, setDesc] = useState('')
  const [questions, setQuestions] = useState<SurveyQuestion[]>([
    { id: '1', type: 'text', text: '' },
  ])

  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      { id: Math.random().toString(), type: 'text', text: '' },
    ])
  }

  const handleRemoveQuestion = (id: string) => {
    if (questions.length > 1) {
      setQuestions(questions.filter((q) => q.id !== id))
    }
  }

  const handleUpdateQuestion = (
    id: string,
    field: keyof SurveyQuestion,
    val: any,
  ) => {
    setQuestions(
      questions.map((q) => (q.id === id ? { ...q, [field]: val } : q)),
    )
  }

  const handleSave = () => {
    if (!title || questions.some((q) => !q.text)) {
      toast({
        title: 'Preencha o título e o texto de todas as perguntas.',
        variant: 'destructive',
      })
      return
    }

    addSurvey({
      title,
      description: desc,
      type,
      status: 'active',
      questions,
    })

    toast({ title: 'Pesquisa criada com sucesso!' })
    setOpen(false)
    setTitle('')
    setDesc('')
    setQuestions([{ id: '1', type: 'text', text: '' }])
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Nova Pesquisa
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Criar Nova Pesquisa</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label>Título</Label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Avaliação de Treino"
            />
          </div>
          <div className="space-y-2">
            <Label>Descrição (Opcional)</Label>
            <Input
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              placeholder="Instruções para o aluno"
            />
          </div>

          <div className="pt-4 border-t">
            <div className="flex items-center justify-between mb-4">
              <Label>Perguntas</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddQuestion}
              >
                <Plus className="h-4 w-4 mr-1" /> Adicionar Pergunta
              </Button>
            </div>
            <div className="space-y-4 max-h-[40vh] overflow-y-auto pr-2">
              {questions.map((q, i) => (
                <div
                  key={q.id}
                  className="flex flex-col gap-2 p-3 bg-muted/40 rounded-md border"
                >
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">
                      Pergunta {i + 1}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
                      onClick={() => handleRemoveQuestion(q.id)}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-[1fr_120px] gap-2">
                    <Input
                      placeholder="Texto da pergunta..."
                      value={q.text}
                      onChange={(e) =>
                        handleUpdateQuestion(q.id, 'text', e.target.value)
                      }
                    />
                    <Select
                      value={q.type}
                      onValueChange={(val: any) =>
                        handleUpdateQuestion(q.id, 'type', val)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="text">Texto</SelectItem>
                        <SelectItem value="rating">Nota (1-5)</SelectItem>
                        <SelectItem value="nps">NPS (0-10)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Button className="w-full mt-4" onClick={handleSave}>
            Salvar Pesquisa
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
