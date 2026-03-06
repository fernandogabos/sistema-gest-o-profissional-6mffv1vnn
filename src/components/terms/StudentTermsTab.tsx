import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { FileText, CheckCircle2 } from 'lucide-react'
import useAppStore from '@/stores/main'
import { formatDate } from '@/lib/formatters'
import { useToast } from '@/hooks/use-toast'

interface Props {
  studentId: string
}

export function StudentTermsTab({ studentId }: Props) {
  const { terms, studentTermAcceptances, currentUser, acceptTerm } =
    useAppStore()
  const { toast } = useToast()

  const activeTerms = terms.filter(
    (t) => t.tenantId === currentUser.tenantId && t.isActive,
  )
  const acceptances = studentTermAcceptances.filter(
    (a) => a.studentId === studentId,
  )

  const handleSimulateAccept = (termId: string) => {
    acceptTerm(studentId, termId)
    toast({
      title: 'Termo Aceito',
      description: 'Ação simulada com sucesso.',
    })
  }

  return (
    <div className="space-y-4">
      <div className="mb-2">
        <h3 className="text-sm font-medium">Termos Ativos</h3>
        <p className="text-xs text-muted-foreground">
          Documentos legais que o aluno precisa ler e concordar.
        </p>
      </div>

      {activeTerms.length === 0 && (
        <p className="text-sm text-muted-foreground">
          Nenhum termo ativo no momento.
        </p>
      )}

      <div className="grid gap-4">
        {activeTerms.map((term) => {
          const acceptance = acceptances.find((a) => a.termId === term.id)
          const isAccepted = !!acceptance

          return (
            <Card key={term.id}>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start gap-4">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-primary shrink-0" />
                    <CardTitle className="text-sm leading-tight">
                      {term.title}
                    </CardTitle>
                  </div>
                  {isAccepted ? (
                    <Badge
                      variant="secondary"
                      className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 shrink-0"
                    >
                      Aceito
                    </Badge>
                  ) : (
                    <Badge
                      variant="outline"
                      className="shrink-0 text-amber-600 border-amber-200 bg-amber-50"
                    >
                      Pendente
                    </Badge>
                  )}
                </div>
                <CardDescription className="line-clamp-2 mt-2 text-xs">
                  {term.content}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isAccepted ? (
                  <div className="text-xs space-y-1 bg-muted/30 p-2.5 rounded-md border flex items-center justify-between">
                    <div className="flex items-center gap-2 text-emerald-600 font-medium">
                      <CheckCircle2 className="h-4 w-4" /> Aceite registrado
                    </div>
                    <span className="text-muted-foreground">
                      em {formatDate(acceptance.acceptedAt)}
                    </span>
                  </div>
                ) : (
                  <div className="flex justify-end pt-2 border-t">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSimulateAccept(term.id)}
                    >
                      Simular Aceite do Aluno
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
