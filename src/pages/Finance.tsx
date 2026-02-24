import { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
import { ArrowUpRight, ArrowDownRight, Plus } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import useAppStore from '@/stores/main'
import { formatBRL, formatDate } from '@/lib/formatters'

export default function Finance() {
  const { payments, expenses, students, currentUser, addPayment, addExpense } =
    useAppStore()
  const { toast } = useToast()

  const [openPay, setOpenPay] = useState(false)
  const [payData, setPayData] = useState({
    alunoId: '',
    valorPago: '',
    dataPagamento: new Date().toISOString().slice(0, 10),
    status: 'paid' as any,
  })

  const [openExp, setOpenExp] = useState(false)
  const [expData, setExpData] = useState({
    descricao: '',
    valor: '',
    data: new Date().toISOString().slice(0, 10),
  })

  const filteredPayments = payments.filter(
    (p) => p.tenantId === currentUser.tenantId,
  )
  const filteredExpenses = expenses.filter(
    (e) => e.tenantId === currentUser.tenantId,
  )
  const tenantStudents = students.filter(
    (s) => s.tenantId === currentUser.tenantId,
  )

  const handleSavePayment = () => {
    if (!payData.alunoId || !payData.valorPago) return
    addPayment({ ...payData, valorPago: Number(payData.valorPago) })
    setOpenPay(false)
    toast({ title: 'Pagamento registrado' })
  }

  const handleSaveExpense = () => {
    if (!expData.descricao || !expData.valor) return
    addExpense({ ...expData, valor: Number(expData.valor) })
    setOpenExp(false)
    toast({ title: 'Despesa registrada' })
  }

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Financeiro</h1>
        <p className="text-muted-foreground mt-1">
          Acompanhamento de pagamentos de alunos e despesas.
        </p>
      </div>

      <Tabs defaultValue="payments" className="w-full">
        <div className="flex justify-between items-center mb-6">
          <TabsList>
            <TabsTrigger value="payments">Pagamentos</TabsTrigger>
            <TabsTrigger value="expenses">Despesas</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="payments" className="space-y-4">
          <div className="flex justify-end">
            <Dialog open={openPay} onOpenChange={setOpenPay}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" /> Registrar Pagamento
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Novo Pagamento</DialogTitle>
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
                        {tenantStudents.map((s) => (
                          <SelectItem key={s.id} value={s.id}>
                            {s.nome}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Valor (R$)</Label>
                    <Input
                      type="number"
                      value={payData.valorPago}
                      onChange={(e) =>
                        setPayData((d) => ({ ...d, valorPago: e.target.value }))
                      }
                    />
                  </div>
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
                  <Button className="w-full mt-4" onClick={handleSavePayment}>
                    Salvar Pagamento
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          <Card>
            <CardContent className="p-0">
              <div className="divide-y">
                {filteredPayments.map((p) => {
                  const stu = students.find((s) => s.id === p.alunoId)
                  return (
                    <div
                      key={p.id}
                      className="p-4 flex justify-between items-center hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="bg-emerald-100 p-2 rounded-full text-emerald-600">
                          <ArrowUpRight className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-medium">{stu?.nome}</p>
                          <p className="text-xs text-muted-foreground">
                            {formatDate(p.dataPagamento)}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-emerald-600">
                          +{formatBRL(p.valorPago)}
                        </p>
                        <Badge
                          variant={
                            p.status === 'paid' ? 'default' : 'secondary'
                          }
                          className="mt-1"
                        >
                          {p.status === 'paid' ? 'Pago' : 'Pendente'}
                        </Badge>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="expenses" className="space-y-4">
          <div className="flex justify-end">
            <Dialog open={openExp} onOpenChange={setOpenExp}>
              <DialogTrigger asChild>
                <Button variant="destructive">
                  <Plus className="mr-2 h-4 w-4" /> Registrar Despesa
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Nova Despesa</DialogTitle>
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
                    <Label>Data</Label>
                    <Input
                      type="date"
                      value={expData.data}
                      onChange={(e) =>
                        setExpData((d) => ({ ...d, data: e.target.value }))
                      }
                    />
                  </div>
                  <Button className="w-full mt-4" onClick={handleSaveExpense}>
                    Salvar Despesa
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          <Card>
            <CardContent className="p-0">
              <div className="divide-y">
                {filteredExpenses.map((e) => (
                  <div
                    key={e.id}
                    className="p-4 flex justify-between items-center hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="bg-rose-100 p-2 rounded-full text-rose-600">
                        <ArrowDownRight className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium">{e.descricao}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatDate(e.data)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-rose-600">
                        -{formatBRL(e.valor)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
