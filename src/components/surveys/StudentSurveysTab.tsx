import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { FileQuestion, CheckCircle2 } from 'lucide-react'
import useAppStore from '@/stores/main'
import { StudentSurveyDialog } from './StudentSurveyDialog'

interface Props {
  studentId: string
}

export function StudentSurveysTab({ studentId }: Props) {
  const { surveys, surveyResponses, currentUser } = useAppStore()

  const activeSurveys = surveys.filter(
    (s) => s.tenantId === currentUser.tenantId && s.status === 'active',
  )
  const studentResponses = surveyResponses.filter(
    (r) => r.studentId === studentId,
  )

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium">Pesquisas Disponíveis</h3>
      {activeSurveys.length === 0 && (
        <p className="text-sm text-muted-foreground">
          Nenhuma pesquisa ativa no momento.
        </p>
      )}

      <div className="grid gap-4">
        {activeSurveys.map((survey) => {
          const response = studentResponses.find(
            (r) => r.surveyId === survey.id,
          )
          const isAnswered = !!response

          return (
            <Card key={survey.id}>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    <FileQuestion className="h-4 w-4 text-primary" />
                    <CardTitle className="text-base">{survey.title}</CardTitle>
                  </div>
                  {isAnswered ? (
                    <Badge
                      variant="secondary"
                      className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100"
                    >
                      Respondido
                    </Badge>
                  ) : (
                    <Badge variant="outline">Pendente</Badge>
                  )}
                </div>
                <CardDescription>{survey.description}</CardDescription>
              </CardHeader>
              <CardContent>
                {isAnswered ? (
                  <div className="text-sm space-y-2 bg-muted/30 p-3 rounded-md border">
                    <div className="flex items-center gap-2 text-emerald-600 font-medium mb-3">
                      <CheckCircle2 className="h-4 w-4" /> Agradecemos o seu
                      feedback!
                    </div>
                    {survey.questions.slice(0, 2).map((q) => {
                      const ans = response.answers.find(
                        (a) => a.questionId === q.id,
                      )
                      return (
                        <div key={q.id}>
                          <p className="font-medium text-xs text-foreground">
                            {q.text}
                          </p>
                          <p className="text-muted-foreground text-xs truncate">
                            {ans?.value || '-'}
                          </p>
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <StudentSurveyDialog survey={survey} studentId={studentId} />
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
