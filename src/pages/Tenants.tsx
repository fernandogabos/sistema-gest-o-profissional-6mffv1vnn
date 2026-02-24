import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Building2 } from 'lucide-react'
import useAppStore from '@/stores/main'
import { formatDate } from '@/lib/formatters'

export default function Tenants() {
  const { tenants, users } = useAppStore()

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Inquilinos (Tenants)
        </h1>
        <p className="text-muted-foreground mt-1">
          Gestão global de todas as contas SaaS da plataforma.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tenants.map((t) => {
          const tUsers = users.filter((u) => u.tenantId === t.id).length
          return (
            <Card key={t.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-xl">{t.name}</CardTitle>
                <Building2 className="h-5 w-5 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center mt-4">
                  <Badge
                    variant={t.status === 'active' ? 'default' : 'secondary'}
                  >
                    {t.status === 'active' ? 'Ativo' : 'Inativo'}
                  </Badge>
                  <span className="text-sm font-medium text-muted-foreground">
                    {tUsers} usuários
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-4">
                  Criado em {formatDate(t.createdAt)}
                </p>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
