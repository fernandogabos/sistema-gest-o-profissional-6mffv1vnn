export type Tenant = {
  id: string
  name: string
  status: 'active' | 'inactive'
  createdAt: string
}
export type User = {
  id: string
  name: string
  email: string
  role: 'master' | 'professional' | 'admin' | 'student'
  tenantId?: string
  avatarUrl: string
}
export type Plan = {
  id: string
  name: string
  price: number
  interval: 'monthly' | 'quarterly' | 'yearly'
  tenantId?: string
  isGlobal?: boolean
}
export type FinancialRule = {
  id: string
  locationId: string
  type: 'fixed' | 'percentage'
  value: number
}
export type Location = {
  id: string
  tenantId: string
  name: string
  rule: FinancialRule
}
export type Student = {
  id: string
  tenantId: string
  name: string
  planId: string
  status: 'active' | 'inactive' | 'delinquent'
  locationId: string
  joinDate: string
  avatarUrl: string
}
export type Payment = {
  id: string
  tenantId: string
  studentId: string
  amount: number
  date: string
  status: 'paid' | 'pending'
  locationId: string
  description: string
}
export type Expense = {
  id: string
  tenantId: string
  description: string
  amount: number
  date: string
  locationId: string
}
export type Session = {
  id: string
  tenantId: string
  studentId: string
  date: string
  locationId: string
  status: 'scheduled' | 'completed' | 'cancelled'
}
export type Theme = {
  primaryColor: string
  name: string
  logoUrl: string
  tenantId?: string
}

export const mockTenants: Tenant[] = [
  {
    id: 't-1',
    name: 'Personal Pro Studio',
    status: 'active',
    createdAt: '2023-01-01T10:00:00Z',
  },
  {
    id: 't-2',
    name: 'FitLife Assessoria',
    status: 'active',
    createdAt: '2023-05-15T14:30:00Z',
  },
]

export const mockUsers: User[] = [
  {
    id: 'u-master',
    name: 'Admin Master',
    email: 'master@platform.com',
    role: 'master',
    avatarUrl: 'https://img.usecurling.com/ppl/thumbnail?seed=master',
  },
  {
    id: 'u-prof1',
    name: 'Carlos Personal',
    email: 'carlos@personal.com',
    role: 'professional',
    tenantId: 't-1',
    avatarUrl:
      'https://img.usecurling.com/ppl/thumbnail?gender=male&seed=prof1',
  },
  {
    id: 'u-admin1',
    name: 'Secretária Ana',
    email: 'ana@personal.com',
    role: 'admin',
    tenantId: 't-1',
    avatarUrl:
      'https://img.usecurling.com/ppl/thumbnail?gender=female&seed=admin1',
  },
  {
    id: 'u-stu1',
    name: 'João Aluno',
    email: 'joao@aluno.com',
    role: 'student',
    tenantId: 't-1',
    avatarUrl: 'https://img.usecurling.com/ppl/thumbnail?gender=male&seed=stu1',
  },
]

export const mockPlans: Plan[] = [
  {
    id: 'p-global-1',
    name: 'SaaS Plataforma Básico',
    price: 99.9,
    interval: 'monthly',
    isGlobal: true,
  },
  {
    id: 'p-global-2',
    name: 'SaaS Plataforma Pro',
    price: 199.9,
    interval: 'monthly',
    isGlobal: true,
  },
  {
    id: 'p-1',
    name: 'Mensal Padrão',
    price: 350,
    interval: 'monthly',
    tenantId: 't-1',
  },
  {
    id: 'p-2',
    name: 'Trimestral Pro',
    price: 900,
    interval: 'quarterly',
    tenantId: 't-1',
  },
  {
    id: 'p-3',
    name: 'Mensal Básico',
    price: 250,
    interval: 'monthly',
    tenantId: 't-2',
  },
]

export const mockLocations: Location[] = [
  {
    id: 'loc-1',
    tenantId: 't-1',
    name: 'Studio Centro',
    rule: { id: 'r-1', locationId: 'loc-1', type: 'percentage', value: 30 },
  },
  {
    id: 'loc-2',
    tenantId: 't-1',
    name: 'Academia FitZ',
    rule: { id: 'r-2', locationId: 'loc-2', type: 'fixed', value: 1000 },
  },
  {
    id: 'loc-3',
    tenantId: 't-2',
    name: 'Box Cross',
    rule: { id: 'r-3', locationId: 'loc-3', type: 'percentage', value: 40 },
  },
]

