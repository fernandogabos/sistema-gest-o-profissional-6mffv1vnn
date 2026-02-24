export type Tenant = {
  id: string
  name: string
  planType: string
  status: 'active' | 'inactive'
  createdAt: string
}
export type User = {
  id: string
  authUserId: string
  tenantId?: string
  role: 'master_admin' | 'professional_owner' | 'professional_admin' | 'student'
  fullName: string
  avatarUrl: string
}
export type Location = {
  id: string
  tenantId: string
  name: string
  address: string
  tipo_repasse: 'percentage' | 'fixed' | 'monthly' | 'none' | 'hybrid'
  percentual_repasse: number
  valor_fixo_por_sessao: number
  valor_mensal_fixo: number
  modelo_cobranca: string
  ativo: boolean
}
export type Student = {
  id: string
  tenantId: string
  nome: string
  email: string
  telefone: string
  status: 'active' | 'inactive' | 'delinquent'
  avatarUrl: string
  planId?: string
}
export type Plan = {
  id: string
  tenantId?: string
  nome: string
  valor: number
  frequenciaSemanal: number
  isGlobal?: boolean
}
export type Session = {
  id: string
  tenantId: string
  alunoId: string
  localId: string
  data: string
  valor_bruto: number
  repasse_calculado: number
  lucro_liquido: number
  status: 'realized' | 'canceled'
}
export type Payment = {
  id: string
  tenantId: string
  alunoId?: string
  descricao: string
  valorPago: number
  dataVencimento: string
  dataPagamento?: string
  status: 'paid' | 'pending' | 'overdue'
  recorrente: boolean
}
export type Expense = {
  id: string
  tenantId: string
  descricao: string
  categoria: string
  tipo: 'fixed' | 'variable'
  fornecedor?: string
  valor: number
  dataVencimento: string
  dataPagamento?: string
  status: 'paid' | 'pending' | 'overdue'
}
export type AuditLog = {
  id: string
  tenantId: string
  action: string
  entityType: string
  entityId: string
  details: string
  justification?: string
  createdAt: string
}
export type Theme = {
  primaryColor: string
  brandName: string
  logoUrl: string
  tenantId?: string
}

const currentMonth = new Date().toISOString().slice(0, 7)
const today = new Date().toISOString().slice(0, 10)

export const mockTenants: Tenant[] = [
  {
    id: 't-1',
    name: 'Personal Pro Studio',
    planType: 'premium',
    status: 'active',
    createdAt: '2023-01-01T10:00:00Z',
  },
  {
    id: 't-2',
    name: 'FitLife Assessoria',
    planType: 'basic',
    status: 'active',
    createdAt: '2023-05-15T14:30:00Z',
  },
]

export const mockUsers: User[] = [
  {
    id: 'u-master',
    authUserId: 'auth-1',
    fullName: 'Admin Master',
    role: 'master_admin',
    avatarUrl: 'https://img.usecurling.com/ppl/thumbnail?seed=master',
  },
  {
    id: 'u-prof1',
    authUserId: 'auth-2',
    fullName: 'Carlos Personal',
    role: 'professional_owner',
    tenantId: 't-1',
    avatarUrl:
      'https://img.usecurling.com/ppl/thumbnail?gender=male&seed=prof1',
  },
  {
    id: 'u-admin1',
    authUserId: 'auth-3',
    fullName: 'Secretária Ana',
    role: 'professional_admin',
    tenantId: 't-1',
    avatarUrl:
      'https://img.usecurling.com/ppl/thumbnail?gender=female&seed=admin1',
  },
  {
    id: 'u-stu1',
    authUserId: 'auth-4',
    fullName: 'João Aluno',
    role: 'student',
    tenantId: 't-1',
    avatarUrl: 'https://img.usecurling.com/ppl/thumbnail?gender=male&seed=stu1',
  },
]

export const mockPlans: Plan[] = [
  {
    id: 'p-global-1',
    nome: 'SaaS Plataforma Básico',
    valor: 99.9,
    frequenciaSemanal: 0,
    isGlobal: true,
  },
  {
    id: 'p-global-2',
    nome: 'SaaS Plataforma Pro',
    valor: 199.9,
    frequenciaSemanal: 0,
    isGlobal: true,
  },
  {
    id: 'p-1',
    nome: 'Mensal Padrão',
    valor: 350,
    frequenciaSemanal: 3,
    tenantId: 't-1',
  },
  {
    id: 'p-2',
    nome: 'Trimestral Pro',
    valor: 900,
    frequenciaSemanal: 5,
    tenantId: 't-1',
  },
]

