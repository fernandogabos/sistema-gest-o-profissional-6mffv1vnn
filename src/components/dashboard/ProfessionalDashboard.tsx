import { useMemo } from 'react'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import {
  Users,
  DollarSign,
  Activity,
  Wallet,
  AlertCircle,
  Trophy,
} from 'lucide-react'
import { formatBRL } from '@/lib/formatters'
import useAppStore from '@/stores/main'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  Tooltip,
  Legend,
  Pie,
  PieChart,
  Cell,
} from 'recharts'

export function ProfessionalDashboard() {
  const { currentUser, students, payments, expenses, sessions, locations } =
    useAppStore()

  const stats = useMemo(() => {
    const tStudents = students.filter(
      (s) => s.tenantId === currentUser.tenantId,
    )
    const tPayments = payments.filter(
      (p) => p.tenantId === currentUser.tenantId,
    )
    const tExpenses = expenses.filter(
      (e) => e.tenantId === currentUser.tenantId,
    )
    const tSessions = sessions.filter(
      (s) => s.tenantId === currentUser.tenantId && s.status === 'realized',
    )

    const activeStudents = tStudents.filter((s) => s.status === 'active').length
    let grossRev = 0
    tPayments
      .filter((p) => p.status === 'paid')
      .forEach((p) => {
        grossRev += p.valorPago
      })

    let totalRepasses = 0
    let totalBrutoSessoes = 0
    tSessions.forEach((s) => {
      totalRepasses += s.repasse_calculado
      totalBrutoSessoes += s.valor_bruto
    })

    let totalExpenses = 0
    tExpenses.forEach((e) => {
      totalExpenses += e.valor
    })

    const netProfit = grossRev - totalRepasses - totalExpenses

    // Location analysis
    const locMap = new Map()
    locations
      .filter((l) => l.tenantId === currentUser.tenantId)
      .forEach((l) => {
        locMap.set(l.id, {
          name: l.name,
          bruto: 0,
          repasse: 0,
          lucro: 0,
          sessoes: 0,
        })
      })

    tSessions.forEach((s) => {
      if (locMap.has(s.localId)) {
        const d = locMap.get(s.localId)
        d.bruto += s.valor_bruto
        d.repasse += s.repasse_calculado
        d.lucro += s.lucro_liquido
        d.sessoes += 1
      }
    })

    const locArray = Array.from(locMap.values())
      .map((d) => ({
        ...d,
        ticketMedio: d.sessoes > 0 ? d.bruto / d.sessoes : 0,
      }))
      .sort((a, b) => b.lucro - a.lucro)

    const bestLocation =
      locArray.length > 0 && locArray[0].lucro > 0 ? locArray[0] : null

    // Chart Data
    const pieData = locArray
      .filter((d) => d.lucro > 0)
      .map((d) => ({ name: d.name, value: d.lucro }))
    const COLORS = [
      'hsl(var(--primary))',
      '#10b981',
      '#f59e0b',
      '#3b82f6',
      '#8b5cf6',
    ]

    // Monthly Chart Data (Mocking last 3 months based on current data)
    const monthlyData = [
      {
        name: 'Mês Retrasado',
        bruto: grossRev * 0.7,
        liquido: (grossRev - totalRepasses - totalExpenses) * 0.7,
      },
      {
        name: 'Mês Passado',
        bruto: grossRev * 0.85,
        liquido: (grossRev - totalRepasses - totalExpenses) * 0.8,
      },
      { name: 'Mês Atual', bruto: grossRev, liquido: netProfit },
    ]

    return {
      activeStudents,
      grossRev,
      totalRepasses,
      totalExpenses,
      netProfit,
      bestLocation,
      locArray,
      pieData,
      COLORS,
      monthlyData,
    }
  }, [currentUser, students, payments, expenses, sessions, locations])

  const barChartConfig = {
    bruto: { label: 'Receita Bruta', color: '#cbd5e1' },
    liquido: { label: 'Lucro Líquido', color: 'hsl(var(--primary))' },
  }

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8 animate-fade-in-up">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Painel Operacional
        </h1>
        <p className="text-muted-foreground mt-1">
          Métricas financeiras e performance por local de atendimento.
        </p>
      </div>

      {stats.bestLocation && (
        <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20 shadow-sm">
          <CardContent className="p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="bg-primary/20 p-3 rounded-full shrink-0">
                <Trophy className="h-8 w-8 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Local Mais Lucrativo
                </p>
                <h3 className="text-2xl font-bold text-foreground">
                  {stats.bestLocation.name}
                </h3>
              </div>
            </div>
            <div className="sm:text-right">
              <p className="text-sm font-medium text-muted-foreground">
                Lucro Líquido
              </p>
              <h3 className="text-2xl font-bold text-emerald-600">
                {formatBRL(stats.bestLocation.lucro)}
              </h3>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Receita Bruta</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatBRL(stats.grossRev)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Custo Repasses
            </CardTitle>
            <Activity className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">
              -{formatBRL(stats.totalRepasses)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Despesas Fixas
            </CardTitle>
            <AlertCircle className="h-4 w-4 text-rose-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-rose-600">
              -{formatBRL(stats.totalExpenses)}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-primary text-primary-foreground border-none">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Lucro Líquido</CardTitle>
            <Wallet className="h-4 w-4 text-white/80" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatBRL(stats.netProfit)}
            </div>
            <p className="text-xs text-primary-foreground/80 mt-1">
              Sua margem real
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Lucro por Local</CardTitle>
            <CardDescription>
              Distribuição do lucro líquido entre seus locais
            </CardDescription>
          </CardHeader>
          <CardContent className="h-[300px] flex items-center justify-center">
            {stats.pieData.length > 0 ? (
              <ChartContainer
                config={{}}
                className="h-full w-full min-h-[250px]"
              >
                <PieChart>
                  <Pie
                    data={stats.pieData}
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {stats.pieData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={stats.COLORS[index % stats.COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <ChartTooltip
                    content={
                      <ChartTooltipContent
                        formatter={(value) => formatBRL(value as number)}
                      />
                    }
                  />
                  <Legend />
                </PieChart>
              </ChartContainer>
            ) : (
              <p className="text-muted-foreground">Sem dados suficientes.</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Evolução de Receita</CardTitle>
            <CardDescription>Comparativo Bruto x Líquido</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ChartContainer
              config={barChartConfig}
              className="h-full w-full min-h-[250px]"
            >
              <BarChart
                data={stats.monthlyData}
                margin={{ top: 20, right: 0, left: 0, bottom: 0 }}
              >
                <XAxis
                  dataKey="name"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <ChartTooltip
                  cursor={{ fill: 'transparent' }}
                  content={
                    <ChartTooltipContent
                      formatter={(value) => formatBRL(value as number)}
                    />
                  }
                />
                <Legend />
                <Bar
                  dataKey="bruto"
                  name="Bruto"
                  fill={barChartConfig.bruto.color}
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="liquido"
                  name="Líquido"
                  fill={barChartConfig.liquido.color}
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Ranking de Locais</CardTitle>
          <CardDescription>
            Análise detalhada de performance por local de atendimento.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="border-b text-muted-foreground">
                  <th className="pb-3 font-medium">Local</th>
                  <th className="pb-3 font-medium text-right">Sessões</th>
                  <th className="pb-3 font-medium text-right">Ticket Médio</th>
                  <th className="pb-3 font-medium text-right">Receita Bruta</th>
                  <th className="pb-3 font-medium text-right">Custo Repasse</th>
                  <th className="pb-3 font-medium text-right">Lucro Líquido</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {stats.locArray.map((l, idx) => (
                  <tr
                    key={l.name}
                    className="hover:bg-muted/50 transition-colors"
                  >
                    <td className="py-3 font-medium flex items-center gap-2">
                      <span className="text-muted-foreground text-xs w-4">
                        {idx + 1}º
                      </span>
                      {l.name}
                    </td>
                    <td className="py-3 text-right">{l.sessoes}</td>
                    <td className="py-3 text-right">
                      {formatBRL(l.ticketMedio)}
                    </td>
                    <td className="py-3 text-right">{formatBRL(l.bruto)}</td>
                    <td className="py-3 text-right text-amber-600">
                      -{formatBRL(l.repasse)}
                    </td>
                    <td className="py-3 text-right text-emerald-600 font-bold">
                      {formatBRL(l.lucro)}
                    </td>
                  </tr>
                ))}
                {stats.locArray.length === 0 && (
                  <tr>
                    <td
                      colSpan={6}
                      className="py-8 text-center text-muted-foreground"
                    >
                      Sem dados registrados.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
