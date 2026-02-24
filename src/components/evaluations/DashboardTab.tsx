import { useMemo, useState } from 'react'
import { TrendingUp, User as UserIcon, Activity } from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import { LineChart, Line, CartesianGrid, XAxis, YAxis } from 'recharts'
import useAppStore from '@/stores/main'
import { getClassificationLabel } from '@/lib/evaluations'
import { formatDate } from '@/lib/formatters'

export function DashboardTab() {
  const { evaluationResults, students, currentUser } = useAppStore()
  const tenantStudents = students.filter(
    (s) => s.tenantId === currentUser.tenantId,
  )

  const [targetId, setTargetId] = useState<string>(
    tenantStudents[0]?.id || 'all',
  )

  const chartData = useMemo(() => {
    let results = evaluationResults.filter(
      (r) => r.tenantId === currentUser.tenantId,
    )
    if (targetId !== 'all') {
      results = results.filter((r) => r.targetId === targetId)
    }

    return results
      .sort((a, b) => a.date.localeCompare(b.date))
      .map((r) => ({
        dateLabel: formatDate(r.date),
        score: r.totalScore,
        rawDate: r.date,
      }))
  }, [evaluationResults, currentUser.tenantId, targetId])

  const stats = useMemo(() => {
    if (chartData.length === 0) return null
    const latest = chartData[chartData.length - 1]
    const avg =
      chartData.reduce((acc, curr) => acc + curr.score, 0) / chartData.length
    return { latest, avg }
  }, [chartData])

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-semibold">Evolução do Aluno</h2>
          <p className="text-sm text-muted-foreground">
            Acompanhe o histórico de notas através do tempo.
          </p>
        </div>
        <div className="w-full sm:w-64">
          <Select value={targetId} onValueChange={setTargetId}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione o aluno" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Visão Geral (Todos)</SelectItem>
              {tenantStudents.map((s) => (
                <SelectItem key={s.id} value={s.id}>
                  {s.nome}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Última Nota</CardTitle>
            <TrendingUp className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats?.latest?.score.toFixed(1) || '-'}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Média Global</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats?.avg?.toFixed(1) || '-'}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Total de Avaliações
            </CardTitle>
            <UserIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{chartData.length}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Histórico de Desempenho</CardTitle>
          <CardDescription>
            Pontuação total consolidada por data de avaliação.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              score: { label: 'Pontuação', color: 'hsl(var(--primary))' },
            }}
            className="h-[300px] w-full"
          >
            <LineChart
              data={chartData}
              margin={{ top: 20, right: 20, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="dateLabel"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                domain={[0, 100]}
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line
                type="monotone"
                dataKey="score"
                name="Pontuação"
                stroke="var(--color-score)"
                strokeWidth={3}
                dot={{ r: 4 }}
              />
            </LineChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  )
}
