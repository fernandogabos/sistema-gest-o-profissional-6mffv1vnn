import { useMemo } from 'react'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import {
  Activity,
  MessageSquare,
  CheckCheck,
  AlertTriangle,
} from 'lucide-react'
import useAppStore from '@/stores/main'
import { formatDate } from '@/lib/formatters'

export function CommDashboard() {
  const { communicationLogs, communicationTemplates, students, currentUser } =
    useAppStore()

  const tenantLogs = useMemo(
    () => communicationLogs.filter((l) => l.tenantId === currentUser.tenantId),
    [communicationLogs, currentUser.tenantId],
  )

  const stats = useMemo(() => {
    const total = tenantLogs.length
    if (total === 0)
      return { successRate: 0, readRate: 0, total, delivered: 0, failed: 0 }

    const delivered = tenantLogs.filter(
      (l) => l.status === 'delivered' || l.status === 'read',
    ).length
    const read = tenantLogs.filter((l) => l.status === 'read').length
    const failed = tenantLogs.filter((l) => l.status === 'failed').length

    return {
      total,
      delivered,
      failed,
      successRate: Math.round((delivered / total) * 100),
      readRate: delivered > 0 ? Math.round((read / delivered) * 100) : 0,
    }
  }, [tenantLogs])

  const recentLogs = [...tenantLogs]
    .sort((a, b) => b.timestamp.localeCompare(a.timestamp))
    .slice(0, 5)

  const templateUsage = useMemo(() => {
    const usage: Record<string, number> = {}
    tenantLogs.forEach((l) => {
      if (l.templateId) {
        usage[l.templateId] = (usage[l.templateId] || 0) + 1
      }
    })
    return Object.entries(usage)
      .map(([id, count]) => {
        const tpl = communicationTemplates.find((t) => t.id === id)
        return { name: tpl?.name || 'Deletado/Manual', count }
      })
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)
  }, [tenantLogs, communicationTemplates])

  const getStudentName = (id: string) => {
    return students.find((s) => s.id === id)?.nome || 'Desconhecido'
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Taxa de Sucesso
            </CardTitle>
            <CheckCheck className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.successRate}%</div>
            <p className="text-xs text-muted-foreground mt-1">
              Mensagens entregues
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Taxa de Leitura
            </CardTitle>
            <Activity className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.readRate}%</div>
            <p className="text-xs text-muted-foreground mt-1">
              Das mensagens entregues
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Enviado</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Nos últimos 30 dias
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Falhas de Envio
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-rose-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-rose-600">
              {stats.failed}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Falta de consentimento ou config
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Entregas Recentes</CardTitle>
            <CardDescription>
              Últimas mensagens disparadas pelo sistema.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0 overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data</TableHead>
                  <TableHead>Aluno</TableHead>
                  <TableHead>Canal</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentLogs.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="text-center py-4 text-muted-foreground"
                    >
                      Nenhum envio recente.
                    </TableCell>
                  </TableRow>
                ) : (
                  recentLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell>{formatDate(log.timestamp)}</TableCell>
                      <TableCell className="font-medium">
                        {getStudentName(log.targetId)}
                      </TableCell>
                      <TableCell className="capitalize">
                        {log.channel}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            log.status === 'failed'
                              ? 'destructive'
                              : 'secondary'
                          }
                          className={
                            log.status === 'delivered' || log.status === 'read'
                              ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-100'
                              : ''
                          }
                        >
                          {log.status === 'read'
                            ? 'Lida'
                            : log.status === 'delivered'
                              ? 'Entregue'
                              : log.status === 'failed'
                                ? 'Falhou'
                                : 'Enviada'}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Templates Mais Usados</CardTitle>
            <CardDescription>Ranking de automação.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {templateUsage.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center">
                  Sem dados de uso.
                </p>
              ) : (
                templateUsage.map((usage, idx) => (
                  <div key={idx} className="flex items-center justify-between">
                    <span className="text-sm font-medium line-clamp-1 pr-4">
                      {usage.name}
                    </span>
                    <Badge variant="outline">{usage.count} envios</Badge>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
