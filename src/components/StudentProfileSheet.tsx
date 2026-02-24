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
import useAppStore from '@/stores/main'

interface Props {
  student: Student | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function StudentProfileSheet({ student, open, onOpenChange }: Props) {
  const { plans } = useAppStore()

  if (!student) return null

  const plan = plans.find((p) => p.id === student.planId)

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-xl overflow-y-auto">
        <SheetHeader className="mb-6">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16 border-2 border-primary/20">
              <AvatarImage src={student.avatarUrl} />
              <AvatarFallback>
                {student.nome.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <SheetTitle className="text-2xl">{student.nome}</SheetTitle>
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
              </SheetDescription>
            </div>
          </div>
        </SheetHeader>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="contact">Contato</TabsTrigger>
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
                  {plan?.nome || 'Sem plano'}
                </p>
                {plan && (
                  <p className="text-sm text-muted-foreground mt-1">
                    {plan.frequenciaSemanal}x por semana
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="contact" className="animate-fade-in space-y-4">
            <Card>
              <CardContent className="pt-6 space-y-4">
                <div>
                  <span className="text-sm text-muted-foreground">E-mail</span>
                  <p className="font-medium">{student.email}</p>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">
                    Telefone
                  </span>
                  <p className="font-medium">{student.telefone}</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  )
}
