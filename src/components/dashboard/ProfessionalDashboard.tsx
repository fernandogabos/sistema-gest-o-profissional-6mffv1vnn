import { useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, DollarSign, Activity, Wallet, AlertCircle } from 'lucide-react'
import { formatBRL } from '@/lib/formatters'
import useAppStore from '@/stores/main'

export function ProfessionalDashboard() {
  const {
    currentUser,
    students,
    payments,
    expenses,
    sessions,
    currentLocationId,
  } = useAppStore()

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
      (s) => s.tenantId === currentUser.tenantId,
    )

    // For dashboard, we apply location filter if one is selected, but usually it's a global view
    const locSessions =
      currentLocationId === 'all'
        ? tSessions
        : tSessions.filter((s) => s.localId === currentLocationId)

    const activeStudents = tStudents.filter((s) => s.status === 'active').length

    let grossRev = 0
    tPayments
      .filter((p) => p.status === 'paid')
      .forEach((p) => {
        grossRev += p.valorPago
      })

    let totalRepasses = 0
    locSessions.forEach((s) => {
      totalRepasses += s.repasseCalculado
    })

    let totalExpenses = 0
    tExpenses.forEach((e) => {
      totalExpenses += e.valor
    })

    const netProfit = grossRev - totalRepasses - totalExpenses

    return { activeStudents, grossRev, totalRepasses, totalExpenses, netProfit }
  }, [currentUser, students, payments, expenses, sessions, currentLocationId])

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8 animate-fade-in-up">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Painel de Controle
        </h1>
        <p className="text-muted-foreground mt-1">
          Visão geral do seu negócio e métricas operacionais.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Receita Bruta Mensal
            </CardTitle>
            <DollarSign className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">
              {formatBRL(stats.grossRev)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Total de Repasses
            </CardTitle>
            <Activity className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">
              {formatBRL(stats.totalRepasses)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Total Despesas
            </CardTitle>
            <AlertCircle className="h-4 w-4 text-rose-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-rose-600">
              {formatBRL(stats.totalExpenses)}
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
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Total Alunos Ativos
            </CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeStudents}</div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
