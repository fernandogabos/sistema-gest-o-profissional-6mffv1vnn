import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Plus, MapPin } from 'lucide-react'
import useAppStore from '@/stores/main'
import { formatBRL } from '@/lib/formatters'

export default function Locations() {
  const { locations } = useAppStore()

  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Locais de Atendimento
          </h1>
          <p className="text-muted-foreground mt-1">
            Gerencie os estúdios, academias e as regras de repasse financeiro.
          </p>
        </div>
        <Button className="shrink-0">
          <Plus className="mr-2 h-4 w-4" />
          Novo Local
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {locations.map((loc) => (
          <Card
            key={loc.id}
            className="transition-all hover:shadow-md hover:-translate-y-1 duration-200 cursor-pointer group"
          >
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div className="p-2 bg-primary/10 rounded-lg text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <MapPin className="h-5 w-5" />
                </div>
                <Badge variant="outline" className="bg-background">
                  Ativo
                </Badge>
              </div>
              <CardTitle className="mt-4 text-xl">{loc.name}</CardTitle>
              <CardDescription>Regra de Repasse</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-muted/50 p-3 rounded-md">
                <p className="text-sm font-medium flex justify-between">
                  <span className="text-muted-foreground">Tipo:</span>
                  <span className="capitalize">
                    {loc.splitType === 'fixed' ? 'Taxa Fixa' : 'Porcentagem'}
                  </span>
                </p>
                <p className="text-sm font-medium flex justify-between mt-2">
                  <span className="text-muted-foreground">Valor:</span>
                  <span className="text-primary font-bold">
                    {loc.splitType === 'fixed'
                      ? formatBRL(loc.splitValue)
                      : `${loc.splitValue}%`}
                  </span>
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
