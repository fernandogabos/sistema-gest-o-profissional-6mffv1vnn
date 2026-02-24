import { useState } from 'react'
import { Search } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import useAppStore from '@/stores/main'
import { formatDate } from '@/lib/formatters'
import {
  getClassificationLabel,
  getClassificationColors,
} from '@/lib/evaluations'
import { EvaluationResult } from '@/stores/mockData'
import { NewEvaluationDialog } from './NewEvaluationDialog'
import { EvaluationReportDialog } from './EvaluationReportDialog'

export function HistoryTab() {
  const { evaluationResults, students, currentUser } = useAppStore()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedResult, setSelectedResult] = useState<EvaluationResult | null>(
    null,
  )

  const tenantResults = evaluationResults.filter(
    (r) => r.tenantId === currentUser.tenantId,
  )

  const filteredResults = tenantResults
    .filter((r) => {
      const student = students.find((s) => s.id === r.targetId)
      return student?.nome.toLowerCase().includes(searchTerm.toLowerCase())
    })
    .sort((a, b) => b.date.localeCompare(a.date))

  const getTargetName = (id: string) => {
    return students.find((s) => s.id === id)?.nome || 'Desconhecido'
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-semibold">Histórico de Aplicações</h2>
          <p className="text-sm text-muted-foreground">
            Todas as avaliações registradas e seus respectivos relatórios.
          </p>
        </div>
        <NewEvaluationDialog />
      </div>

      <Card className="overflow-hidden">
        <div className="p-4 border-b bg-muted/20">
          <div className="relative max-w-md">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nome do aluno..."
              className="pl-9 bg-background"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data</TableHead>
                <TableHead>Aluno / Alvo</TableHead>
                <TableHead>Modelo</TableHead>
                <TableHead className="text-center">Nota Final</TableHead>
                <TableHead>Classificação</TableHead>
                <TableHead className="text-right">Ação</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredResults.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="h-24 text-center text-muted-foreground"
                  >
                    Nenhuma avaliação encontrada.
                  </TableCell>
                </TableRow>
              ) : (
                filteredResults.map((res) => {
                  const badgeClass = getClassificationColors(res.classification)
                  return (
                    <TableRow key={res.id}>
                      <TableCell>{formatDate(res.date)}</TableCell>
                      <TableCell className="font-medium">
                        {getTargetName(res.targetId)}
                      </TableCell>
                      <TableCell>{res.templateName}</TableCell>
                      <TableCell className="text-center font-bold">
                        {res.totalScore.toFixed(1)}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={badgeClass}>
                          {getClassificationLabel(res.classification)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedResult(res)}
                        >
                          Ver Relatório
                        </Button>
                      </TableCell>
                    </TableRow>
                  )
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <EvaluationReportDialog
        result={selectedResult}
        open={!!selectedResult}
        onOpenChange={(open) => !open && setSelectedResult(null)}
        targetName={
          selectedResult ? getTargetName(selectedResult.targetId) : ''
        }
      />
    </div>
  )
}
