import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Student } from '@/stores/mockData'
import { formatDate } from '@/lib/formatters'
import useAppStore from '@/stores/main'

interface Props {
  student: Student | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function StudentProfileSheet({ student, open, onOpenChange }: Props) {
  const { locations, plans } = useAppStore()

  if (!student) return null

  const locationName =
    locations.find((l) => l.id === student.locationId)?.name || 'Desconhecido'
  const plan = plans.find((p) => p.id === student.planId)

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-xl overflow-y-auto">
        <SheetHeader className="mb-6">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16 border-2 border-primary/20">
              <AvatarImage src={student.avatarUrl} />
              <AvatarFallback>
                {student.name.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <SheetTitle className="text-2xl">{student.name}</SheetTitle>
              <SheetDescription className="flex items-center gap-2 mt-1">
                <Badge
                  variant={
                    student.status === 'active'
                      ? 'default'
                      : student.status === 'delinquent'
                        ? 'destructive'
                        : 'secondary'
                  }
                >
                  {student.status === 'active'
                    ? 'Ativo'
                    : student.status === 'delinquent'
                      ? 'Inadimplente'
                      : 'Inativo'}
                </Badge>
                <span>Membro desde {formatDate(student.joinDate)}</span>
              </SheetDescription>
            </div>
          </div>
        </SheetHeader>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="workouts">Treinos</TabsTrigger>
            <TabsTrigger value="finance">Financeiro</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4 animate-fade-in">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-muted-foreground">
                  Plano Atual
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg font-medium">
                  {plan?.name || 'Sem plano'}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Local: {locationName}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-muted-foreground">
                  Última Avaliação
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground italic">
                  Nenhuma avaliação recente registrada.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="workouts" className="animate-fade-in">
            <Card>
              <CardContent className="pt-6 text-center text-muted-foreground">
                <p>Nenhum treino ativo no momento.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="finance" className="animate-fade-in">
            <Card>
              <CardContent className="pt-6">
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-sm">Status Pagamento</span>
                  {student.status === 'delinquent' ? (
                    <Badge
                      variant="outline"
                      className="text-rose-600 bg-rose-50 border-rose-200"
                    >
                      Em atraso
                    </Badge>
                  ) : (
                    <Badge
                      variant="outline"
                      className="text-green-600 bg-green-50 border-green-200"
                    >
                      Em dia
                    </Badge>
                  )}
                </div>
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-sm">Próximo Vencimento</span>
                  <span className="text-sm font-medium">10/03/2024</span>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  )
}