export const mockLocations: Location[] = [
  {
    id: 'loc-1',
    tenantId: 't-1',
    name: 'Studio Centro',
    address: 'Rua Principal, 100',
    tipo_repasse: 'percentage',
    percentual_repasse: 30,
    valor_fixo_por_sessao: 0,
    valor_mensal_fixo: 0,
    modelo_cobranca: 'Por Sessão',
    ativo: true,
  },
  {
    id: 'loc-2',
    tenantId: 't-1',
    name: 'Academia FitZ',
    address: 'Av. Brasil, 200',
    tipo_repasse: 'fixed',
    percentual_repasse: 0,
    valor_fixo_por_sessao: 50,
    valor_mensal_fixo: 0,
    modelo_cobranca: 'Mensal',
    ativo: true,
  },
  {
    id: 'loc-3',
    tenantId: 't-1',
    name: 'Condomínio Prime',
    address: 'Av. das Flores, 50',
    tipo_repasse: 'none',
    percentual_repasse: 0,
    valor_fixo_por_sessao: 0,
    valor_mensal_fixo: 0,
    modelo_cobranca: 'Avulso',
    ativo: true,
  },
]

export const mockStudents: Student[] = [
  {
    id: 'stu-1',
    tenantId: 't-1',
    nome: 'Carlos Santos',
    email: 'carlos@email.com',
    telefone: '11999999999',
    planId: 'p-1',
    status: 'active',
    avatarUrl: 'https://img.usecurling.com/ppl/thumbnail?gender=male&seed=1',
  },
  {
    id: 'stu-2',
    tenantId: 't-1',
    nome: 'Ana Oliveira',
    email: 'ana@email.com',
    telefone: '11888888888',
    planId: 'p-2',
    status: 'active',
    avatarUrl: 'https://img.usecurling.com/ppl/thumbnail?gender=female&seed=2',
  },
  {
    id: 'stu-3',
    tenantId: 't-1',
    nome: 'Rafael Costa',
    email: 'rafael@email.com',
    telefone: '11777777777',
    planId: 'p-1',
    status: 'delinquent',
    avatarUrl: 'https://img.usecurling.com/ppl/thumbnail?gender=male&seed=3',
  },
]

export const mockPayments: Payment[] = [
  {
    id: 'pay-1',
    tenantId: 't-1',
    alunoId: 'stu-1',
    descricao: 'Mensalidade Padrão',
    valorPago: 350,
    dataVencimento: `${currentMonth}-05`,
    dataPagamento: `${currentMonth}-05`,
    status: 'paid',
    recorrente: true,
  },
  {
    id: 'pay-2',
    tenantId: 't-1',
    alunoId: 'stu-2',
    descricao: 'Trimestral Pro',
    valorPago: 900,
    dataVencimento: `${currentMonth}-10`,
    dataPagamento: `${currentMonth}-10`,
    status: 'paid',
    recorrente: true,
  },
  {
    id: 'pay-3',
    tenantId: 't-1',
    alunoId: 'stu-3',
    descricao: 'Mensalidade Padrão',
    valorPago: 350,
    dataVencimento: `${currentMonth}-15`,
    status: 'pending',
    recorrente: true,
  },
]

export const mockExpenses: Expense[] = [
  {
    id: 'exp-1',
    tenantId: 't-1',
    descricao: 'Manutenção Equipamentos',
    categoria: 'Manutenção',
    tipo: 'variable',
    fornecedor: 'FitServices',
    valor: 150,
    dataVencimento: `${currentMonth}-10`,
    dataPagamento: `${currentMonth}-08`,
    status: 'paid',
  },
  {
    id: 'exp-2',
    tenantId: 't-1',
    descricao: 'Marketing Digital',
    categoria: 'Marketing',
    tipo: 'fixed',
    fornecedor: 'Agência X',
    valor: 300,
    dataVencimento: `${currentMonth}-15`,
    status: 'pending',
  },
  {
    id: 'exp-3',
    tenantId: 't-1',
    descricao: 'Imposto DAS',
    categoria: 'Impostos',
    tipo: 'variable',
    valor: 120,
    dataVencimento: `${currentMonth}-20`,
    status: 'pending',
  },
]

export const mockSessions: Session[] = [
  {
    id: 'ses-1',
    tenantId: 't-1',
    alunoId: 'stu-1',
    localId: 'loc-1',
    data: today,
    valor_bruto: 100,
    repasse_calculado: 30,
    lucro_liquido: 70,
    status: 'realized',
  },
  {
    id: 'ses-2',
    tenantId: 't-1',
    alunoId: 'stu-2',
    localId: 'loc-2',
    data: today,
    valor_bruto: 150,
    repasse_calculado: 50,
    lucro_liquido: 100,
    status: 'realized',
  },
  {
    id: 'ses-3',
    tenantId: 't-1',
    alunoId: 'stu-1',
    localId: 'loc-3',
    data: today,
    valor_bruto: 120,
    repasse_calculado: 0,
    lucro_liquido: 120,
    status: 'realized',
  },
]

export const mockAuditLogs: AuditLog[] = []

export const themeOptions = {
  blue: { primary: '221.2 83.2% 53.3%', secondary: '210 40% 96.1%' },
  emerald: { primary: '142.1 76.2% 36.3%', secondary: '149.3 80.4% 90%' },
  rose: { primary: '346.8 77.2% 49.8%', secondary: '355.7 100% 97.3%' },
  amber: { primary: '37.7 92.1% 50.2%', secondary: '48 96.5% 89%' },
  slate: { primary: '222.2 47.4% 11.2%', secondary: '210 40% 96.1%' },
}
