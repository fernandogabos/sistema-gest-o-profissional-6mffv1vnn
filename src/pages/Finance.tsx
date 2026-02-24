import { useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowUpRight, ArrowDownRight, Activity } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import {
  Bar,
  BarChart,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts'
import useAppStore from '@/stores/main'
import { formatBRL, formatDate } from '@/lib/formatters'

export default function Finance() {
  const { transactions, locations, currentLocationId } = useAppStore()

  const filteredTxns = useMemo(() => {
    return transactions.filter(
      (t) => currentLocationId === 'all' || t.locationId === currentLocationId,
    )
  }, [transactions, currentLocationId])

  const stats = useMemo(() => {
    let income = 0
    let expense = 0
    let repasse = 0

    filteredTxns.forEach((t) => {
      if (t.type === 'income') income += t.amount
      else expense += t.amount
    })

    // Calculate repasse roughly based on current locations
    const locTotals: Record<string, number> = {}
    filteredTxns
      .filter((t) => t.type === 'income')
      .forEach((t) => {
        locTotals[t.locationId] = (locTotals[t.locationId] || 0) + t.amount
      })

    locations.forEach((loc) => {
      if (currentLocationId === 'all' || loc.id === currentLocationId) {
        if (loc.splitType === 'percentage') {
          repasse += (locTotals[loc.id] || 0) * (loc.splitValue / 100)
        } else if (locTotals[loc.id] && locTotals[loc.id] > 0) {
          // Simplistic fixed fee calculation per active location with income
          repasse += loc.splitValue
        }
      }
    })

    const net = income - expense - repasse
    return { income, expense, repasse, net }
  }, [filteredTxns, locations, currentLocationId])

  const chartData = useMemo(() => {
    // Mock chart data grouping by some logic, here just a static rep of recent months for demo
    return [
      { name: 'Nov', income: stats.income * 0.8, expense: stats.expense * 0.9 },
      { name: 'Dez', income: stats.income * 0.9, expense: stats.expense * 1.1 },
      { name: 'Jan', income: stats.income, expense: stats.expense },
      { name: 'Fev', income: stats.income * 1.1, expense: stats.expense * 0.8 },
    ]
  }, [stats])

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Financeiro</h1>
        <p className="text-muted-foreground mt-1">
          Gestão de receitas, despesas e cálculo de repasses.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receita Bruta</CardTitle>
            <ArrowUpRight className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">
              {formatBRL(stats.income)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Despesas</CardTitle>
            <ArrowDownRight className="h-4 w-4 text-rose-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-rose-600">
              {formatBRL(stats.expense)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Repasses (Estimativa)
            </CardTitle>
            <Activity className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">
              {formatBRL(stats.repasse)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Baseado nas regras dos locais
            </p>
          </CardContent>
        </Card>
        <Card className="bg-primary text-primary-foreground">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Receita Líquida
            </CardTitle>
            <ArrowUpRight className="h-4 w-4 opacity-70" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatBRL(stats.net)}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Fluxo de Caixa</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                income: { label: 'Receitas', color: 'hsl(var(--chart-2))' },
                expense: {
                  label: 'Despesas',
                  color: 'hsl(var(--destructive))',
                },
              }}
              className="h-[300px] w-full"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <CartesianGrid vertical={false} strokeDasharray="3 3" />
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
                    tickFormatter={(v) => `R$${v}`}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar
                    dataKey="income"
                    fill="var(--color-income)"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="expense"
                    fill="var(--color-expense)"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="lg:col-span-1 flex flex-col">
          <CardHeader>
            <CardTitle>Transações Recentes</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 overflow-auto">
            <div className="space-y-4">
              {filteredTxns.slice(0, 5).map((txn) => (
                <div
                  key={txn.id}
                  className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
                >
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {txn.description}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(txn.date)}
                    </p>
                  </div>
                  <Badge
                    variant={txn.type === 'income' ? 'outline' : 'secondary'}
                    className={
                      txn.type === 'income'
                        ? 'text-emerald-600 border-emerald-200'
                        : 'text-rose-600'
                    }
                  >
                    {txn.type === 'income' ? '+' : '-'}
                    {formatBRL(txn.amount)}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
