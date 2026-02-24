import { useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Building2, DollarSign, Users, Package } from 'lucide-react'
import { formatBRL } from '@/lib/formatters'
import useAppStore from '@/stores/main'

export function MasterDashboard() {
  const { tenants, users, payments, plans } = useAppStore()

  const stats = useMemo(() => {
    const activeTenants = tenants.filter((t) => t.status === 'active').length
    const totalUsers = users.length
    const globalPlans = plans.filter((p) => p.isGlobal).length

    // Revenue across ALL tenants
    const gmv = payments
      .filter((p) => p.status === 'paid')
      .reduce((sum, p) => sum + p.valorPago, 0)
    const systemRevenue = gmv * 0.05

    return { activeTenants, totalUsers, globalPlans, gmv, systemRevenue }
  }, [tenants, users, payments, plans])

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8 animate-fade-in-up">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Administração Global
        </h1>
        <p className="text-muted-foreground mt-1">
          Supervisão de todos os inquilinos (SaaS) e métricas gerais do sistema.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Inquilinos Ativos
            </CardTitle>
            <Building2 className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeTenants}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Usuários Totais
            </CardTitle>
            <Users className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Volume Transacionado (GMV)
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatBRL(stats.gmv)}</div>
          </CardContent>
        </Card>

        <Card className="bg-emerald-600 text-white border-none">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Receita da Plataforma (5%)
            </CardTitle>
            <DollarSign className="h-4 w-4 text-white/80" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatBRL(stats.systemRevenue)}
            </div>
            <p className="text-xs text-emerald-100 mt-1">
              Taxa de serviço estimada
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Planos Globais Disponíveis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {plans
                .filter((p) => p.isGlobal)
                .map((p) => (
                  <div
                    key={p.id}
                    className="flex justify-between items-center border-b pb-4 last:border-0 last:pb-0"
                  >
                    <div>
                      <p className="font-medium">{p.nome}</p>
                      <p className="text-xs text-muted-foreground">
                        {p.frequenciaSemanal}x na semana
                      </p>
                    </div>
                    <div className="font-bold">{formatBRL(p.valor)}</div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
