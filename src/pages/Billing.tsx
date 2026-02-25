import { useState, useMemo, useEffect } from 'react'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useToast } from '@/hooks/use-toast'
import useAppStore from '@/stores/main'
import { formatBRL, formatDate } from '@/lib/formatters'
import {
  Link as LinkIcon,
  AlertTriangle,
  CheckCircle2,
  ShieldCheck,
  MoreVertical,
  Plus,
  CreditCard,
  Activity,
  ShieldAlert,
  Loader2,
} from 'lucide-react'
import { Payment } from '@/stores/mockData'

const StudentCheckoutMock = ({
  payment,
  onPay,
}: {
  payment: Payment
  onPay: () => void
}) => {
  return (
    <div className="bg-background p-6 rounded-lg border shadow-lg max-w-sm mx-auto">
      <div className="text-center mb-6">
        <ShieldCheck className="w-12 h-12 mx-auto text-emerald-500 mb-2" />
        <h3 className="font-bold text-xl">Portal de Pagamento</h3>
        <p className="text-muted-foreground text-sm">
          Ambiente Seguro & Criptografado
        </p>
      </div>
      <div className="space-y-4">
        <div className="flex justify-between border-b pb-2">
          <span className="font-medium text-muted-foreground">Descrição</span>
          <span className="font-medium">{payment?.descricao || '-'}</span>
        </div>
        <div className="flex justify-between border-b pb-2">
          <span className="font-medium text-muted-foreground">
            Valor a Pagar
          </span>
          <span className="font-bold text-xl text-primary">
            {payment?.valorPago ? formatBRL(payment.valorPago) : 'R$ 0,00'}
          </span>
        </div>
        <div className="pt-2 space-y-3">
          <Label>Método de Pagamento</Label>
          <Select defaultValue="cc">
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="cc">Cartão de Crédito</SelectItem>
              <SelectItem value="pix">PIX Instantâneo</SelectItem>
              <SelectItem value="boleto">Boleto Bancário</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button
          className="w-full mt-4 bg-emerald-600 hover:bg-emerald-700 text-white"
          onClick={onPay}
        >
          Confirmar Pagamento
        </Button>
      </div>
    </div>
  )
}

