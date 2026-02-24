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
import { LineChart, Line, CartesianGrid, XAxis, YAxis } from 'recharts'

export default function Finance() {
  const {
    payments,
    expenses,
    students,
    currentUser,
    addPayment,
    updatePayment,
    addExpense,
    updateExpense,
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

  const tPayments = useMemo(
    () => payments.filter((p) => p.tenantId === currentUser.tenantId),
    [payments, currentUser],
  )
  const tExpenses = useMemo(
    () => expenses.filter((e) => e.tenantId === currentUser.tenantId),
    [expenses, currentUser],
  )
  const tenantStudents = useMemo(
    () => students.filter((s) => s.tenantId === currentUser.tenantId),
    [students, currentUser],
  )

  const currentMonthPrefix = new Date().toISOString().slice(0, 7)
  const monthlyPaidRev = tPayments
    .filter(
      (p) =>
        p.status === 'paid' && p.dataPagamento?.startsWith(currentMonthPrefix),
    )
    .reduce((acc, p) => acc + p.valorPago, 0)
  const monthlyPaidExp = tExpenses
    .filter(
      (e) =>
        e.status === 'paid' && e.dataPagamento?.startsWith(currentMonthPrefix),
    )
    .reduce((acc, e) => acc + e.valor, 0)

  const lastMonthDate = new Date()
  lastMonthDate.setMonth(lastMonthDate.getMonth() - 1)
  const lastMonthPrefix = lastMonthDate.toISOString().slice(0, 7)
  const lastMonthPaidRev = tPayments
    .filter(
      (p) =>
        p.status === 'paid' && p.dataPagamento?.startsWith(lastMonthPrefix),
    )
    .reduce((acc, p) => acc + p.valorPago, 0)

  const activeStudents = tenantStudents.filter(
    (s) => s.status === 'active',
  ).length
  const ticketMedio = activeStudents > 0 ? monthlyPaidRev / activeStudents : 0
  const growth =
    lastMonthPaidRev > 0
      ? ((monthlyPaidRev - lastMonthPaidRev) / lastMonthPaidRev) * 100
      : 100
  const margin =
    monthlyPaidRev > 0
      ? ((monthlyPaidRev - monthlyPaidExp) / monthlyPaidRev) * 100
      : 0

  const overduePayments = tPayments.filter((p) => p.status === 'overdue')
  const overdueExpenses = tExpenses.filter((e) => e.status === 'overdue')

  const dre = useMemo(() => {
    const gross = monthlyPaidRev
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
    return { gross, varCosts, fixedCosts, taxes, net }
  }, [tPayments, tExpenses, currentMonthPrefix, monthlyPaidRev])

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
        .filter((p) => p.status === 'paid' && p.dataPagamento === dateStr)
        .reduce((acc, p) => acc + p.valorPago, 0)
      const dayExpReal = tExpenses
        .filter((e) => e.status === 'paid' && e.dataPagamento === dateStr)
        .reduce((acc, e) => acc + e.valor, 0)

      const dayRevProj = tPayments
        .filter((p) => p.dataVencimento === dateStr)
        .reduce((acc, p) => acc + p.valorPago, 0)
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
  }, [tPayments, tExpenses, currentMonthPrefix])

  const handleSavePayment = () => {
    if (!payData.descricao || !payData.valorPago) return
    addPayment({
      alunoId: payData.alunoId === 'none' ? undefined : payData.alunoId,
      descricao: payData.descricao,
      valorPago: Number(payData.valorPago),
      dataVencimento: payData.dataVencimento,
      dataPagamento:
        payData.status === 'paid'
          ? payData.dataPagamento || new Date().toISOString().slice(0, 10)
          : undefined,
      status: payData.status,
      recorrente: payData.recorrente,
    })
    setOpenPay(false)
    toast({ title: 'Receita registrada com sucesso!' })
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

  const markPaymentPaid = (id: string) => {
    updatePayment(id, {
      status: 'paid',
      dataPagamento: new Date().toISOString().slice(0, 10),
    })
    toast({ title: 'Recebimento marcado como pago' })
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
            Centro Financeiro
          </h1>
          <p className="text-muted-foreground mt-1">
            Gestão estratégica de receitas, despesas e fluxo de caixa.
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
        <TabsList className="grid w-full grid-cols-4 lg:w-[600px] mb-6">
          <TabsTrigger value="dashboard">Visão Geral</TabsTrigger>
          <TabsTrigger value="receivables">A Receber</TabsTrigger>
          <TabsTrigger value="payables">A Pagar</TabsTrigger>
          <TabsTrigger value="reports">DRE & Fluxo</TabsTrigger>
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
                  Receita Mensal
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-emerald-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-emerald-600">
                  {formatBRL(monthlyPaidRev)}
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

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  Ticket Médio
                </CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatBRL(ticketMedio)}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Por aluno ativo
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
                      <Label>Status</Label>
                      <Select
                        value={payData.status}
                        onValueChange={(v: any) =>
                          setPayData((d) => ({ ...d, status: v }))
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
                      value={payData.dataVencimento}
                      onChange={(e) =>
                        setPayData((d) => ({
                          ...d,
                          dataVencimento: e.target.value,
                        }))
                      }
                    />
                  </div>
                  {payData.status === 'paid' && (
                    <div className="space-y-2">
                      <Label>Data do Pagamento</Label>
                      <Input
                        type="date"
                        value={payData.dataPagamento}
                        onChange={(e) =>
                          setPayData((d) => ({
                            ...d,
                            dataPagamento: e.target.value,
                          }))
                        }
                      />
                    </div>
                  )}
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
                        </TableCell>
                        <TableCell>{statusBadge(p.status)}</TableCell>
                        <TableCell>
                          {p.status !== 'paid' && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => markPaymentPaid(p.id)}
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
                Acúmulo diário projetado vs realizado neste mês.
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
              <CardTitle>Demonstração do Resultado (DRE) Automático</CardTitle>
              <CardDescription>
                Resultados financeiros realizados (status = pago) no mês atual.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0 overflow-x-auto">
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium text-lg">
                      Receita Bruta Total
                    </TableCell>
                    <TableCell className="text-right font-bold text-lg text-emerald-600">
                      {formatBRL(dre.gross)}
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
      </Tabs>
    </div>
  )
}
