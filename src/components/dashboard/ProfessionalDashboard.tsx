import { useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Users,
  DollarSign,
  Activity,
  Wallet,
  MapPin,
  AlertCircle,
} from 'lucide-react'
import { formatBRL } from '@/lib/formatters'
import useAppStore from '@/stores/main'

export function ProfessionalDashboard() {
  const {
    currentUser,
    students,
    payments,
    expenses,
    locations,
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
    const tLocs = locations.filter((l) => l.tenantId === currentUser.tenantId)

    const locStudents =
      currentLocationId === 'all'
        ? tStudents
        : tStudents.filter((s) => s.locationId === currentLocationId)
    const locPayments =
      currentLocationId === 'all'
        ? tPayments
        : tPayments.filter((p) => p.locationId === currentLocationId)
    const locExpenses =
      currentLocationId === 'all'
        ? tExpenses
        : tExpenses.filter((e) => e.locationId === currentLocationId)

    const activeStudents = locStudents.filter(
      (s) => s.status === 'active',
    ).length
    const delinquentStudents = locStudents.filter(
      (s) => s.status === 'delinquent',
    ).length
    const delinquencyRate =
      locStudents.length > 0
        ? (delinquentStudents / locStudents.length) * 100
        : 0

    let grossRev = 0
    let totalExpenses = 0
    let totalRepasses = 0

    locPayments
      .filter((p) => p.status === 'paid')
      .forEach((p) => {
        grossRev += p.amount
      })
    locExpenses.forEach((e) => {
      totalExpenses += e.amount
    })

    const locTotals: Record<string, number> = {}
    tPayments
      .filter((p) => p.status === 'paid')
      .forEach((p) => {
        locTotals[p.locationId] = (locTotals[p.locationId] || 0) + p.amount
      })

    let mostProfitableLoc = { name: 'Nenhum', net: 0 }

    tLocs.forEach((loc) => {
      let locRepasse = 0
      const locGross = locTotals[loc.id] || 0

      if (loc.rule.type === 'percentage') {
        locRepasse = locGross * (loc.rule.value / 100)
      } else {
        locRepasse = locGross > 0 ? loc.rule.value : 0
      }

      if (currentLocationId === 'all' || loc.id === currentLocationId) {
        totalRepasses += locRepasse
      }

      const locExp = tExpenses
        .filter((e) => e.locationId === loc.id)
        .reduce((sum, e) => sum + e.amount, 0)
      const locNet = locGross - locRepasse - locExp
      if (locNet >= mostProfitableLoc.net && locGross > 0) {
        mostProfitableLoc = { name: loc.name, net: locNet }
      }
    })

    const netRev = grossRev - totalRepasses - totalExpenses

    return {
      activeStudents,
      grossRev,
      totalRepasses,
      netRev,
      delinquencyRate,
      mostProfitableLoc,
    }
  }, [currentUser, students, payments, expenses, locations, currentLocationId])

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
            <div className="text-2xl font-bold">
              {formatBRL(stats.grossRev)}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-primary text-primary-foreground border-none">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Receita Líquida
            </CardTitle>
            <Wallet className="h-4 w-4 text-white/80" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatBRL(stats.netRev)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Total de Repasses Pagos
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
              Total de Alunos Ativos
            </CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeStudents}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Inadimplência</CardTitle>
            <AlertCircle className="h-4 w-4 text-rose-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-rose-600">
              {stats.delinquencyRate.toFixed(1)}%
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Local Mais Lucrativo
            </CardTitle>
            <MapPin className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold truncate">
              {stats.mostProfitableLoc.name}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Líquido: {formatBRL(stats.mostProfitableLoc.net)}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
