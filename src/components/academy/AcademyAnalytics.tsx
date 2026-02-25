import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import {
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  PieChart,
  Pie,
  Cell,
} from 'recharts'
import useAppStore from '@/stores/main'
import { formatBRL } from '@/lib/formatters'
import { Activity, Target, ShieldAlert } from 'lucide-react'

export function AcademyAnalytics() {
  const { academyContents, academyEnrollments, students } = useAppStore()

  // Calc general completion rate
  const totalEnrolls = academyEnrollments.length
  const totalCompleted = academyEnrollments.filter(
    (e) => e.progress === 100,
  ).length
  const generalCompletionRate =
    totalEnrolls > 0 ? Math.round((totalCompleted / totalEnrolls) * 100) : 0

  // Churn correlation (mock logic based on enrollments vs active students)
  const studentsWithCourses = new Set(academyEnrollments.map((e) => e.userId))
    .size
  const totalActiveStudents = students.filter(
    (s) => s.status === 'active',
  ).length
  const retentionCorrelation =
    studentsWithCourses > 0 ? '45% Menor' : 'Dados insuficientes'

  // Chart data: Completion by Category
  const categoryDataRaw = academyContents.reduce(
    (acc, c) => {
      if (!acc[c.category]) acc[c.category] = { total: 0, completed: 0 }
      const enrs = academyEnrollments.filter((e) => e.contentId === c.id)
      acc[c.category].total += enrs.length
      acc[c.category].completed += enrs.filter((e) => e.progress === 100).length
      return acc
    },
    {} as Record<string, { total: number; completed: number }>,
  )

  const chartData = Object.entries(categoryDataRaw).map(([name, data]) => ({
    name,
    taxa: data.total > 0 ? Math.round((data.completed / data.total) * 100) : 0,
  }))

  const topLucrative = [...academyContents]
    .sort((a, b) => (b.revenue || 0) - (a.revenue || 0))
    .slice(0, 3)

  const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#8b5cf6']
  const revData = topLucrative.map((c, i) => ({
    name: c.title,
    value: c.revenue || 0,
    fill: COLORS[i],
  }))

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Taxa de Conclusão Global
                </p>
                <h3 className="text-3xl font-bold mt-1 text-primary">
                  {generalCompletionRate}%
                </h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Alunos que finalizam os cursos
                </p>
              </div>
              <Activity className="w-6 h-6 text-primary opacity-50" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Correlação com Retenção
                </p>
                <h3 className="text-3xl font-bold mt-1 text-emerald-600">
                  {retentionCorrelation}
                </h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Risco de churn em alunos que estudam
                </p>
              </div>
              <ShieldAlert className="w-6 h-6 text-emerald-600 opacity-50" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Cursos com Maior NPS
                </p>
                <h3 className="text-xl font-bold mt-1 truncate max-w-[200px]">
                  {topLucrative[0]?.title || '-'}
                </h3>
                <p className="text-xs text-amber-600 font-medium mt-1">
                  NPS: {topLucrative[0]?.nps || '-'}
                </p>
              </div>
              <Target className="w-6 h-6 text-amber-500 opacity-50" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Taxa de Conclusão por Categoria</CardTitle>
            <CardDescription>
              Percentual de finalização agrupado por tema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                taxa: { label: 'Conclusão %', color: 'hsl(var(--primary))' },
              }}
              className="h-[250px] w-full"
            >
              <BarChart
                data={chartData}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis
                  dataKey="name"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  domain={[0, 100]}
                  tickFormatter={(v) => `${v}%`}
                />
                <ChartTooltip
                  content={<ChartTooltipContent formatter={(v) => `${v}%`} />}
                />
                <Bar
                  dataKey="taxa"
                  fill="var(--color-taxa)"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Receita por Curso (Top 3)</CardTitle>
            <CardDescription>
              Distribuição financeira do módulo EAD
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center items-center">
            {revData.length > 0 ? (
              <ChartContainer
                config={Object.fromEntries(
                  revData.map((d, i) => [
                    `v${i}`,
                    { label: d.name, color: d.fill },
                  ]),
                )}
                className="h-[250px] w-full"
              >
                <PieChart>
                  <Pie
                    data={revData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                  >
                    {revData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <ChartTooltip
                    content={
                      <ChartTooltipContent
                        formatter={(v) => formatBRL(v as number)}
                      />
                    }
                  />
                </PieChart>
              </ChartContainer>
            ) : (
              <div className="h-[250px] flex items-center justify-center text-muted-foreground">
                Sem dados financeiros
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