export const mockStudents: Student[] = [
  {
    id: 'stu-1',
    tenantId: 't-1',
    name: 'Carlos Santos',
    planId: 'p-1',
    status: 'active',
    locationId: 'loc-1',
    joinDate: '2023-01-15T10:00:00Z',
    avatarUrl: 'https://img.usecurling.com/ppl/thumbnail?gender=male&seed=1',
  },
  {
    id: 'stu-2',
    tenantId: 't-1',
    name: 'Ana Oliveira',
    planId: 'p-2',
    status: 'active',
    locationId: 'loc-1',
    joinDate: '2023-03-10T10:00:00Z',
    avatarUrl: 'https://img.usecurling.com/ppl/thumbnail?gender=female&seed=2',
  },
  {
    id: 'stu-3',
    tenantId: 't-1',
    name: 'Rafael Costa',
    planId: 'p-1',
    status: 'delinquent',
    locationId: 'loc-2',
    joinDate: '2022-11-05T10:00:00Z',
    avatarUrl: 'https://img.usecurling.com/ppl/thumbnail?gender=male&seed=3',
  },
  {
    id: 'stu-4',
    tenantId: 't-2',
    name: 'Mariana Lima',
    planId: 'p-3',
    status: 'active',
    locationId: 'loc-3',
    joinDate: '2024-01-20T10:00:00Z',
    avatarUrl: 'https://img.usecurling.com/ppl/thumbnail?gender=female&seed=4',
  },
]

export const mockPayments: Payment[] = [
  {
    id: 'pay-1',
    tenantId: 't-1',
    studentId: 'stu-1',
    amount: 350,
    date: '2024-02-01T10:00:00Z',
    status: 'paid',
    locationId: 'loc-1',
    description: 'Mensalidade - Carlos',
  },
  {
    id: 'pay-2',
    tenantId: 't-1',
    studentId: 'stu-2',
    amount: 900,
    date: '2024-02-02T10:00:00Z',
    status: 'paid',
    locationId: 'loc-1',
    description: 'Trimestral - Ana',
  },
  {
    id: 'pay-3',
    tenantId: 't-1',
    studentId: 'stu-3',
    amount: 350,
    date: '2024-02-05T10:00:00Z',
    status: 'pending',
    locationId: 'loc-2',
    description: 'Mensalidade - Rafael',
  },
  {
    id: 'pay-4',
    tenantId: 't-2',
    studentId: 'stu-4',
    amount: 250,
    date: '2024-02-10T10:00:00Z',
    status: 'paid',
    locationId: 'loc-3',
    description: 'Mensalidade - Mariana',
  },
]

export const mockExpenses: Expense[] = [
  {
    id: 'exp-1',
    tenantId: 't-1',
    description: 'Manutenção Equipamentos',
    amount: 150,
    date: '2024-02-10T10:00:00Z',
    locationId: 'loc-1',
  },
  {
    id: 'exp-2',
    tenantId: 't-1',
    description: 'Marketing Digital',
    amount: 300,
    date: '2024-02-15T10:00:00Z',
    locationId: 'loc-1',
  },
]

export const mockSessions: Session[] = [
  {
    id: 'ses-1',
    tenantId: 't-1',
    studentId: 'stu-1',
    date: '2024-02-20T10:00:00Z',
    locationId: 'loc-1',
    status: 'completed',
  },
  {
    id: 'ses-2',
    tenantId: 't-1',
    studentId: 'stu-2',
    date: '2024-02-21T14:00:00Z',
    locationId: 'loc-1',
    status: 'scheduled',
  },
]

export const themeOptions = {
  blue: { primary: '221.2 83.2% 53.3%', secondary: '210 40% 96.1%' },
  emerald: { primary: '142.1 76.2% 36.3%', secondary: '149.3 80.4% 90%' },
  rose: { primary: '346.8 77.2% 49.8%', secondary: '355.7 100% 97.3%' },
  amber: { primary: '37.7 92.1% 50.2%', secondary: '48 96.5% 89%' },
  slate: { primary: '222.2 47.4% 11.2%', secondary: '210 40% 96.1%' },
}
