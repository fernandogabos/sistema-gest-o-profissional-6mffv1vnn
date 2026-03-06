import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { FileText, Users } from 'lucide-react'
import useAppStore from '@/stores/main'
import { NewSurveyDialog } from './NewSurveyDialog'
import { SurveyResultsDialog } from './SurveyResultsDialog'

interface Props {
  type: 'satisfaction' | 'nps' | 'feedback'
}

export function SurveyList({ type }: Props) {
  const { surveys, surveyResponses, currentUser, updateSurvey } = useAppStore()
  const mySurveys = surveys.filter(
    (s) => s.tenantId === currentUser.tenantId && s.type === type,
  )

  const toggleStatus = (id: string, status: string) => {
    updateSurvey(id, { status: status === 'active' ? 'inactive' : 'active' })
  }

  const getTypeLabel = () => {
    switch (type) {
      case 'satisfaction':
        return 'Pesquisas de Satisfação'
      case 'nps':
        return 'Pesquisas NPS'
      case 'feedback':
        return 'Feedback de Treinamentos'
    }
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">{getTypeLabel()}</h2>
          <p className="text-sm text-muted-foreground">
            Gerencie seus questionários e analise as respostas dos alunos.
          </p>
        </div>
        <NewSurveyDialog type={type} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mySurveys.map((survey) => {
          const responsesCount = surveyResponses.filter(
            (r) => r.surveyId === survey.id,
          ).length

          return (
            <Card
              key={survey.id}
              className={`transition-all ${
                survey.status === 'inactive' ? 'opacity-60' : ''
              }`}
            >
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <Badge
                    variant={
                      survey.status === 'active' ? 'default' : 'secondary'
                    }
                  >
                    {survey.status === 'active' ? 'Ativa' : 'Inativa'}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleStatus(survey.id, survey.status)}
                  >
                    {survey.status === 'active' ? 'Desativar' : 'Ativar'}
                  </Button>
                </div>
                <CardTitle className="mt-2 text-xl">{survey.title}</CardTitle>
                <CardDescription>{survey.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <FileText className="h-4 w-4" /> {survey.questions.length}{' '}
                      Questões
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="h-4 w-4" /> {responsesCount} Respostas
                    </span>
                  </div>
                  <SurveyResultsDialog survey={survey} />
                </div>
              </CardContent>
            </Card>
          )
        })}

        {mySurveys.length === 0 && (
          <div className="col-span-full py-12 text-center border rounded-lg border-dashed">
            <p className="text-muted-foreground">
              Nenhuma pesquisa configurada para esta categoria.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
