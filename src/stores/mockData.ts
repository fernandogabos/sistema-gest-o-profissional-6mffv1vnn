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
  repasseTipo: 'percentage' | 'fixed'
  repassePercentual: number
  repasseValorFixo: number
  repasseMensal: boolean
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
  valorSessao: number
  repasseCalculado: number
  lucroLiquido: number
}
export type Payment = {
  id: string
  tenantId: string
  alunoId: string
  valorPago: number
  dataPagamento: string
  status: 'paid' | 'pending'
}
export type Expense = {
  id: string
  tenantId: string
  descricao: string
  valor: number
  data: string
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
    repasseTipo: 'percentage',
    repassePercentual: 30,
    repasseValorFixo: 0,
    repasseMensal: true,
  },
  {
    id: 'loc-2',
    tenantId: 't-1',
    name: 'Academia FitZ',
    address: 'Av. Brasil, 200',
    repasseTipo: 'fixed',
    repassePercentual: 0,
    repasseValorFixo: 50,
    repasseMensal: false,
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
    valorPago: 350,
    dataPagamento: `${currentMonth}-05`,
    status: 'paid',
  },
  {
    id: 'pay-2',
    tenantId: 't-1',
    alunoId: 'stu-2',
    valorPago: 900,
    dataPagamento: `${currentMonth}-10`,
    status: 'paid',
  },
  {
    id: 'pay-3',
    tenantId: 't-1',
    alunoId: 'stu-3',
    valorPago: 350,
    dataPagamento: `${currentMonth}-15`,
    status: 'pending',
  },
]

export const mockExpenses: Expense[] = [
  {
    id: 'exp-1',
    tenantId: 't-1',
    descricao: 'Manutenção Equipamentos',
    valor: 150,
    data: `${currentMonth}-10`,
  },
  {
    id: 'exp-2',
    tenantId: 't-1',
    descricao: 'Marketing Digital',
    valor: 300,
    data: `${currentMonth}-15`,
  },
]

export const mockSessions: Session[] = [
  {
    id: 'ses-1',
    tenantId: 't-1',
    alunoId: 'stu-1',
    localId: 'loc-1',
    data: today,
    valorSessao: 100,
    repasseCalculado: 30,
    lucroLiquido: 70,
  },
  {
    id: 'ses-2',
    tenantId: 't-1',
    alunoId: 'stu-2',
    localId: 'loc-2',
    data: today,
    valorSessao: 150,
    repasseCalculado: 50,
    lucroLiquido: 100,
  },
]

export const themeOptions = {
  blue: { primary: '221.2 83.2% 53.3%', secondary: '210 40% 96.1%' },
  emerald: { primary: '142.1 76.2% 36.3%', secondary: '149.3 80.4% 90%' },
  rose: { primary: '346.8 77.2% 49.8%', secondary: '355.7 100% 97.3%' },
  amber: { primary: '37.7 92.1% 50.2%', secondary: '48 96.5% 89%' },
  slate: { primary: '222.2 47.4% 11.2%', secondary: '210 40% 96.1%' },
}
