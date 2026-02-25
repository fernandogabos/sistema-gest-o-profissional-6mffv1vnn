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
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Student } from '@/stores/mockData'
import useAppStore from '@/stores/main'
import { formatDate } from '@/lib/formatters'

interface Props {
  student: Student | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function StudentProfileSheet({ student, open, onOpenChange }: Props) {
  const { plans, communicationLogs, updateStudent, updateStudentConsent } =
    useAppStore()

  if (!student) return null

  const plan = plans.find((p) => p.id === student.planId)
  const studentLogs = communicationLogs
    .filter((l) => l.targetId === student.id)
    .sort((a, b) => b.timestamp.localeCompare(a.timestamp))

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
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="overview">Geral</TabsTrigger>
            <TabsTrigger value="rules">Regras</TabsTrigger>
            <TabsTrigger value="contact">Contato</TabsTrigger>
            <TabsTrigger value="communication">Comunicação</TabsTrigger>
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

          <TabsContent value="rules" className="animate-fade-in space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">
                  Regras de Contrato & Agenda
                </CardTitle>
                <CardDescription>
                  Configure como o sistema lida com a inadimplência deste aluno.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm">
                      Bloquear se Inadimplente
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Impede agendamentos se houver atrasos
                    </p>
                  </div>
                  <Switch
                    checked={student.bloquear_inadimplente}
                    onCheckedChange={(v) =>
                      updateStudent(student.id, { bloquear_inadimplente: v })
                    }
                  />
                </div>
                {student.bloquear_inadimplente && (
                  <div className="space-y-1">
                    <Label className="text-xs">Dias de Tolerância</Label>
                    <Input
                      type="number"
                      className="h-8 text-sm max-w-[100px]"
                      value={student.dias_tolerancia || 0}
                      onChange={(e) =>
                        updateStudent(student.id, {
                          dias_tolerancia: Number(e.target.value),
                        })
                      }
                    />
                  </div>
                )}
                <div className="flex items-center justify-between pt-4 border-t">
                  <div>
                    <p className="font-medium text-sm">
                      Exigir Pagamento Antecipado
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Sessão só ocorre após a compensação
                    </p>
                  </div>
                  <Switch
                    checked={student.exigir_pagamento_antecipado}
                    onCheckedChange={(v) =>
                      updateStudent(student.id, {
                        exigir_pagamento_antecipado: v,
                      })
                    }
                  />
                </div>
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

          <TabsContent
            value="communication"
            className="animate-fade-in space-y-4"
          >
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-sm font-medium">
                      Consentimento (LGPD)
                    </CardTitle>
                    <CardDescription>
                      Autorização para envio de mensagens automáticas.
                      {student.consentUpdatedAt && (
                        <span className="block mt-1">
                          Atualizado em: {formatDate(student.consentUpdatedAt)}
                        </span>
                      )}
                    </CardDescription>
                  </div>
                  <Switch
                    checked={student.whatsappConsent}
                    onCheckedChange={(val) =>
                      updateStudentConsent(student.id, val)
                    }
                  />
                </div>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">
                  Histórico Recente
                </CardTitle>
              </CardHeader>
              <CardContent>
                {studentLogs.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    Nenhuma mensagem registrada.
                  </p>
                ) : (
                  <div className="space-y-4">
                    {studentLogs.map((log) => (
                      <div
                        key={log.id}
                        className="text-sm border-b pb-3 last:border-0 last:pb-0"
                      >
                        <div className="flex justify-between items-start mb-1">
                          <span className="font-medium">
                            {formatDate(log.timestamp)}
                          </span>
                          <Badge
                            variant={
                              log.status === 'failed'
                                ? 'destructive'
                                : 'secondary'
                            }
                            className="text-[10px]"
                          >
                            {log.status === 'read'
                              ? 'Lida'
                              : log.status === 'delivered'
                                ? 'Entregue'
                                : log.status === 'failed'
                                  ? 'Falhou'
                                  : 'Enviada'}
                          </Badge>
                        </div>
                        <p className="text-muted-foreground">{log.content}</p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  )
}
