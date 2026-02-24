import { useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, DollarSign, Activity, Wallet } from 'lucide-react'
import { formatBRL } from '@/lib/formatters'
import useAppStore from '@/stores/main'

export default function Index() {
  const { students, transactions, locations, currentLocationId } = useAppStore()

  const stats = useMemo(() => {
    let activeStudents = 0
    let grossRev = 0
    let expense = 0

    // Filter by location context
    const locStudents =
      currentLocationId === 'all'
        ? students
        : students.filter((s) => s.locationId === currentLocationId)

    activeStudents = locStudents.filter((s) => s.status === 'active').length

    const locTxns =
      currentLocationId === 'all'
        ? transactions
        : transactions.filter((t) => t.locationId === currentLocationId)

    locTxns.forEach((t) => {
      if (t.type === 'income') grossRev += t.amount
      else expense += t.amount
    })

    // Simplified repasse calculation for dashboard
    let pendingRepasse = grossRev * 0.25 // Dummy average 25% for visual demo

    return {
      activeStudents,
      grossRev,
      pendingRepasse,
      netRev: grossRev - pendingRepasse - expense,
    }
  }, [students, transactions, currentLocationId])

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8 animate-fade-in-up">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Painel de Controle
        </h1>
        <p className="text-muted-foreground mt-1">
          Bem-vindo de volta! Aqui está o resumo do seu negócio.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Alunos Ativos</CardTitle>
            <div className="p-2 bg-primary/10 rounded-full">
              <Users className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeStudents}</div>
            <p className="text-xs text-muted-foreground mt-1">
              +2 desde o último mês
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receita Bruta</CardTitle>
            <div className="p-2 bg-emerald-500/10 rounded-full">
              <DollarSign className="h-4 w-4 text-emerald-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatBRL(stats.grossRev)}
            </div>
            <p className="text-xs text-emerald-600 font-medium mt-1">
              +15% em relação a ontem
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Repasse Pendente
            </CardTitle>
            <div className="p-2 bg-amber-500/10 rounded-full">
              <Activity className="h-4 w-4 text-amber-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatBRL(stats.pendingRepasse)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              A ser liquidado até dia 05
            </p>
          </CardContent>
        </Card>

        <Card className="bg-primary text-primary-foreground shadow-elevation border-none">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Receita Líquida
            </CardTitle>
            <div className="p-2 bg-white/20 rounded-full">
              <Wallet className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatBRL(stats.netRev)}</div>
            <p className="text-xs text-primary-foreground/80 mt-1">
              Pronto para saque
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Próximos Treinos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="flex items-center gap-4 border-b pb-4 last:border-0 last:pb-0"
                >
                  <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center font-medium text-sm">
                    {i * 2 + 6}:00
                  </div>
                  <div>
                    <p className="text-sm font-medium">Sessão Personal</p>
                    <p className="text-xs text-muted-foreground">
                      Aluno: {students[i % students.length].name}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
