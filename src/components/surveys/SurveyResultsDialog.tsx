import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import useAppStore from '@/stores/main'
import { Survey } from '@/stores/mockData'

interface Props {
  survey: Survey
}

export function SurveyResultsDialog({ survey }: Props) {
  const { surveyResponses, students } = useAppStore()
  const responses = surveyResponses.filter((r) => r.surveyId === survey.id)

  const getStudentName = (id: string) => {
    return students.find((s) => s.id === id)?.nome || 'Aluno Desconhecido'
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          Ver Respostas
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Resultados: {survey.title}</DialogTitle>
        </DialogHeader>
        <div className="space-y-6 pt-4 max-h-[70vh] overflow-y-auto">
          <div className="grid gap-6">
            {survey.questions.map((q) => {
              const answersForQ = responses
                .map((r) => {
                  const ans = r.answers.find((a) => a.questionId === q.id)
                  return { studentId: r.studentId, value: ans?.value }
                })
                .filter((a) => a.value !== undefined)

              const isNumeric = q.type === 'nps' || q.type === 'rating'
              const avgScore = isNumeric
                ? answersForQ.reduce(
                    (acc, curr) => acc + Number(curr.value),
                    0,
                  ) / (answersForQ.length || 1)
                : 0

              return (
                <div key={q.id} className="border rounded-md p-4 bg-muted/20">
                  <h3 className="font-medium mb-3">
                    {q.text}{' '}
                    <span className="text-muted-foreground text-xs font-normal">
                      (
                      {q.type === 'text'
                        ? 'Texto Aberto'
                        : q.type === 'rating'
                          ? 'Escala 1-5'
                          : 'NPS 0-10'}
                      )
                    </span>
                  </h3>

                  {isNumeric ? (
                    <div className="flex gap-4 items-center">
                      <div className="text-3xl font-bold text-primary">
                        {avgScore.toFixed(1)}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Média baseada em {answersForQ.length} resposta(s)
                      </div>
                    </div>
                  ) : (
                    <div className="max-h-60 overflow-y-auto border rounded-md bg-background">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-[30%]">Aluno</TableHead>
                            <TableHead>Resposta</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {answersForQ.map((a, i) => (
                            <TableRow key={i}>
                              <TableCell className="font-medium">
                                {getStudentName(a.studentId)}
                              </TableCell>
                              <TableCell className="whitespace-pre-wrap">
                                {a.value}
                              </TableCell>
                            </TableRow>
                          ))}
                          {answersForQ.length === 0 && (
                            <TableRow>
                              <TableCell
                                colSpan={2}
                                className="text-center text-muted-foreground h-16"
                              >
                                Nenhuma resposta até o momento.
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