export default function Billing() {
  const {
    payments,
    subscriptions,
    students,
    gatewayConfigs,
    currentUser,
    addPayment,
    addSubscription,
    updateGatewayConfig,
    runDelinquencyCheck,
    simulateWebhook,
  } = useAppStore()
  const { toast } = useToast()

  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simula carregamento para evitar renderização nula e garantir que os dados estejam prontos
    const timer = setTimeout(() => setIsLoading(false), 500)
    return () => clearTimeout(timer)
  }, [])

  const tenantPayments = useMemo(
    () => payments?.filter((p) => p.tenantId === currentUser?.tenantId) || [],
    [payments, currentUser],
  )
  const tenantSubscriptions = useMemo(
    () =>
      subscriptions?.filter((s) => s.tenantId === currentUser?.tenantId) || [],
    [subscriptions, currentUser],
  )
  const tenantStudents = useMemo(
    () => students?.filter((s) => s.tenantId === currentUser?.tenantId) || [],
    [students, currentUser],
  )
  const config = useMemo(
    () =>
      gatewayConfigs?.find((c) => c.tenantId === currentUser?.tenantId) || {
        gateway: 'stripe',
        isActive: false,
        splitMode: 'simple',
        publicKey: '',
      },
    [gatewayConfigs, currentUser],
  )

  const [checkoutOpen, setCheckoutOpen] = useState(false)
  const [checkoutPayment, setCheckoutPayment] = useState<Payment | null>(null)

  const [payFormOpen, setPayFormOpen] = useState(false)
  const [payData, setPayData] = useState({
    alunoId: '',
    descricao: '',
    valorPago: '',
    dataVencimento: new Date().toISOString().slice(0, 10),
    gateway: config.gateway,
  })

  const [subFormOpen, setSubFormOpen] = useState(false)
  const [subData, setSubData] = useState({
    alunoId: '',
    valor: '',
    periodicidade: 'monthly' as any,
  })

  // Dashboard Metrics
  const totalReceived = tenantPayments
    .filter((p) => p.status === 'paid')
    .reduce((acc, p) => acc + (p.valorPago || 0), 0)
  const totalPending = tenantPayments
    .filter((p) => p.status === 'pending')
    .reduce((acc, p) => acc + (p.valorPago || 0), 0)
  const mrr = tenantSubscriptions
    .filter((s) => s.status === 'active')
    .reduce((acc, s) => acc + (s.valor || 0), 0)
  const overdueCount = tenantPayments.filter(
    (p) => p.status === 'overdue',
  ).length
  const totalCount = tenantPayments.length
  const delinquencyRate = totalCount ? (overdueCount / totalCount) * 100 : 0
  const failureCount = tenantPayments.filter(
    (p) => p.status === 'failed',
  ).length
  const failureRate = totalCount ? (failureCount / totalCount) * 100 : 0

  const handleSavePayment = () => {
    try {
      if (!payData.descricao || !payData.valorPago || !payData.alunoId) {
        toast({
          title: 'Aviso',
          description:
            'Preencha todos os campos obrigatórios para gerar a cobrança.',
          variant: 'destructive',
        })
        return
      }

      addPayment({
        alunoId: payData.alunoId,
        descricao: payData.descricao,
        valorPago: Number(payData.valorPago),
        dataVencimento: payData.dataVencimento,
        status: 'pending',
        recorrente: false,
        gateway: payData.gateway,
        tipo: 'one_off',
      })
      setPayFormOpen(false)
      toast({ title: 'Cobrança gerada! Link de pagamento disponível.' })
    } catch (error) {
      toast({
        title: 'Erro no Gateway',
        description:
          'Falha de comunicação ao tentar processar a cobrança. Tente novamente.',
        variant: 'destructive',
      })
    }
  }

  const handleSaveSubscription = () => {
    try {
      if (!subData.valor || !subData.alunoId) {
        toast({
          title: 'Aviso',
          description:
            'Preencha todos os campos obrigatórios para criar a assinatura.',
          variant: 'destructive',
        })
        return
      }

      addSubscription({
        alunoId: subData.alunoId,
        valor: Number(subData.valor),
        periodicidade: subData.periodicidade,
        gateway: config.gateway as any,
        gateway_subscription_id: `sub_${Date.now()}`,
        status: 'active',
        proxima_cobranca: new Date(
          new Date().setMonth(new Date().getMonth() + 1),
        )
          .toISOString()
          .slice(0, 10),
      })
      setSubFormOpen(false)
      toast({ title: 'Assinatura criada com sucesso via Gateway.' })
    } catch (error) {
      toast({
        title: 'Erro no Gateway',
        description:
          'Não foi possível registrar a assinatura recorrente no momento.',
        variant: 'destructive',
      })
    }
  }

  const handleDelinquencyCheck = () => {
    try {
      runDelinquencyCheck(5)
      toast({
        title: 'Varredura Concluída',
        description:
          'Inadimplentes identificados e agendamentos futuros bloqueados.',
      })
    } catch (error) {
      toast({
        title: 'Erro na varredura',
        description: 'Não foi possível completar a análise de inadimplência.',
        variant: 'destructive',
      })
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return (
          <Badge className="bg-emerald-500 hover:bg-emerald-600">Pago</Badge>
        )
      case 'overdue':
        return <Badge variant="destructive">Atrasado</Badge>
      case 'failed':
        return <Badge variant="destructive">Falhou</Badge>
      case 'canceled':
        return <Badge variant="secondary">Cancelado</Badge>
      default:
        return <Badge variant="outline">Pendente</Badge>
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] flex-col gap-4">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="text-muted-foreground animate-pulse">
          Carregando dados financeiros...
        </p>
      </div>
    )
  }

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <CreditCard className="w-8 h-8" /> Cobranças & Assinaturas
          </h1>
          <p className="text-muted-foreground mt-1">
            Gestão inteligente de recebimentos integrados com Stripe, Pagar.me e
            InfinitePay.
          </p>
        </div>
        <Button
          variant="outline"
          onClick={handleDelinquencyCheck}
          className="border-rose-200 text-rose-600 hover:bg-rose-50"
        >
          <ShieldAlert className="w-4 h-4 mr-2" /> Varredura de Inadimplência
        </Button>
      </div>

      <Tabs defaultValue="dashboard" className="w-full">
        <TabsList className="mb-6 flex flex-wrap h-auto justify-start">
          <TabsTrigger value="dashboard">Dashboard Financeiro</TabsTrigger>
          <TabsTrigger value="charges">Cobranças Avulsas</TabsTrigger>
          <TabsTrigger value="subscriptions">
            Assinaturas Recorrentes
          </TabsTrigger>
          <TabsTrigger value="config">Configuração de Gateway</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          {(delinquencyRate > 10 || failureRate > 5) && (
            <div className="bg-rose-50 border border-rose-200 p-4 rounded-md flex items-start gap-3 text-rose-800">
              <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-sm">
                  Alerta de Inteligência Financeira
                </h4>
                <p className="text-sm opacity-90">
                  Sua taxa de inadimplência/falha está alta. A varredura de
                  bloqueio automático é recomendada para forçar a regularização
                  dos alunos.
                </p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center justify-between">
                  MRR (Receita Recorrente){' '}
                  <Activity className="w-4 h-4 text-emerald-500" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatBRL(mrr)}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center justify-between">
                  Receita Recebida{' '}
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatBRL(totalReceived)}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center justify-between">
                  Receita Pendente{' '}
                  <Activity className="w-4 h-4 text-amber-500" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatBRL(totalPending)}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center justify-between">
                  Taxa Inadimplência{' '}
                  <AlertTriangle className="w-4 h-4 text-rose-500" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {delinquencyRate.toFixed(1)}%
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="charges" className="space-y-4">
          <div className="flex justify-end">
            <Dialog open={payFormOpen} onOpenChange={setPayFormOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" /> Nova Cobrança
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Criar Link de Pagamento</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label>Aluno</Label>
                    <Select
                      value={payData.alunoId}
                      onValueChange={(v) =>
                        setPayData((d) => ({ ...d, alunoId: v }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o aluno" />
                      </SelectTrigger>
                      <SelectContent>
                        {tenantStudents.length === 0 && (
                          <SelectItem value="none" disabled>
                            Nenhum aluno cadastrado
                          </SelectItem>
                        )}
                        {tenantStudents.map((s) => (
                          <SelectItem key={s.id} value={s.id}>
                            {s.nome}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Descrição</Label>
                    <Input
                      value={payData.descricao}
                      onChange={(e) =>
                        setPayData((d) => ({ ...d, descricao: e.target.value }))
                      }
                      placeholder="Ex: Avaliação Funcional"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Valor (R$)</Label>
                      <Input
                        type="number"
                        value={payData.valorPago}
                        onChange={(e) =>
                          setPayData((d) => ({
                            ...d,
                            valorPago: e.target.value,
                          }))
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Vencimento</Label>
                      <Input
                        type="date"
                        value={payData.dataVencimento}
                        onChange={(e) =>
                          setPayData((d) => ({
                            ...d,
                            dataVencimento: e.target.value,
                          }))
                        }
                      />
                    </div>
                  </div>
                  <Button className="w-full mt-2" onClick={handleSavePayment}>
                    Gerar Cobrança (API)
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <Card>
            <CardContent className="p-0 overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Vencimento</TableHead>
                    <TableHead>Descrição</TableHead>
                    <TableHead>Aluno</TableHead>
                    <TableHead>Gateway</TableHead>
                    <TableHead className="text-right">Valor</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tenantPayments.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={7}
                        className="h-24 text-center text-muted-foreground"
                      >
                        Nenhuma cobrança registrada.
                      </TableCell>
                    </TableRow>
                  ) : (
                    tenantPayments.map((p) => {
                      const stu = tenantStudents.find((s) => s.id === p.alunoId)
                      return (
                        <TableRow key={p.id}>
                          <TableCell>
                            {p.dataVencimento
                              ? formatDate(p.dataVencimento)
                              : '-'}
                          </TableCell>
                          <TableCell className="font-medium">
                            {p.descricao || '-'}
                          </TableCell>
                          <TableCell>{stu?.nome || '-'}</TableCell>
                          <TableCell className="capitalize text-muted-foreground">
                            {p.gateway || 'Manual'}
                          </TableCell>
                          <TableCell className="text-right font-bold">
                            {p.valorPago != null ? formatBRL(p.valorPago) : '-'}
                          </TableCell>
                          <TableCell>{getStatusBadge(p.status)}</TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreVertical className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  onClick={() => {
                                    setCheckoutPayment(p)
                                    setCheckoutOpen(true)
                                  }}
                                >
                                  <LinkIcon className="w-4 h-4 mr-2 text-primary" />{' '}
                                  Link do Aluno (Checkout)
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => {
                                    try {
                                      simulateWebhook(p.id, 'paid')
                                      toast({
                                        title: 'Sucesso',
                                        description:
                                          'Cobrança marcada como aprovada.',
                                      })
                                    } catch (e) {
                                      toast({
                                        title: 'Erro',
                                        description:
                                          'Não foi possível atualizar o status.',
                                        variant: 'destructive',
                                      })
                                    }
                                  }}
                                >
                                  <CheckCircle2 className="w-4 h-4 mr-2 text-emerald-500" />{' '}
                                  Webhook: Aprovado
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => {
                                    try {
                                      simulateWebhook(p.id, 'failed')
                                      toast({
                                        title: 'Aviso',
                                        description:
                                          'Cobrança marcada como recusada.',
                                      })
                                    } catch (e) {
                                      toast({
                                        title: 'Erro',
                                        description:
                                          'Não foi possível atualizar o status.',
                                        variant: 'destructive',
                                      })
                                    }
                                  }}
                                >
                                  <AlertTriangle className="w-4 h-4 mr-2 text-rose-500" />{' '}
                                  Webhook: Recusado
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      )
                    })
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="subscriptions" className="space-y-4">
          <div className="flex justify-end">
            <Dialog open={subFormOpen} onOpenChange={setSubFormOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" /> Nova Assinatura
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Criar Assinatura Recorrente</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label>Aluno</Label>
                    <Select
                      value={subData.alunoId}
                      onValueChange={(v) =>
                        setSubData((d) => ({ ...d, alunoId: v }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o aluno" />
                      </SelectTrigger>
                      <SelectContent>
                        {tenantStudents.length === 0 && (
                          <SelectItem value="none" disabled>
                            Nenhum aluno cadastrado
                          </SelectItem>
                        )}
                        {tenantStudents.map((s) => (
                          <SelectItem key={s.id} value={s.id}>
                            {s.nome}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Valor Recorrente (R$)</Label>
                      <Input
                        type="number"
                        value={subData.valor}
                        onChange={(e) =>
                          setSubData((d) => ({ ...d, valor: e.target.value }))
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Periodicidade</Label>
                      <Select
                        value={subData.periodicidade}
                        onValueChange={(v) =>
                          setSubData((d) => ({ ...d, periodicidade: v }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="weekly">Semanal</SelectItem>
                          <SelectItem value="biweekly">Quinzenal</SelectItem>
                          <SelectItem value="monthly">Mensal</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <Button
                    className="w-full mt-2"
                    onClick={handleSaveSubscription}
                  >
                    Ativar Assinatura no Gateway
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <Card>
            <CardContent className="p-0 overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Aluno</TableHead>
                    <TableHead>Plano / Frequência</TableHead>
                    <TableHead>Próx. Cobrança</TableHead>
                    <TableHead>Gateway ID</TableHead>
                    <TableHead className="text-right">Valor</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tenantSubscriptions.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        className="h-24 text-center text-muted-foreground"
                      >
                        Nenhuma assinatura recorrente encontrada.
                      </TableCell>
                    </TableRow>
                  ) : (
                    tenantSubscriptions.map((s) => {
                      const stu = tenantStudents.find(
                        (st) => st.id === s.alunoId,
                      )
                      return (
                        <TableRow key={s.id}>
                          <TableCell className="font-medium">
                            {stu?.nome || '-'}
                          </TableCell>
                          <TableCell className="capitalize">
                            {s.periodicidade || '-'}
                          </TableCell>
                          <TableCell>
                            {s.proxima_cobranca
                              ? formatDate(s.proxima_cobranca)
                              : '-'}
                          </TableCell>
                          <TableCell className="text-xs text-muted-foreground font-mono">
                            {s.gateway_subscription_id || '-'}
                          </TableCell>
                          <TableCell className="text-right font-bold text-primary">
                            {s.valor != null ? formatBRL(s.valor) : '-'}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                s.status === 'active'
                                  ? 'default'
                                  : 'destructive'
                              }
                            >
                              {s.status === 'active' ? 'Ativa' : 'Falha'}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      )
                    })
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="config" className="space-y-6 max-w-2xl">
          <Card>
            <CardHeader>
              <CardTitle>Integração de Pagamentos</CardTitle>
              <CardDescription>
                Conecte sua conta do gateway para processamento automático via
                Tokenização (LGPD).
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Provedor de Pagamento</Label>
                <Select
                  value={config.gateway}
                  onValueChange={(v) =>
                    updateGatewayConfig({ gateway: v as any })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="stripe">Stripe</SelectItem>
                    <SelectItem value="pagarme">Pagar.me</SelectItem>
                    <SelectItem value="infinitepay">InfinitePay</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Public Key (Token)</Label>
                <Input
                  type="password"
                  value={config.publicKey || ''}
                  onChange={(e) =>
                    updateGatewayConfig({ publicKey: e.target.value })
                  }
                  placeholder="pk_live_..."
                />
              </div>

              <div className="space-y-4 mt-6 p-4 border rounded-md bg-muted/10">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <Activity className="w-5 h-5 text-primary" /> Configuração de
                  Split (Repasse)
                </h3>
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="font-medium">Modo Split Automático</p>
                    <p className="text-sm text-muted-foreground">
                      Retém a taxa da plataforma diretamente no gateway,
                      enviando o líquido para sua conta.
                    </p>
                  </div>
                  <Switch
                    checked={config.splitMode === 'split'}
                    onCheckedChange={(v) =>
                      updateGatewayConfig({ splitMode: v ? 'split' : 'simple' })
                    }
                  />
                </div>
              </div>

              <Button
                className="w-full"
                onClick={() => toast({ title: 'Configurações Salvas' })}
              >
                Salvar Chaves Seguras
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={checkoutOpen} onOpenChange={setCheckoutOpen}>
        <DialogContent className="sm:max-w-md p-0 border-0 bg-transparent shadow-none">
          {checkoutPayment && (
            <StudentCheckoutMock
              payment={checkoutPayment}
              onPay={() => {
                try {
                  simulateWebhook(checkoutPayment.id, 'paid')
                  toast({ title: 'Simulação: Pagamento Aprovado!' })
                  setCheckoutOpen(false)
                } catch (error) {
                  toast({
                    title: 'Erro',
                    description: 'Não foi possível aprovar o pagamento',
                    variant: 'destructive',
                  })
                }
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
