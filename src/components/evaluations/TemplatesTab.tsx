import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Settings, CheckCircle2 } from 'lucide-react'
import useAppStore from '@/stores/main'
import { NewTemplateDialog } from './NewTemplateDialog'

export function TemplatesTab() {
  const { evaluationTemplates, currentUser, updateEvaluationTemplate } =
    useAppStore()
  const templates = evaluationTemplates.filter(
    (t) => t.tenantId === currentUser.tenantId,
  )

  const toggleStatus = (id: string, status: string) => {
    updateEvaluationTemplate(id, {
      status: status === 'active' ? 'inactive' : 'active',
    })
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">Modelos Configurados</h2>
          <p className="text-sm text-muted-foreground">
            Gerencie os templates de avaliação e seus critérios com pesos.
          </p>
        </div>
        <NewTemplateDialog />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((tpl) => (
          <Card
            key={tpl.id}
            className={`relative transition-all ${tpl.status === 'inactive' ? 'opacity-60' : ''}`}
          >
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <Badge variant="outline" className="capitalize">
                  {tpl.type === 'student' ? 'Aluno' : tpl.type}
                </Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleStatus(tpl.id, tpl.status)}
                >
                  {tpl.status === 'active' ? 'Desativar' : 'Ativar'}
                </Button>
              </div>
              <CardTitle className="mt-2 text-xl">{tpl.name}</CardTitle>
              <CardDescription>{tpl.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 mt-2">
                <p className="text-sm font-medium text-muted-foreground flex items-center gap-2 mb-3 border-b pb-2">
                  <Settings className="h-4 w-4" /> Critérios (
                  {tpl.criteria.length})
                </p>
                {tpl.criteria.map((c) => (
                  <div
                    key={c.id}
                    className="flex justify-between items-center text-sm bg-muted/40 p-2 rounded-md"
                  >
                    <span className="flex items-center gap-2">
                      <CheckCircle2 className="h-3 w-3 text-primary" />
                      {c.name}
                    </span>
                    <Badge variant="secondary">Peso: {c.weight}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}

        {templates.length === 0 && (
          <div className="col-span-full py-12 text-center border rounded-lg border-dashed">
            <p className="text-muted-foreground">
              Nenhum modelo de avaliação configurado ainda.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
