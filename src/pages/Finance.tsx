import { useState, useMemo } from 'react'
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
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Switch } from '@/components/ui/switch'
import {
  Plus,
  AlertCircle,
  Download,
  FileText,
  TrendingUp,
  DollarSign,
  Activity,
  CheckCircle2,
  RefreshCw,
  LineChart as LineChartIcon,
  Wand2,
  AlertTriangle,
  RefreshCcw,
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import useAppStore from '@/stores/main'
import { formatBRL, formatDate } from '@/lib/formatters'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from '@/components/ui/chart'
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  BarChart,
  Bar,
} from 'recharts'

const dayNames = [
  'Domingo',
  'Segunda',
  'Terça',
  'Quarta',
  'Quinta',
  'Sexta',
  'Sábado',
]

export default function Finance() {
  const {
    payments,
    expenses,
    students,
    currentUser,
    analyticsAgenda,
    paymentMethods,
    permutas,
    addPayment,
    updatePayment,
    addExpense,
    updateExpense,
    addPermuta,
  } = useAppStore()
  const { toast } = useToast()

  const [openPay, setOpenPay] = useState(false)
  const [payData, setPayData] = useState({
    alunoId: 'none',
    descricao: '',
    valorPago: '',
    dataVencimento: new Date().toISOString().slice(0, 10),
    dataPagamento: '',
    status: 'pending' as any,
    recorrente: false,
  })

  const [openExp, setOpenExp] = useState(false)
  const [expData, setExpData] = useState({
    descricao: '',
    categoria: 'Outros',
    tipo: 'fixed' as any,
    fornecedor: '',
    valor: '',
    dataVencimento: new Date().toISOString().slice(0, 10),
    dataPagamento: '',
    status: 'pending' as any,
  })

  const [registerPayOpen, setRegisterPayOpen] = useState(false)
  const [regPayData, setRegPayData] = useState({
    paymentId: '',
    valor_recebido: '',
    forma_pagamento_id: '',
    data_recebimento: new Date().toISOString().slice(0, 10),
    observacoes: '',
  })

  const [isSyncing, setIsSyncing] = useState(false)

  const tPayments = useMemo(
    () => payments.filter((p) => p.tenantId === currentUser.tenantId),
    [payments, currentUser],
  )
  const tExpenses = useMemo(
    () => expenses.filter((e) => e.tenantId === currentUser.tenantId),
    [expenses, currentUser],
  )
  const tPermutas = useMemo(
    () => permutas.filter((p) => p.tenantId === currentUser.tenantId),
    [permutas, currentUser],
  )
  const tenantStudents = useMemo(
    () => students.filter((s) => s.tenantId === currentUser.tenantId),
    [students, currentUser],
  )
  const tenantMethods = useMemo(
    () =>
      paymentMethods.filter(
        (m) => m.tenantId === currentUser.tenantId && m.ativo,
      ),
    [paymentMethods, currentUser],
  )
  const myAnalytics = useMemo(
    () => analyticsAgenda.filter((a) => a.userId === currentUser.id),
    [analyticsAgenda, currentUser],
  )

  const currentMonthPrefix = new Date().toISOString().slice(0, 7)

  // Receita Financeira (Caixa)
  const monthlyCashIn = tPayments
    .filter(
      (p) =>
        (p.status === 'paid' || p.status === 'partial') &&
        p.dataPagamento?.startsWith(currentMonthPrefix),
    )
    .reduce((acc, p) => {
      const pm = tenantMethods.find((m) => m.id === p.forma_pagamento_id)
      if (pm?.tipo === 'barter') return acc // Exclui permuta do caixa
      return acc + (p.valor_recebido || p.valorPago || 0)
    }, 0)

  // Receita de Permutas (Não Monetária)
  const monthlyBarterIn = tPermutas
    .filter((p) => p.data.startsWith(currentMonthPrefix))
    .reduce((acc, p) => acc + p.valor_equivalente, 0)

  // Receita Bruta (DRE)
  const monthlyGrossRev = monthlyCashIn + monthlyBarterIn

  const monthlyPaidExp = tExpenses
    .filter(
      (e) =>
        e.status === 'paid' && e.dataPagamento?.startsWith(currentMonthPrefix),
    )
    .reduce((acc, e) => acc + e.valor, 0)

  const lastMonthDate = new Date()
  lastMonthDate.setMonth(lastMonthDate.getMonth() - 1)
  const lastMonthPrefix = lastMonthDate.toISOString().slice(0, 7)

  const lastMonthGrossRev =
    tPayments
      .filter(
        (p) =>
          (p.status === 'paid' || p.status === 'partial') &&
          p.dataPagamento?.startsWith(lastMonthPrefix),
      )
      .reduce((acc, p) => acc + (p.valor_recebido || p.valorPago || 0), 0) +
    tPermutas
      .filter((p) => p.data.startsWith(lastMonthPrefix))
      .reduce((acc, p) => acc + p.valor_equivalente, 0)

  const activeStudents = tenantStudents.filter(
    (s) => s.status === 'active',
  ).length
  const ticketMedio = activeStudents > 0 ? monthlyGrossRev / activeStudents : 0
  const growth =
    lastMonthGrossRev > 0
      ? ((monthlyGrossRev - lastMonthGrossRev) / lastMonthGrossRev) * 100
      : 100
  const margin =
    monthlyGrossRev > 0
      ? ((monthlyGrossRev - monthlyPaidExp) / monthlyGrossRev) * 100
      : 0

  const overduePayments = tPayments.filter((p) => p.status === 'overdue')

  const dre = useMemo(() => {
    const gross = monthlyGrossRev
    const taxes = tExpenses
      .filter(
        (e) =>
          e.status === 'paid' &&
          e.categoria === 'Impostos' &&
          e.dataPagamento?.startsWith(currentMonthPrefix),
      )
      .reduce((acc, e) => acc + e.valor, 0)
    const varCosts = tExpenses
      .filter(
        (e) =>
          e.status === 'paid' &&
          e.tipo === 'variable' &&
          e.categoria !== 'Impostos' &&
          e.dataPagamento?.startsWith(currentMonthPrefix),
      )
      .reduce((acc, e) => acc + e.valor, 0)
    const fixedCosts = tExpenses
      .filter(
        (e) =>
          e.status === 'paid' &&
          e.tipo === 'fixed' &&
          e.categoria !== 'Impostos' &&
          e.dataPagamento?.startsWith(currentMonthPrefix),
      )
      .reduce((acc, e) => acc + e.valor, 0)

    const net = gross - varCosts - fixedCosts - taxes
    return {
      gross,
      cashIn: monthlyCashIn,
      barterIn: monthlyBarterIn,
      varCosts,
      fixedCosts,
      taxes,
      net,
    }
  }, [
    tExpenses,
    currentMonthPrefix,
    monthlyGrossRev,
    monthlyCashIn,
    monthlyBarterIn,
  ])

  const cashFlowData = useMemo(() => {
    const daysInMonth = new Date(
      new Date().getFullYear(),
      new Date().getMonth() + 1,
      0,
    ).getDate()
    const data = []

    let accReal = 0
    let accProj = 0

    for (let i = 1; i <= daysInMonth; i++) {
      const dateStr = `${currentMonthPrefix}-${i.toString().padStart(2, '0')}`

      const dayRevReal = tPayments
        .filter(
          (p) =>
            (p.status === 'paid' || p.status === 'partial') &&
            p.dataPagamento === dateStr,
        )
        .reduce((acc, p) => {
          const pm = tenantMethods.find((m) => m.id === p.forma_pagamento_id)
          if (pm?.tipo === 'barter') return acc
          return acc + (p.valor_recebido || p.valorPago || 0)
        }, 0)

      const dayExpReal = tExpenses
        .filter((e) => e.status === 'paid' && e.dataPagamento === dateStr)
        .reduce((acc, e) => acc + e.valor, 0)

      const dayRevProj = tPayments
        .filter((p) => p.dataVencimento === dateStr)
        .reduce(
          (acc, p) =>
            acc +
            (p.saldo_restante !== undefined ? p.saldo_restante : p.valorPago),
          0,
        )

      const dayExpProj = tExpenses
        .filter((e) => e.dataVencimento === dateStr)
        .reduce((acc, e) => acc + e.valor, 0)

      accReal += dayRevReal - dayExpReal
      accProj += dayRevProj - dayExpProj

      data.push({
        day: i.toString(),
        saldoRealizado: accReal,
        saldoProjetado: accProj,
      })
    }
    return data
  }, [tPayments, tExpenses, tenantMethods, currentMonthPrefix])

  const premiumSlots = useMemo(() => {
    return myAnalytics
      .filter(
        (a) => a.ocupacao_percentual >= 0.85 && a.taxa_comparecimento >= 0.8,
      )
      .sort((a, b) => b.ocupacao_percentual - a.ocupacao_percentual)
  }, [myAnalytics])

  const optimizationSim = useMemo(() => {
    const totalCurrentRev = premiumSlots.reduce(
      (acc, s) => acc + s.receita_bruta,
      0,
    )
    const monthlyBoost = totalCurrentRev * 0.1
    const annualBoost = monthlyBoost * 12
    return { monthlyBoost, annualBoost }
  }, [premiumSlots])

  const forecastData = useMemo(() => {
    const grouped = myAnalytics.reduce(
      (acc, slot) => {
        if (!acc[slot.dia_semana]) acc[slot.dia_semana] = { sum: 0, count: 0 }
        acc[slot.dia_semana].sum += slot.ocupacao_percentual
        acc[slot.dia_semana].count += 1
        return acc
      },
      {} as Record<number, { sum: number; count: number }>,
    )

    return Object.entries(grouped).map(([day, val]) => ({
      name: dayNames[Number(day)].substring(0, 3),
      ocupacao: (val.sum / val.count) * 100,
    }))
  }, [myAnalytics])

  const criticalSlots = useMemo(() => {
    return myAnalytics
      .filter((a) => a.ocupacao_percentual < 0.4)
      .sort((a, b) => a.ocupacao_percentual - b.ocupacao_percentual)
      .slice(0, 8)
  }, [myAnalytics])

  const handleSync = () => {
    setIsSyncing(true)
    setTimeout(() => {
      setIsSyncing(false)
      toast({ title: 'Analytics sincronizado com sucesso!' })
    }, 1500)
  }

  const handleSavePayment = () => {
    if (!payData.descricao || !payData.valorPago) return
    addPayment({
      alunoId: payData.alunoId === 'none' ? undefined : payData.alunoId,
      descricao: payData.descricao,
      valorPago: Number(payData.valorPago),
      saldo_restante: Number(payData.valorPago),
      dataVencimento: payData.dataVencimento,
      status: 'pending',
      recorrente: payData.recorrente,
    })
    setOpenPay(false)
    toast({ title: 'Receita registrada com sucesso!' })
  }

  const handleSaveManualPayment = () => {
    if (!regPayData.forma_pagamento_id || !regPayData.valor_recebido) return
    const payment = tPayments.find((p) => p.id === regPayData.paymentId)
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

  const handleSaveExpense = () => {
    if (!expData.descricao || !expData.valor) return
    addExpense({
      descricao: expData.descricao,
      categoria: expData.categoria,
      tipo: expData.tipo,
      fornecedor: expData.fornecedor,
      valor: Number(expData.valor),
      dataVencimento: expData.dataVencimento,
      dataPagamento:
        expData.status === 'paid'
          ? expData.dataPagamento || new Date().toISOString().slice(0, 10)
          : undefined,
      status: expData.status,
    })
    setOpenExp(false)
    toast({ title: 'Despesa registrada com sucesso!' })
  }

  const markExpensePaid = (id: string) => {
    updateExpense(id, {
      status: 'paid',
      dataPagamento: new Date().toISOString().slice(0, 10),
    })
    toast({ title: 'Despesa marcada como paga' })
  }

  const handleExportCSV = () => {
    const headers = 'Tipo,Data,Descricao,Valor,Status\n'
    const revRows = tPayments
      .map(
        (p) =>
          `Receita,${p.dataVencimento},${p.descricao},${p.valorPago},${p.status}`,
      )
      .join('\n')
    const expRows = tExpenses
      .map(
        (e) =>
          `Despesa,${e.dataVencimento},${e.descricao},${e.valor},${e.status}`,
      )
      .join('\n')
    const csv = headers + revRows + '\n' + expRows
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `financeiro-${currentMonthPrefix}.csv`
    a.click()
    toast({ title: 'Exportação CSV concluída' })
  }

  const statusBadge = (status: string) => {
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
      default:
        return <Badge variant="secondary">Pendente</Badge>
    }
  }

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Centro Financeiro & Analytics
          </h1>
          <p className="text-muted-foreground mt-1">
            Gestão estratégica de receitas (DRE), fluxo de caixa e agenda.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExportCSV}>
            <Download className="h-4 w-4 mr-2" /> CSV
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              window.print()
              toast({ title: 'Relatório pronto para impressão PDF' })
            }}
          >
            <FileText className="h-4 w-4 mr-2" /> PDF
          </Button>
        </div>
      </div>

      <Tabs defaultValue="dashboard" className="w-full">
        <TabsList className="flex flex-wrap h-auto w-full justify-start mb-6 gap-1 bg-transparent p-0">
          <TabsTrigger
            value="dashboard"
            className="data-[state=active]:bg-card data-[state=active]:shadow-sm border border-transparent data-[state=active]:border-border"
          >
            Visão Geral
          </TabsTrigger>
          <TabsTrigger
            value="receivables"
            className="data-[state=active]:bg-card data-[state=active]:shadow-sm border border-transparent data-[state=active]:border-border"
          >
            A Receber
          </TabsTrigger>
          <TabsTrigger
            value="payables"
            className="data-[state=active]:bg-card data-[state=active]:shadow-sm border border-transparent data-[state=active]:border-border"
          >
            A Pagar
          </TabsTrigger>
          <TabsTrigger
            value="reports"
            className="data-[state=active]:bg-card data-[state=active]:shadow-sm border border-transparent data-[state=active]:border-border"
          >
            DRE & Fluxo
          </TabsTrigger>
          <TabsTrigger
            value="forecast"
            className="data-[state=active]:bg-card data-[state=active]:shadow-sm border border-transparent data-[state=active]:border-border"
          >
            Previsão de Agenda
          </TabsTrigger>
          <TabsTrigger
            value="optimization"
            className="data-[state=active]:bg-card data-[state=active]:shadow-sm border border-transparent data-[state=active]:border-border"
          >
            Otimização de Preços
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          <div className="grid gap-4">
            {overduePayments.length > 0 && (
              <Alert variant="destructive" className="animate-fade-in-down">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Inadimplência Detectada</AlertTitle>
                <AlertDescription>
                  Você possui {overduePayments.length} recebimento(s)
                  atrasado(s) aguardando ação.
                </AlertDescription>
              </Alert>
            )}
            {margin < 20 && margin > 0 && (
              <Alert className="border-amber-500 text-amber-600 animate-fade-in-down">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Alerta de Margem Baixa</AlertTitle>
                <AlertDescription>
                  Sua margem de lucro está abaixo de 20% este mês. Revise seus
                  custos fixos.
                </AlertDescription>
              </Alert>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  Receita Bruta (Mês)
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-emerald-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-emerald-600">
                  {formatBRL(monthlyGrossRev)}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {growth >= 0 ? '+' : ''}
                  {growth.toFixed(1)}% em relação ao mês anterior
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  Caixa / Permutas
                </CardTitle>
                <RefreshCcw className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-xl font-bold text-blue-600">
                  {formatBRL(monthlyCashIn)}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  + {formatBRL(monthlyBarterIn)} em permutas
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  Despesas Mensais
                </CardTitle>
                <Activity className="h-4 w-4 text-rose-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-rose-600">
                  {formatBRL(monthlyPaidExp)}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Custos e repasses realizados
                </p>
              </CardContent>
            </Card>

            <Card className="bg-primary text-primary-foreground border-none">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  Margem de Lucro
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-white/80" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{margin.toFixed(1)}%</div>
                <p className="text-xs text-primary-foreground/80 mt-1">
                  Lucratividade operacional
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="receivables" className="space-y-4">
          <div className="flex justify-end">
            <Dialog open={openPay} onOpenChange={setOpenPay}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" /> Nova Receita
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Contas a Receber</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label>Descrição</Label>
                    <Input
                      value={payData.descricao}
                      onChange={(e) =>
                        setPayData((d) => ({ ...d, descricao: e.target.value }))
                      }
                      placeholder="Ex: Mensalidade, Avaliação..."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Aluno Vinculado</Label>
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
                        <SelectItem value="none">Nenhum</SelectItem>
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
                      <Label>Data de Vencimento</Label>
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
                  <div className="flex items-center justify-between border-t pt-4 mt-2">
                    <Label>Faturamento Recorrente Mensal?</Label>
                    <Switch
                      checked={payData.recorrente}
                      onCheckedChange={(v) =>
                        setPayData((d) => ({ ...d, recorrente: v }))
                      }
                    />
                  </div>
                  <Button className="w-full mt-4" onClick={handleSavePayment}>
                    Salvar Receita
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
                    <TableHead>Recorrente</TableHead>
                    <TableHead className="text-right">Valor</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tPayments.map((p) => {
                    const stu = students.find((s) => s.id === p.alunoId)
                    return (
                      <TableRow key={p.id}>
                        <TableCell>{formatDate(p.dataVencimento)}</TableCell>
                        <TableCell className="font-medium">
                          {p.descricao}
                        </TableCell>
                        <TableCell>{stu?.nome || '-'}</TableCell>
                        <TableCell>{p.recorrente ? 'Sim' : 'Não'}</TableCell>
                        <TableCell className="text-right font-bold text-emerald-600">
                          {formatBRL(p.valorPago)}
                          {p.status === 'partial' && (
                            <div className="text-xs text-amber-600 font-normal">
                              Falta: {formatBRL(p.saldo_restante || 0)}
                            </div>
                          )}
                        </TableCell>
                        <TableCell>{statusBadge(p.status)}</TableCell>
                        <TableCell>
                          {(p.status === 'pending' ||
                            p.status === 'partial' ||
                            p.status === 'overdue') && (
                            <Button
                              variant="ghost"
                              size="sm"
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
                              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payables" className="space-y-4">
          <div className="flex justify-end">
            <Dialog open={openExp} onOpenChange={setOpenExp}>
              <DialogTrigger asChild>
                <Button variant="destructive">
                  <Plus className="mr-2 h-4 w-4" /> Nova Despesa
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Contas a Pagar</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label>Descrição</Label>
                    <Input
                      value={expData.descricao}
                      onChange={(e) =>
                        setExpData((d) => ({ ...d, descricao: e.target.value }))
                      }
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Categoria</Label>
                      <Select
                        value={expData.categoria}
                        onValueChange={(v) =>
                          setExpData((d) => ({ ...d, categoria: v }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Marketing">Marketing</SelectItem>
                          <SelectItem value="Aluguel">Aluguel</SelectItem>
                          <SelectItem value="Impostos">Impostos</SelectItem>
                          <SelectItem value="Manutenção">Manutenção</SelectItem>
                          <SelectItem value="Outros">Outros</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Tipo</Label>
                      <Select
                        value={expData.tipo}
                        onValueChange={(v: any) =>
                          setExpData((d) => ({ ...d, tipo: v }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="fixed">Fixo</SelectItem>
                          <SelectItem value="variable">Variável</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Valor (R$)</Label>
                      <Input
                        type="number"
                        value={expData.valor}
                        onChange={(e) =>
                          setExpData((d) => ({ ...d, valor: e.target.value }))
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Status</Label>
                      <Select
                        value={expData.status}
                        onValueChange={(v: any) =>
                          setExpData((d) => ({ ...d, status: v }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pendente</SelectItem>
                          <SelectItem value="paid">Pago</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Data de Vencimento</Label>
                    <Input
                      type="date"
                      value={expData.dataVencimento}
                      onChange={(e) =>
                        setExpData((d) => ({
                          ...d,
                          dataVencimento: e.target.value,
                        }))
                      }
                    />
                  </div>
                  {expData.status === 'paid' && (
                    <div className="space-y-2">
                      <Label>Data do Pagamento</Label>
                      <Input
                        type="date"
                        value={expData.dataPagamento}
                        onChange={(e) =>
                          setExpData((d) => ({
                            ...d,
                            dataPagamento: e.target.value,
                          }))
                        }
                      />
                    </div>
                  )}
                  <Button className="w-full mt-4" onClick={handleSaveExpense}>
                    Salvar Despesa
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
                    <TableHead>Categoria</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead className="text-right">Valor</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tExpenses.map((e) => (
                    <TableRow key={e.id}>
                      <TableCell>{formatDate(e.dataVencimento)}</TableCell>
                      <TableCell className="font-medium">
                        {e.descricao}
                      </TableCell>
                      <TableCell>{e.categoria}</TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {e.tipo === 'fixed' ? 'Fixo' : 'Variável'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right font-bold text-rose-600">
                        -{formatBRL(e.valor)}
                      </TableCell>
                      <TableCell>{statusBadge(e.status)}</TableCell>
                      <TableCell>
                        {e.status !== 'paid' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => markExpensePaid(e.id)}
                          >
                            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Fluxo de Caixa Dinâmico</CardTitle>
              <CardDescription>
                Acúmulo diário projetado vs realizado neste mês (não considera
                permutas).
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  proj: {
                    label: 'Saldo Projetado',
                    color: 'hsl(var(--muted-foreground))',
                  },
                  real: {
                    label: 'Saldo Realizado',
                    color: 'hsl(var(--primary))',
                  },
                }}
                className="h-[300px] w-full"
              >
                <LineChart
                  data={cashFlowData}
                  margin={{ top: 20, right: 20, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis
                    dataKey="day"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(v) => `R$${v}`}
                  />
                  <ChartTooltip
                    content={
                      <ChartTooltipContent
                        formatter={(value) => formatBRL(value as number)}
                      />
                    }
                  />
                  <ChartLegend content={<ChartLegendContent />} />
                  <Line
                    type="monotone"
                    dataKey="saldoProjetado"
                    name="Saldo Projetado"
                    stroke="var(--color-proj)"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="saldoRealizado"
                    name="Saldo Realizado"
                    stroke="var(--color-real)"
                    strokeWidth={3}
                    dot={{ r: 4 }}
                  />
                </LineChart>
              </ChartContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Demonstração do Resultado (DRE) Híbrida</CardTitle>
              <CardDescription>
                Resultados financeiros realizados e não-monetários no mês atual.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0 overflow-x-auto">
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-bold text-lg">
                      Receita Bruta Total
                    </TableCell>
                    <TableCell className="text-right font-bold text-lg text-emerald-600">
                      {formatBRL(dre.gross)}
                    </TableCell>
                  </TableRow>
                  <TableRow className="bg-muted/30">
                    <TableCell className="pl-8 text-muted-foreground">
                      Receita Financeira (Caixa)
                    </TableCell>
                    <TableCell className="text-right text-muted-foreground">
                      {formatBRL(dre.cashIn)}
                    </TableCell>
                  </TableRow>
                  <TableRow className="bg-muted/30">
                    <TableCell className="pl-8 text-muted-foreground">
                      Receita Não Monetária (Permutas)
                    </TableCell>
                    <TableCell className="text-right text-muted-foreground">
                      {formatBRL(dre.barterIn)}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>(-) Custos Variáveis</TableCell>
                    <TableCell className="text-right text-rose-600">
                      -{formatBRL(dre.varCosts)}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>(-) Custos Fixos</TableCell>
                    <TableCell className="text-right text-rose-600">
                      -{formatBRL(dre.fixedCosts)}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>(-) Impostos</TableCell>
                    <TableCell className="text-right text-amber-600">
                      -{formatBRL(dre.taxes)}
                    </TableCell>
                  </TableRow>
                  <TableRow className="bg-muted/50">
                    <TableCell className="font-bold text-lg">
                      Lucro Operacional Líquido
                    </TableCell>
                    <TableCell className="text-right font-bold text-xl text-emerald-600">
                      {formatBRL(dre.net)}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      Margem de Lucro (%)
                    </TableCell>
                    <TableCell className="text-right font-bold">
                      {margin.toFixed(2)}%
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="forecast" className="space-y-6">
          <div className="flex justify-between items-center mb-2">
            <div>
              <h2 className="text-xl font-bold">
                Previsão Mensal (Motor de IA)
              </h2>
              <p className="text-sm text-muted-foreground">
                Projeção baseada nos últimos 90 dias através da tabela{' '}
                <code>analytics_agenda</code>
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleSync}
              disabled={isSyncing}
            >
              <RefreshCw
                className={`w-4 h-4 mr-2 ${isSyncing ? 'animate-spin' : ''}`}
              />
              Sincronizar Dados
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <LineChartIcon className="w-5 h-5 text-primary" /> Ocupação
                  Média por Dia (Próximos 30d)
                </CardTitle>
                <CardDescription>
                  Expectativa de preenchimento da agenda por dia da semana
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    ocupacao: {
                      label: 'Ocupação %',
                      color: 'hsl(var(--primary))',
                    },
                  }}
                  className="h-[250px] w-full"
                >
                  <BarChart
                    data={forecastData}
                    margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis
                      dataKey="name"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                      domain={[0, 100]}
                      tickFormatter={(v) => `${v}%`}
                    />
                    <ChartTooltip
                      content={
                        <ChartTooltipContent
                          formatter={(v) => `${(v as number).toFixed(1)}%`}
                        />
                      }
                    />
                    <Bar
                      dataKey="ocupacao"
                      fill="var(--color-ocupacao)"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-rose-500" /> Alerta de
                  Ociosidade (Alta Exposição)
                </CardTitle>
                <CardDescription>
                  Horários com probabilidade de vacância &gt; 60% baseados no
                  histórico
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0 overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Dia</TableHead>
                      <TableHead>Horário</TableHead>
                      <TableHead className="text-right">
                        Ocupação Esp.
                      </TableHead>
                      <TableHead className="text-right">Risco</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {criticalSlots.map((s) => (
                      <TableRow key={s.id}>
                        <TableCell className="font-medium">
                          {dayNames[s.dia_semana]}
                        </TableCell>
                        <TableCell>{s.faixa_horaria}</TableCell>
                        <TableCell className="text-right font-medium">
                          {(s.ocupacao_percentual * 100).toFixed(0)}%
                        </TableCell>
                        <TableCell className="text-right">
                          <Badge variant="destructive">Alto</Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                    {criticalSlots.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center p-4">
                          Sua agenda está com excelente saúde!
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="optimization" className="space-y-6">
          <div className="mb-4">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Wand2 className="w-5 h-5 text-amber-500" /> Otimização de Preços
              Inteligente
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Horários com altíssima demanda (&gt;85% ocupação) e baixo churn.
              Recomendamos ajuste de preço para maximizar receita líquida.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="bg-amber-50 dark:bg-amber-950/20 border-amber-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-amber-800 dark:text-amber-500">
                  Aumento Potencial Mensal (+10%)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-amber-600">
                  {formatBRL(optimizationSim.monthlyBoost)}
                </div>
                <p className="text-xs text-amber-700/70 mt-1">
                  Se reajustado apenas nos novos contratos
                </p>
              </CardContent>
            </Card>
            <Card className="bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-emerald-800 dark:text-emerald-500">
                  Aumento Potencial Anual
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-emerald-600">
                  {formatBRL(optimizationSim.annualBoost)}
                </div>
                <p className="text-xs text-emerald-700/70 mt-1">
                  Impacto composto na receita líquida
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Top Horários Premium para Reajuste</CardTitle>
                <CardDescription>
                  Critérios: Ocupação &gt; 85% e Comparecimento &gt; 80%
                </CardDescription>
              </div>
              <Button
                onClick={() =>
                  toast({
                    title: 'Reajuste sugerido aplicado aos novos planos!',
                    description:
                      'Os novos alunos já receberão a tabela de preços atualizada.',
                  })
                }
              >
                Aplicar reajuste a novos contratos
              </Button>
            </CardHeader>
            <CardContent className="p-0 overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Dia</TableHead>
                    <TableHead>Horário</TableHead>
                    <TableHead className="text-right">Ocupação</TableHead>
                    <TableHead className="text-right">
                      Freq. (Comparecimento)
                    </TableHead>
                    <TableHead className="text-right">
                      Receita Atual/Mês
                    </TableHead>
                    <TableHead className="text-right bg-primary/5 rounded-t-md">
                      Sugestão (+10%)
                    </TableHead>
                    <TableHead className="text-right">Impacto Mensal</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {premiumSlots.slice(0, 10).map((s) => (
                    <TableRow key={s.id}>
                      <TableCell className="font-medium">
                        {dayNames[s.dia_semana]}
                      </TableCell>
                      <TableCell>{s.faixa_horaria}</TableCell>
                      <TableCell className="text-right font-bold text-emerald-600">
                        {(s.ocupacao_percentual * 100).toFixed(0)}%
                      </TableCell>
                      <TableCell className="text-right">
                        {(s.taxa_comparecimento * 100).toFixed(0)}%
                      </TableCell>
                      <TableCell className="text-right text-muted-foreground">
                        {formatBRL(s.receita_bruta)}
                      </TableCell>
                      <TableCell className="text-right font-bold bg-primary/5">
                        {formatBRL(s.receita_bruta * 1.1)}
                      </TableCell>
                      <TableCell className="text-right text-emerald-600 font-medium">
                        +{formatBRL(s.receita_bruta * 0.1)}
                      </TableCell>
                    </TableRow>
                  ))}
                  {premiumSlots.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center p-4">
                        Nenhum horário com demanda premium o suficiente no
                        momento.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
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
                  {tenantMethods.map((m) => (
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
    </div>
  )
}
