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
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import { PieChart, Pie, Cell } from 'recharts'
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
  RefreshCw,
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
            {payment?.saldo_restante !== undefined
              ? formatBRL(payment.saldo_restante)
              : formatBRL(payment?.valorPago || 0)}
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
    paymentMethods,
    permutas,
    subscriptions,
    students,
    gatewayConfigs,
    currentUser,
    addPayment,
    updatePayment,
    addPaymentMethod,
    updatePaymentMethod,
    addPermuta,
    addSubscription,
    updateGatewayConfig,
    runDelinquencyCheck,
    simulateWebhook,
  } = useAppStore()
  const { toast } = useToast()

  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500)
    return () => clearTimeout(timer)
  }, [])

  const tenantPayments = useMemo(
    () => payments?.filter((p) => p.tenantId === currentUser?.tenantId) || [],
    [payments, currentUser],
  )
  const tenantMethods = useMemo(
    () =>
      paymentMethods?.filter((m) => m.tenantId === currentUser?.tenantId) || [],
    [paymentMethods, currentUser],
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

  const [methFormOpen, setMethFormOpen] = useState(false)
  const [methData, setMethData] = useState({
    nome: '',
    tipo: 'other',
    online: false,
  })

  const [registerPayOpen, setRegisterPayOpen] = useState(false)
  const [regPayData, setRegPayData] = useState({
    paymentId: '',
    valor_recebido: '',
    forma_pagamento_id: '',
    data_recebimento: new Date().toISOString().slice(0, 10),
    observacoes: '',
  })

  const totalOnline = tenantPayments
    .filter((p) => p.online && (p.status === 'paid' || p.status === 'partial'))
    .reduce((acc, p) => acc + (p.valor_recebido || p.valorPago || 0), 0)
  const totalOffline = tenantPayments
    .filter(
      (p) =>
        !p.online &&
        p.forma_pagamento_id !== 'pm-7' &&
        (p.status === 'paid' || p.status === 'partial'),
    )
    .reduce((acc, p) => acc + (p.valor_recebido || p.valorPago || 0), 0)
  const totalPermuta = permutas
    .filter((p) => p.tenantId === currentUser?.tenantId)
    .reduce((acc, p) => acc + p.valor_equivalente, 0)
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

  const paymentsByMethod = tenantPayments.reduce(
    (acc, p) => {
      if (p.status === 'paid' || p.status === 'partial') {
        const pm = tenantMethods.find((m) => m.id === p.forma_pagamento_id)
        const name = pm ? pm.nome : 'Outros'
        acc[name] = (acc[name] || 0) + (p.valor_recebido || p.valorPago || 0)
      }
      return acc
    },
    {} as Record<string, number>,
  )

  const COLORS = [
    '#10b981',
    '#3b82f6',
    '#f59e0b',
    '#6366f1',
    '#ec4899',
    '#8b5cf6',
    '#14b8a6',
    '#f43f5e',
  ]
  const pieData = Object.entries(paymentsByMethod).map(([name, value], i) => ({
    name,
    value,
    fill: COLORS[i % COLORS.length],
  }))
  const chartConfig = pieData.reduce((acc, item, idx) => {
    acc[`method_${idx}`] = { label: item.name, color: item.fill }
    return acc
  }, {} as any)

  const handleSavePayment = () => {
    try {
      if (!payData.descricao || !payData.valorPago || !payData.alunoId) {
        toast({
          title: 'Aviso',
          description: 'Preencha todos os campos obrigatórios.',
          variant: 'destructive',
        })
        return
      }
      addPayment({
        alunoId: payData.alunoId,
        descricao: payData.descricao,
        valorPago: Number(payData.valorPago),
        saldo_restante: Number(payData.valorPago),
        dataVencimento: payData.dataVencimento,
        status: 'pending',
        recorrente: false,
        gateway: payData.gateway,
        tipo: 'one_off',
      })
      setPayFormOpen(false)
      toast({ title: 'Cobrança gerada com sucesso!' })
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Falha ao processar.',
        variant: 'destructive',
      })
    }
  }

  const handleSaveMethod = () => {
    if (!methData.nome) return
    addPaymentMethod({
      nome: methData.nome,
      tipo: methData.tipo as any,
      online: methData.online,
      gera_taxa: methData.online,
      ativo: true,
    })
    setMethFormOpen(false)
    toast({ title: 'Forma de pagamento adicionada!' })
  }

  const handleSaveManualPayment = () => {
    if (!regPayData.forma_pagamento_id || !regPayData.valor_recebido) return
    const payment = tenantPayments.find((p) => p.id === regPayData.paymentId)
    if (!payment) return

    const pm = tenantMethods.find((m) => m.id === regPayData.forma_pagamento_id)
    const isPermuta = pm?.tipo === 'barter'
    const valueReceived = Number(regPayData.valor_recebido)

    const newTotalReceived = (payment.valor_recebido || 0) + valueReceived
    const newRestante = payment.valorPago - newTotalReceived
    const status = newRestante <= 0 ? 'paid' : 'partial'

    updatePayment(payment.id, {
      valor_recebido: newTotalReceived,
      saldo_restante: newRestante,
      status,
      dataPagamento: regPayData.data_recebimento,
      forma_pagamento_id: pm?.id,
      online: pm?.online,
      observacoes: regPayData.observacoes,
    })

    if (isPermuta && payment.alunoId) {
      addPermuta({
        alunoId: payment.alunoId,
        valor_equivalente: valueReceived,
        descricao: regPayData.observacoes || payment.descricao,
        data: regPayData.data_recebimento,
      })
    }

    setRegisterPayOpen(false)
    toast({ title: 'Recebimento registrado com sucesso!' })
  }

  const handleDelinquencyCheck = () => {
    runDelinquencyCheck(5)
    toast({
      title: 'Varredura Concluída',
      description:
        'Inadimplentes identificados e agenda bloqueada para contratos expirados.',
    })
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return (
          <Badge className="bg-emerald-500 hover:bg-emerald-600">Pago</Badge>
        )
      case 'partial':
        return (
          <Badge variant="outline" className="border-amber-500 text-amber-600">
            Parcial
          </Badge>
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
            Gestão inteligente de recebimentos online, manuais e permutas.
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
          <TabsTrigger value="dashboard">Dashboard Híbrido</TabsTrigger>
          <TabsTrigger value="charges">Cobranças Avulsas</TabsTrigger>
          <TabsTrigger value="subscriptions">Assinaturas</TabsTrigger>
          <TabsTrigger value="methods">Formas de Pagamento</TabsTrigger>
          <TabsTrigger value="config">Gateways</TabsTrigger>
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
                  A inadimplência está alta. Utilize os bloqueios automáticos de
                  agenda para incentivar a regularização.
                </p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center justify-between">
                  Online (Gateway){' '}
                  <Activity className="w-4 h-4 text-blue-500" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatBRL(totalOnline)}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center justify-between">
                  Offline (Manual){' '}
                  <CheckCircle2 className="w-4 h-4 text-slate-500" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatBRL(totalOffline)}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center justify-between">
                  Permutas <RefreshCw className="w-4 h-4 text-purple-500" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatBRL(totalPermuta)}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center justify-between">
                  Inadimplência{' '}
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

          {pieData.length > 0 && (
            <Card className="max-w-md">
              <CardHeader>
                <CardTitle className="text-lg">
                  Distribuição por Forma de Pagamento
                </CardTitle>
              </CardHeader>
              <CardContent className="flex justify-center">
                <ChartContainer
                  config={chartConfig}
                  className="h-[250px] w-full"
                >
                  <PieChart>
                    <Pie
                      data={pieData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <ChartTooltip
                      content={
                        <ChartTooltipContent
                          formatter={(v) => formatBRL(v as number)}
                        />
                      }
                    />
                  </PieChart>
                </ChartContainer>
              </CardContent>
            </Card>
          )}
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
                  <DialogTitle>Criar Nova Cobrança</DialogTitle>
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
                        <SelectValue placeholder="Selecione..." />
                      </SelectTrigger>
                      <SelectContent>
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
                    Gerar Cobrança
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
                    <TableHead>Gateway/Forma</TableHead>
                    <TableHead className="text-right">Valor</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tenantPayments.map((p) => {
                    const stu = tenantStudents.find((s) => s.id === p.alunoId)
                    const pm = tenantMethods.find(
                      (m) => m.id === p.forma_pagamento_id,
                    )
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
                          {pm?.nome || p.gateway || 'Manual'}
                        </TableCell>
                        <TableCell className="text-right font-bold">
                          {formatBRL(p.valorPago)}
                          {p.status === 'partial' && (
                            <div className="text-xs text-amber-600 font-normal">
                              Falta: {formatBRL(p.saldo_restante || 0)}
                            </div>
                          )}
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
                              {(p.status === 'pending' ||
                                p.status === 'partial' ||
                                p.status === 'overdue') && (
                                <DropdownMenuItem
                                  onClick={() => {
                                    setRegPayData({
                                      paymentId: p.id,
                                      valor_recebido: (
                                        p.saldo_restante || p.valorPago
                                      ).toString(),
                                      forma_pagamento_id: '',
                                      data_recebimento: new Date()
                                        .toISOString()
                                        .slice(0, 10),
                                      observacoes: '',
                                    })
                                    setRegisterPayOpen(true)
                                  }}
                                >
                                  <CheckCircle2 className="w-4 h-4 mr-2 text-primary" />{' '}
                                  Registrar Recebimento
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem
                                onClick={() => {
                                  setCheckoutPayment(p)
                                  setCheckoutOpen(true)
                                }}
                              >
                                <LinkIcon className="w-4 h-4 mr-2 text-blue-500" />{' '}
                                Link do Aluno (Checkout)
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                  {tenantPayments.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center h-24">
                        Nenhuma cobrança
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="methods" className="space-y-4">
          <div className="flex justify-end">
            <Dialog open={methFormOpen} onOpenChange={setMethFormOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" /> Nova Forma
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Nova Forma de Pagamento</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label>Nome (Identificação)</Label>
                    <Input
                      value={methData.nome}
                      onChange={(e) =>
                        setMethData((d) => ({ ...d, nome: e.target.value }))
                      }
                      placeholder="Ex: Criptomoeda, Vale..."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Categoria / Tipo</Label>
                    <Select
                      value={methData.tipo}
                      onValueChange={(v) =>
                        setMethData((d) => ({ ...d, tipo: v }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="transfer">Transferência</SelectItem>
                        <SelectItem value="barter">Permuta</SelectItem>
                        <SelectItem value="other">Outros</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center justify-between border-t pt-4">
                    <Label>É Transação Online?</Label>
                    <Switch
                      checked={methData.online}
                      onCheckedChange={(v) =>
                        setMethData((d) => ({ ...d, online: v }))
                      }
                    />
                  </div>
                  <Button className="w-full mt-2" onClick={handleSaveMethod}>
                    Adicionar Forma
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
                    <TableHead>Nome</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Modalidade</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tenantMethods.map((m) => (
                    <TableRow key={m.id}>
                      <TableCell className="font-medium">{m.nome}</TableCell>
                      <TableCell className="capitalize text-muted-foreground">
                        {m.tipo.replace('_', ' ')}
                      </TableCell>
                      <TableCell>
                        {m.online ? (
                          <Badge className="bg-blue-100 text-blue-800 border-transparent">
                            Online
                          </Badge>
                        ) : (
                          <Badge className="bg-slate-100 text-slate-800 border-transparent">
                            Offline
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <Switch
                          checked={m.ativo}
                          onCheckedChange={(v) =>
                            updatePaymentMethod(m.id, { ativo: v })
                          }
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="subscriptions" className="space-y-4">
          <Card>
            <CardContent className="p-0 overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Aluno</TableHead>
                    <TableHead>Frequência</TableHead>
                    <TableHead>Próx. Cobrança</TableHead>
                    <TableHead className="text-right">Valor</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tenantSubscriptions.map((s) => {
                    const stu = tenantStudents.find((st) => st.id === s.alunoId)
                    return (
                      <TableRow key={s.id}>
                        <TableCell className="font-medium">
                          {stu?.nome || '-'}
                        </TableCell>
                        <TableCell className="capitalize">
                          {s.periodicidade}
                        </TableCell>
                        <TableCell>
                          {s.proxima_cobranca
                            ? formatDate(s.proxima_cobranca)
                            : '-'}
                        </TableCell>
                        <TableCell className="text-right font-bold text-primary">
                          {formatBRL(s.valor)}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              s.status === 'active' ? 'default' : 'destructive'
                            }
                          >
                            {s.status === 'active' ? 'Ativa' : 'Falha'}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                  {tenantSubscriptions.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center h-24">
                        Nenhuma assinatura
                      </TableCell>
                    </TableRow>
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

      <Dialog open={registerPayOpen} onOpenChange={setRegisterPayOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Registrar Recebimento Manual</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label>Forma de Pagamento</Label>
              <Select
                value={regPayData.forma_pagamento_id}
                onValueChange={(v) =>
                  setRegPayData((d) => ({ ...d, forma_pagamento_id: v }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
                <SelectContent>
                  {tenantMethods
                    .filter((m) => m.ativo)
                    .map((m) => (
                      <SelectItem key={m.id} value={m.id}>
                        {m.nome}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Valor Recebido (R$)</Label>
              <Input
                type="number"
                value={regPayData.valor_recebido}
                onChange={(e) =>
                  setRegPayData((d) => ({
                    ...d,
                    valor_recebido: e.target.value,
                  }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Data do Recebimento</Label>
              <Input
                type="date"
                value={regPayData.data_recebimento}
                onChange={(e) =>
                  setRegPayData((d) => ({
                    ...d,
                    data_recebimento: e.target.value,
                  }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Observações (Opcional)</Label>
              <Input
                value={regPayData.observacoes}
                onChange={(e) =>
                  setRegPayData((d) => ({ ...d, observacoes: e.target.value }))
                }
                placeholder="Ex: Detalhes da permuta, nº comprovante..."
              />
            </div>
            <Button className="w-full mt-2" onClick={handleSaveManualPayment}>
              Confirmar Recebimento
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={checkoutOpen} onOpenChange={setCheckoutOpen}>
        <DialogContent className="sm:max-w-md p-0 border-0 bg-transparent shadow-none">
          {checkoutPayment && (
            <StudentCheckoutMock
              payment={checkoutPayment}
              onPay={() => {
                try {
                  simulateWebhook(checkoutPayment.id, 'paid')
                  toast({ title: 'Simulação: Pagamento Aprovado via Gateway!' })
                  setCheckoutOpen(false)
                } catch (error) {
                  toast({
                    title: 'Erro',
                    description: 'Falha',
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
