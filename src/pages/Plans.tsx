import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import useAppStore from '@/stores/main'
import { formatBRL } from '@/lib/formatters'

export default function Plans() {
  const { plans, currentUser } = useAppStore()

  const displayPlans =
    currentUser.role === 'master'
      ? plans.filter((p) => p.isGlobal)
      : plans.filter((p) => p.tenantId === currentUser.tenantId)

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Planos de Assinatura
          </h1>
          <p className="text-muted-foreground mt-1">
            {currentUser.role === 'master'
              ? 'Gerencie os planos globais da plataforma SaaS.'
              : 'Gerencie os planos oferecidos aos seus alunos.'}
          </p>
        </div>
        <Button className="shrink-0">
          <Plus className="mr-2 h-4 w-4" /> Novo Plano
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {displayPlans.map((p) => (
          <Card
            key={p.id}
            className="relative overflow-hidden hover:shadow-md transition-shadow"
          >
            {p.isGlobal && (
              <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-[10px] px-2 py-1 font-bold rounded-bl-lg">
                GLOBAL
              </div>
            )}
            <CardHeader>
              <CardTitle className="text-xl">{p.name}</CardTitle>
              <CardDescription className="capitalize">
                Cobrança{' '}
                {p.interval === 'monthly'
                  ? 'Mensal'
                  : p.interval === 'quarterly'
                    ? 'Trimestral'
                    : 'Anual'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary mb-6">
                {formatBRL(p.price)}
              </div>
              <Button variant="outline" className="w-full">
                Editar Plano
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
