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
  whatsappConsent?: boolean
  consentUpdatedAt?: string
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

export type EvaluationTemplate = {
  id: string
  tenantId: string
  name: string
  description: string
  type: 'student' | 'employee' | 'service'
  status: 'active' | 'inactive'
  criteria: { id: string; name: string; weight: number }[]
}

export type EvaluationResult = {
  id: string
  tenantId: string
  templateId: string
  templateName: string
  targetId: string
  date: string
  totalScore: number
  classification: 'Critical' | 'Low' | 'Medium' | 'High'
  scores: { criterionId: string; name: string; weight: number; value: number }[]
}

export type CommunicationTemplate = {
  id: string
  tenantId: string
  name: string
  triggerEvent:
    | 'manual'
    | 'new_student'
    | 'payment_overdue'
    | 'evaluation_completed'
    | 'monthly_report'
    | 'task_deadline'
  content: string
  isActive: boolean
}

export type CommunicationLog = {
  id: string
  tenantId: string
  targetId: string
  templateId?: string
  content: string
  status: 'sent' | 'delivered' | 'read' | 'failed'
  channel: 'whatsapp' | 'email' | 'sms'
  timestamp: string
}

export type WhatsAppConfig = {
  tenantId: string
  isConnected: boolean
  phoneNumber: string
  apiToken: string
}

export type AgendaEvent = {
  id: string
  tenantId: string
  userId: string
  studentId?: string
  locationId?: string
  title: string
  date: string
  startTime: string
  endTime: string
  type: 'session' | 'block'
  blockReason?: 'lunch' | 'travel' | 'personal' | 'vacation'
  status:
    | 'scheduled'
    | 'confirmed'
    | 'performed'
    | 'canceled_student'
    | 'canceled_pro'
    | 'no_show'
  value: number
  splitValue: number
  netValue: number
  notes?: string
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
    whatsappConsent: true,
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
    whatsappConsent: true,
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
]

export const mockEvaluationTemplates: EvaluationTemplate[] = [
  {
    id: 'tpl-1',
    tenantId: 't-1',
    name: 'Avaliação Física Geral',
    description: 'Métricas de desempenho e composição',
    type: 'student',
    status: 'active',
    criteria: [
      { id: 'crit-1', name: 'Força Funcional', weight: 3 },
      { id: 'crit-2', name: 'Resistência Aeróbica', weight: 3 },
      { id: 'crit-3', name: 'Flexibilidade', weight: 2 },
      { id: 'crit-4', name: 'Composição Corporal', weight: 2 },
    ],
  },
]

export const mockEvaluationResults: EvaluationResult[] = [
  {
    id: 'res-1',
    tenantId: 't-1',
    templateId: 'tpl-1',
    templateName: 'Avaliação Física Geral',
    targetId: 'stu-1',
    date: '2023-10-01',
    totalScore: 55,
    classification: 'Low',
    scores: [
      { criterionId: 'crit-1', name: 'Força Funcional', weight: 3, value: 50 },
      {
        criterionId: 'crit-2',
        name: 'Resistência Aeróbica',
        weight: 3,
        value: 60,
      },
      { criterionId: 'crit-3', name: 'Flexibilidade', weight: 2, value: 40 },
      {
        criterionId: 'crit-4',
        name: 'Composição Corporal',
        weight: 2,
        value: 70,
      },
    ],
  },
  {
    id: 'res-2',
    tenantId: 't-1',
    templateId: 'tpl-1',
    templateName: 'Avaliação Física Geral',
    targetId: 'stu-1',
    date: '2023-11-01',
    totalScore: 72,
    classification: 'Medium',
    scores: [
      { criterionId: 'crit-1', name: 'Força Funcional', weight: 3, value: 70 },
      {
        criterionId: 'crit-2',
        name: 'Resistência Aeróbica',
        weight: 3,
        value: 75,
      },
      { criterionId: 'crit-3', name: 'Flexibilidade', weight: 2, value: 60 },
      {
        criterionId: 'crit-4',
        name: 'Composição Corporal',
        weight: 2,
        value: 80,
      },
    ],
  },
]

export const mockCommunicationTemplates: CommunicationTemplate[] = [
  {
    id: 'tpl-comm-1',
    tenantId: 't-1',
    name: 'Boas-vindas',
    triggerEvent: 'new_student',
    content:
      'Olá {{client_name}}, bem-vindo(a)! Estamos felizes em ter você conosco na nossa consultoria.',
    isActive: true,
  },
  {
    id: 'tpl-comm-2',
    tenantId: 't-1',
    name: 'Aviso de Vencimento',
    triggerEvent: 'payment_overdue',
    content:
      'Olá {{client_name}}, identificamos um atraso no pagamento do valor de R$ {{amount}}. Por favor, entre em contato para regularizar.',
    isActive: true,
  },
  {
    id: 'tpl-comm-3',
    tenantId: 't-1',
    name: 'Avaliação Finalizada',
    triggerEvent: 'evaluation_completed',
    content:
      'Parabéns {{client_name}}! Sua nova avaliação foi registrada. Acesse o app para ver sua evolução.',
    isActive: true,
  },
]

export const mockCommunicationLogs: CommunicationLog[] = [
  {
    id: 'log-c-1',
    tenantId: 't-1',
    targetId: 'stu-1',
    templateId: 'tpl-comm-1',
    content:
      'Olá Carlos Santos, bem-vindo(a)! Estamos felizes em ter você conosco na nossa consultoria.',
    status: 'read',
    channel: 'whatsapp',
    timestamp: '2023-10-01T10:00:00Z',
  },
]

export const mockWhatsAppConfigs: WhatsAppConfig[] = [
  {
    tenantId: 't-1',
    isConnected: true,
    phoneNumber: '5511999999999',
    apiToken: 'mock-token-abc',
  },
]

export const mockEvents: AgendaEvent[] = [
  {
    id: 'evt-1',
    tenantId: 't-1',
    userId: 'u-prof1',
    studentId: 'stu-1',
    locationId: 'loc-1',
    title: 'Sessão Carlos',
    date: today,
    startTime: '08:00',
    endTime: '09:00',
    type: 'session',
    status: 'confirmed',
    value: 120,
    splitValue: 36,
    netValue: 84,
  },
  {
    id: 'evt-2',
    tenantId: 't-1',
    userId: 'u-prof1',
    title: 'Almoço',
    date: today,
    startTime: '12:00',
    endTime: '13:00',
    type: 'block',
    blockReason: 'lunch',
    status: 'scheduled',
    value: 0,
    splitValue: 0,
    netValue: 0,
  },
  {
    id: 'evt-3',
    tenantId: 't-1',
    userId: 'u-prof1',
    studentId: 'stu-2',
    locationId: 'loc-2',
    title: 'Sessão Ana',
    date: today,
    startTime: '09:30',
    endTime: '10:30',
    type: 'session',
    status: 'scheduled',
    value: 150,
    splitValue: 50,
    netValue: 100,
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
