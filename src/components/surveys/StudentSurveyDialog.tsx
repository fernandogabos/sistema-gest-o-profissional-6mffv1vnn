import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'
import useAppStore from '@/stores/main'
import { Survey } from '@/stores/mockData'

interface Props {
  survey: Survey
  studentId: string
}

export function StudentSurveyDialog({ survey, studentId }: Props) {
  const { submitSurveyResponse } = useAppStore()
  const { toast } = useToast()
  const [open, setOpen] = useState(false)
  const [answers, setAnswers] = useState<Record<string, string | number>>({})

  const handleSubmit = () => {
    // Validação: checar se todas as perguntas foram respondidas
    const isComplete = survey.questions.every(
      (q) => answers[q.id] !== undefined && answers[q.id] !== '',
    )
    if (!isComplete) {
      toast({
        title: 'Por favor, responda todas as perguntas.',
        variant: 'destructive',
      })
      return
    }

    const formattedAnswers = Object.entries(answers).map(
      ([questionId, value]) => ({
        questionId,
        value,
      }),
    )

    submitSurveyResponse({
      surveyId: survey.id,
      studentId,
      answers: formattedAnswers,
    })

    toast({ title: 'Feedback enviado com sucesso!' })
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full">Responder Pesquisa</Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{survey.title}</DialogTitle>
        </DialogHeader>
        <div className="space-y-6 pt-4">
          {survey.description && (
            <p className="text-sm text-muted-foreground">
              {survey.description}
            </p>
          )}

          {survey.questions.map((q, index) => (
            <div
              key={q.id}
              className="space-y-3 bg-muted/20 p-4 rounded-md border"
            >
              <Label className="text-base">
                {index + 1}. {q.text}
              </Label>

              {q.type === 'text' && (
                <Textarea
                  placeholder="Escreva sua resposta..."
                  value={(answers[q.id] as string) || ''}
                  onChange={(e) =>
                    setAnswers({ ...answers, [q.id]: e.target.value })
                  }
                  className="mt-2"
                />
              )}

              {q.type === 'rating' && (
                <div className="flex gap-2 mt-2">
                  {[1, 2, 3, 4, 5].map((num) => (
                    <Button
                      key={num}
                      type="button"
                      variant={answers[q.id] === num ? 'default' : 'outline'}
                      className="w-12 h-12 text-lg"
                      onClick={() => setAnswers({ ...answers, [q.id]: num })}
                    >
                      {num}
                    </Button>
                  ))}
                </div>
              )}

              {q.type === 'nps' && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => {
                    // Feedback visual das cores de NPS
                    let colorClass = ''
                    if (answers[q.id] === num) {
                      if (num >= 9)
                        colorClass =
                          'bg-emerald-500 hover:bg-emerald-600 text-white'
                      else if (num >= 7)
                        colorClass =
                          'bg-amber-500 hover:bg-amber-600 text-white'
                      else
                        colorClass = 'bg-rose-500 hover:bg-rose-600 text-white'
                    }

                    return (
                      <Button
                        key={num}
                        type="button"
                        variant={answers[q.id] === num ? 'default' : 'outline'}
                        className={`w-10 h-10 p-0 ${colorClass}`}
                        onClick={() => setAnswers({ ...answers, [q.id]: num })}
                      >
                        {num}
                      </Button>
                    )
                  })}
                  <div className="w-full flex justify-between text-xs text-muted-foreground mt-1">
                    <span>0 - Não recomendaria</span>
                    <span>10 - Com certeza recomendaria</span>
                  </div>
                </div>
              )}
            </div>
          ))}

          <Button className="w-full mt-4" size="lg" onClick={handleSubmit}>
            Enviar Respostas
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
