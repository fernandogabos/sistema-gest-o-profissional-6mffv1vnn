import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { SurveyList } from '@/components/surveys/SurveyList'

export default function Surveys() {
  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Pesquisas e Feedbacks
        </h1>
        <p className="text-muted-foreground mt-1">
          Crie pesquisas de satisfação, NPS e colete feedbacks de treinamento
          dos seus alunos.
        </p>
      </div>

      <Tabs defaultValue="satisfaction" className="w-full">
        <TabsList className="grid w-full grid-cols-3 max-w-md mb-6">
          <TabsTrigger value="satisfaction">Satisfação Geral</TabsTrigger>
          <TabsTrigger value="nps">NPS</TabsTrigger>
          <TabsTrigger value="feedback">Feedback</TabsTrigger>
        </TabsList>

        <TabsContent value="satisfaction">
          <SurveyList type="satisfaction" />
        </TabsContent>

        <TabsContent value="nps">
          <SurveyList type="nps" />
        </TabsContent>

        <TabsContent value="feedback">
          <SurveyList type="feedback" />
        </TabsContent>
      </Tabs>
    </div>
  )
}
