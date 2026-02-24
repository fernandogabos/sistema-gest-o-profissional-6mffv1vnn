import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { EvaluationResult } from '@/stores/mockData'
import { formatDate } from '@/lib/formatters'
import {
  getClassificationLabel,
  getClassificationColors,
} from '@/lib/evaluations'

interface Props {
  result: EvaluationResult | null
  open: boolean
  onOpenChange: (open: boolean) => void
  targetName: string
}

export function EvaluationReportDialog({
  result,
  open,
  onOpenChange,
  targetName,
}: Props) {
  if (!result) return null

  const badgeClass = getClassificationColors(result.classification)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Relatório de Avaliação</DialogTitle>
        </DialogHeader>
        <div className="space-y-6 pt-4">
          <div className="grid grid-cols-2 gap-4 bg-muted/30 p-4 rounded-lg border">
            <div>
              <p className="text-sm text-muted-foreground">Modelo Aplicado</p>
              <p className="font-medium">{result.templateName}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Avaliado</p>
              <p className="font-medium">{targetName}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Data</p>
              <p className="font-medium">{formatDate(result.date)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Status Final</p>
              <Badge className={badgeClass} variant="outline">
                {getClassificationLabel(result.classification)}
              </Badge>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-3">Detalhamento dos Critérios</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Critério</TableHead>
                  <TableHead className="text-center">Peso</TableHead>
                  <TableHead className="text-right">Nota Obtida</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {result.scores.map((s, idx) => (
                  <TableRow key={idx}>
                    <TableCell className="font-medium">{s.name}</TableCell>
                    <TableCell className="text-center text-muted-foreground">
                      x{s.weight}
                    </TableCell>
                    <TableCell className="text-right font-semibold">
                      {s.value.toFixed(1)}
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow className="bg-muted/50">
                  <TableCell className="font-bold">
                    Média Ponderada Final
                  </TableCell>
                  <TableCell></TableCell>
                  <TableCell className="text-right font-bold text-lg text-primary">
                    {result.totalScore.toFixed(1)}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
