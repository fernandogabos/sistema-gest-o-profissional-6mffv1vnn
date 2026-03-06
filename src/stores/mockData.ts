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
  role:
    | 'master_admin'
    | 'professional_owner'
    | 'professional_admin'
    | 'student'
    | 'instructor'
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
  bloquear_inadimplente?: boolean
  dias_tolerancia?: number
  exigir_pagamento_antecipado?: boolean
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
export type PaymentMethod = {
  id: string
  tenantId: string
  nome: string
  tipo:
    | 'credit_card'
    | 'pix_gateway'
    | 'boleto'
    | 'pix_manual'
    | 'cash'
    | 'transfer'
    | 'barter'
    | 'other'
  online: boolean
  gera_taxa: boolean
  ativo: boolean
}
export type Permuta = {
  id: string
  tenantId: string
  alunoId: string
  valor_equivalente: number
  descricao: string
  data: string
}
export type Payment = {
  id: string
  tenantId: string
  alunoId?: string
  contrato_id?: string
  descricao: string
  valorPago: number
  valor_recebido?: number
  saldo_restante?: number
  forma_pagamento_id?: string
  tipo_receita?: string
  online?: boolean
  observacoes?: string
  gateway?: string
  gateway_payment_id?: string
  tipo?: string
  dataVencimento: string
  dataPagamento?: string
  taxa_plataforma?: number
  valor_liquido?: number
  data_criacao?: string
  status: 'paid' | 'pending' | 'overdue' | 'failed' | 'canceled' | 'partial'
  recorrente: boolean
}
export type Subscription = {
  id: string
  tenantId: string
  alunoId: string
  gateway: 'stripe' | 'pagarme' | 'infinitepay'
  gateway_subscription_id: string
  valor: number
  periodicidade: 'weekly' | 'biweekly' | 'monthly' | 'custom'
  status: 'active' | 'canceled' | 'past_due'
  proxima_cobranca: string
}
export type GatewayConfig = {
  tenantId: string
  gateway: 'stripe' | 'pagarme' | 'infinitepay'
  isActive: boolean
  publicKey?: string
  splitMode: 'simple' | 'split'
  splitPercentage?: number
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

export type AnalyticsAgenda = {
  id: string
  tenantId: string
  userId: string
  dia_semana: number
  faixa_horaria: string
  localId?: string
  receita_bruta: number
  receita_liquida: number
  taxa_comparecimento: number
  ocupacao_percentual: number
}

export type AcademyContent = {
  id: string
  tenantId: string
  type: 'course' | 'live' | 'event' | 'mentorship'
  title: string
  description: string
  category: string
  instructor: string
  instructorId: string
  workload: number
  format: 'ead' | 'live' | 'in-person' | 'hybrid'
  isFree: boolean
  price: number
  targetAudience: string
  prerequisites: string
  thumbnailUrl: string
  capacity?: number
  enrolledCount: number
  date?: string
  time?: string
  link?: string
  modules?: {
    id: string
    title: string
    lessons: { id: string; title: string; type: string; duration: number }[]
  }[]
  averageRating?: number
  nps?: number
  revenue?: number
}

export type AcademyEnrollment = {
  id: string
  tenantId: string
  userId: string
  contentId: string
  progress: number
  status: 'active' | 'completed' | 'canceled'
  enrolledAt: string
}

export type AcademyCertificate = {
  id: string
  tenantId: string
  userId: string
  contentId: string
  courseName: string
  instructor: string
  workload: number
  issueDate: string
  validationCode: string
}

export type AcademyPath = {
  id: string
  tenantId: string
  title: string
  description: string
  thumbnailUrl: string
  courseIds: string[]
  badgeId: string
}

export type GamificationProfile = {
  userId: string
  tenantId: string
  points: number
  level: number
  badges: { id: string; name: string; iconUrl: string; earnedAt: string }[]
}

export type CourseEvaluation = {
  id: string
  contentId: string
  userId: string
  rating: number
  feedback: string
  createdAt: string
}

export type CommunityPost = {
  id: string
  tenantId: string
  authorId: string
  courseId?: string
  title: string
  content: string
  createdAt: string
  isResolved: boolean
  likes: number
  replies: {
    id: string
    authorId: string
    content: string
    createdAt: string
    isBestAnswer: boolean
    likes: number
  }[]
}

export type SocialComment = {
  id: string
  authorId: string
  content: string
  createdAt: string
}

export type SocialReaction = {
  userId: string
  type: 'heart' | 'fire' | 'thumbs_up' | 'party'
}

export type SocialPost = {
  id: string
  tenantId: string
  authorId: string
  content: string
  imageUrl?: string
  likes: string[]
  reactions?: SocialReaction[]
  createdAt: string
  comments: SocialComment[]
}

export type Story = {
  id: string
  tenantId: string
  authorId: string
  imageUrl: string
  createdAt: string
  viewed: boolean
}

export type DirectMessage = {
  id: string
  tenantId: string
  senderId: string
  receiverId: string
  content: string
  createdAt: string
  read: boolean
}

export type SurveyQuestion = {
  id: string
  type: 'text' | 'rating' | 'nps' | 'choice'
  text: string
  options?: string[]
  scale?: number
}

export type Survey = {
  id: string
  tenantId: string
  title: string
  description: string
  type: 'satisfaction' | 'nps' | 'feedback'
  status: 'active' | 'inactive'
  questions: SurveyQuestion[]
  createdAt: string
}

export type SurveyResponse = {
  id: string
  tenantId: string
  surveyId: string
  studentId: string
  answers: { questionId: string; value: string | number }[]
  createdAt: string
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
    id: 'u-instr1',
    authUserId: 'auth-5',
    fullName: 'Instrutor Silva',
    role: 'instructor',
    tenantId: 't-1',
    avatarUrl:
      'https://img.usecurling.com/ppl/thumbnail?gender=male&seed=instr1',
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
  {
    id: 'u-stu2',
    authUserId: 'auth-6',
    fullName: 'Maria Aluno',
    role: 'student',
    tenantId: 't-1',
    avatarUrl:
      'https://img.usecurling.com/ppl/thumbnail?gender=female&seed=stu2',
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
    bloquear_inadimplente: true,
    dias_tolerancia: 5,
    exigir_pagamento_antecipado: false,
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
    bloquear_inadimplente: true,
    dias_tolerancia: 0,
    exigir_pagamento_antecipado: true,
  },
]

export const mockPaymentMethods: PaymentMethod[] = [
  {
    id: 'pm-1',
    tenantId: 't-1',
    nome: 'Cartão via Gateway',
    tipo: 'credit_card',
    online: true,
    gera_taxa: true,
    ativo: true,
  },
  {
    id: 'pm-2',
    tenantId: 't-1',
    nome: 'PIX via Gateway',
    tipo: 'pix_gateway',
    online: true,
    gera_taxa: true,
    ativo: true,
  },
  {
    id: 'pm-3',
    tenantId: 't-1',
    nome: 'Boleto',
    tipo: 'boleto',
    online: true,
    gera_taxa: true,
    ativo: true,
  },
  {
    id: 'pm-4',
    tenantId: 't-1',
    nome: 'PIX Manual',
    tipo: 'pix_manual',
    online: false,
    gera_taxa: false,
    ativo: true,
  },
  {
    id: 'pm-5',
    tenantId: 't-1',
    nome: 'Dinheiro',
    tipo: 'cash',
    online: false,
    gera_taxa: false,
    ativo: true,
  },
  {
    id: 'pm-6',
    tenantId: 't-1',
    nome: 'Transferência',
    tipo: 'transfer',
    online: false,
    gera_taxa: false,
    ativo: true,
  },
  {
    id: 'pm-7',
    tenantId: 't-1',
    nome: 'Permuta',
    tipo: 'barter',
    online: false,
    gera_taxa: false,
    ativo: true,
  },
]

export const mockPermutas: Permuta[] = [
  {
    id: 'perm-1',
    tenantId: 't-1',
    alunoId: 'stu-2',
    valor_equivalente: 150,
    descricao: 'Serviço de design gráfico',
    data: today,
  },
]

export const mockPayments: Payment[] = [
  {
    id: 'pay-1',
    tenantId: 't-1',
    alunoId: 'stu-1',
    descricao: 'Mensalidade Padrão',
    valorPago: 350,
    valor_recebido: 350,
    saldo_restante: 0,
    dataVencimento: `${currentMonth}-05`,
    dataPagamento: `${currentMonth}-05`,
    status: 'paid',
    recorrente: true,
    gateway: 'stripe',
    tipo: 'subscription',
    online: true,
    forma_pagamento_id: 'pm-1',
  },
  {
    id: 'pay-2',
    tenantId: 't-1',
    alunoId: 'stu-2',
    descricao: 'Avaliação Física',
    valorPago: 150,
    saldo_restante: 150,
    dataVencimento: today,
    status: 'pending',
    recorrente: false,
    gateway: 'pagarme',
    tipo: 'one_off',
  },
]

export const mockSubscriptions: Subscription[] = [
  {
    id: 'sub-1',
    tenantId: 't-1',
    alunoId: 'stu-1',
    gateway: 'stripe',
    gateway_subscription_id: 'sub_mock123',
    valor: 350,
    periodicidade: 'monthly',
    status: 'active',
    proxima_cobranca: `${new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().slice(0, 10)}`,
  },
]

export const mockGatewayConfigs: GatewayConfig[] = [
  {
    tenantId: 't-1',
    gateway: 'stripe',
    isActive: true,
    splitMode: 'simple',
    publicKey: 'pk_test_mock_123',
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

const generateMockAgenda = () => {
  const now = new Date()
  const start = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 17, now.getUTCDate()),
  )
  const end = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, now.getUTCDate()),
  )

  let counter = 100
  for (let d = new Date(start); d <= end; d.setUTCDate(d.getUTCDate() + 1)) {
    const dayOfWeek = d.getUTCDay()
    if (dayOfWeek === 0) continue

    const dateStr = d.toISOString().slice(0, 10)
    const isPast = dateStr < today

    for (let h = 6; h <= 21; h++) {
      if (Math.random() < 0.75) {
        if (dateStr === today && (h === 8 || h === 9 || h === 12)) continue

        const studentId = Math.random() > 0.5 ? 'stu-1' : 'stu-2'
        const locationId = Math.random() > 0.5 ? 'loc-1' : 'loc-2'

        let status: AgendaEvent['status'] = 'scheduled'
        if (isPast) {
          const r = Math.random()
          if (r < 0.85) status = 'performed'
          else if (r < 0.95) status = 'canceled_student'
          else status = 'no_show'
        } else {
          status = Math.random() > 0.6 ? 'confirmed' : 'scheduled'
        }

        const value = studentId === 'stu-1' ? 120 : 150
        const splitValue = locationId === 'loc-1' ? value * 0.3 : 50
        const netValue = value - splitValue

        mockEvents.push({
          id: `evt-gen-${counter++}`,
          tenantId: 't-1',
          userId: 'u-prof1',
          studentId,
          locationId,
          title: studentId === 'stu-1' ? 'Sessão Carlos' : 'Sessão Ana',
          date: dateStr,
          startTime: `${h.toString().padStart(2, '0')}:00`,
          endTime: `${(h + 1).toString().padStart(2, '0')}:00`,
          type: 'session',
          status,
          value,
          splitValue,
          netValue,
        })
      }
    }
  }
}

generateMockAgenda()

export const mockAnalyticsAgenda: AnalyticsAgenda[] = []
for (let d = 1; d <= 5; d++) {
  for (let h = 6; h <= 21; h++) {
    const isMorningPeak = h >= 6 && h <= 9
    const isEveningPeak = h >= 17 && h <= 20
    const isDeadZone = h >= 10 && h <= 14

    let ocup = 0.5
    let taxa = 0.8

    if (isMorningPeak || isEveningPeak) {
      ocup = 0.85 + Math.random() * 0.15
      taxa = 0.85 + Math.random() * 0.15
    } else if (isDeadZone) {
      ocup = 0.1 + Math.random() * 0.3
      taxa = 0.6 + Math.random() * 0.2
    } else {
      ocup = 0.4 + Math.random() * 0.4
      taxa = 0.7 + Math.random() * 0.2
    }

    ocup = Math.min(Math.max(ocup, 0), 1)
    taxa = Math.min(Math.max(taxa, 0), 1)

    mockAnalyticsAgenda.push({
      id: `ana-${d}-${h}`,
      tenantId: 't-1',
      userId: 'u-prof1',
      dia_semana: d,
      faixa_horaria: `${h.toString().padStart(2, '0')}:00`,
      receita_bruta: ocup * 1500,
      receita_liquida: ocup * 1200,
      taxa_comparecimento: taxa,
      ocupacao_percentual: ocup,
    })
  }
}

export const mockAcademyContents: AcademyContent[] = [
  {
    id: 'ac-1',
    tenantId: 't-1',
    type: 'course',
    title: 'Biomecânica Aplicada',
    description:
      'Entenda os princípios biomecânicos essenciais para otimização de hipertrofia e prevenção de lesões.',
    category: 'Técnico',
    instructor: 'Dr. Paulo Alves',
    instructorId: 'u-instr1',
    workload: 40,
    format: 'ead',
    isFree: false,
    price: 299.9,
    targetAudience: 'Profissionais de Ed. Física',
    prerequisites: 'Anatomia básica',
    thumbnailUrl:
      'https://img.usecurling.com/p/400/250?q=fitness%20class&color=blue',
    capacity: 0,
    enrolledCount: 150,
    averageRating: 4.8,
    nps: 85,
    revenue: 44985,
    modules: [
      {
        id: 'm1',
        title: 'Módulo 1: Introdução à Biomecânica',
        lessons: [
          {
            id: 'l1',
            title: 'O que é Biomecânica',
            type: 'video',
            duration: 15,
          },
          { id: 'l2', title: 'Apostila de Apoio', type: 'pdf', duration: 30 },
        ],
      },
      {
        id: 'm2',
        title: 'Módulo 2: Membros Superiores',
        lessons: [
          { id: 'l3', title: 'Análise do Supino', type: 'video', duration: 25 },
        ],
      },
    ],
  },
  {
    id: 'ac-2',
    tenantId: 't-1',
    type: 'mentorship',
    title: 'Mentoria: Captação de Alunos High Ticket',
    description:
      'Descubra as estratégias para atrair, vender e reter alunos de alto valor no digital e presencial.',
    category: 'Marketing',
    instructor: 'Carlos Sales',
    instructorId: 'u-instr1',
    workload: 2,
    format: 'live',
    isFree: true,
    price: 0,
    targetAudience: 'Personal Trainers',
    prerequisites: 'Nenhum',
    thumbnailUrl:
      'https://img.usecurling.com/p/400/250?q=laptop%20meeting&color=orange',
    enrolledCount: 45,
    date: new Date().toISOString().slice(0, 10),
    time: '20:00',
    link: 'https://zoom.us/mock',
  },
  {
    id: 'ac-3',
    tenantId: 't-1',
    type: 'event',
    title: 'Workshop Prático de LPO',
    description:
      'Aprenda as técnicas fundamentais do Levantamento de Peso Olímpico na prática.',
    category: 'Prático',
    instructor: 'Coach Fernando',
    instructorId: 'u-instr1',
    workload: 8,
    format: 'hybrid',
    isFree: false,
    price: 150,
    targetAudience: 'Treinadores e Praticantes',
    prerequisites: 'Nenhum',
    thumbnailUrl:
      'https://img.usecurling.com/p/400/250?q=weightlifting&color=red',
    capacity: 30,
    enrolledCount: 28,
    date: '2025-11-15',
    time: '09:00',
  },
  {
    id: 'ac-4',
    tenantId: 't-1',
    type: 'course',
    title: 'Gestão Financeira para Personais',
    description:
      'Aprenda a precificar suas aulas, gerenciar custos e aumentar seu lucro líquido mensal.',
    category: 'Gestão',
    instructor: 'Ana Silva',
    instructorId: 'u-instr1',
    workload: 10,
    format: 'ead',
    isFree: true,
    price: 0,
    targetAudience: 'Iniciantes',
    prerequisites: 'Nenhum',
    thumbnailUrl:
      'https://img.usecurling.com/p/400/250?q=finance%20chart&color=green',
    capacity: 0,
    enrolledCount: 320,
    averageRating: 4.5,
    nps: 70,
    revenue: 0,
    modules: [
      {
        id: 'm1',
        title: 'Módulo Único',
        lessons: [
          {
            id: 'l1',
            title: 'Precificação Inteligente',
            type: 'video',
            duration: 45,
          },
        ],
      },
    ],
  },
]

export const mockAcademyEnrollments: AcademyEnrollment[] = [
  {
    id: 'enr-1',
    tenantId: 't-1',
    userId: 'u-prof1',
    contentId: 'ac-4',
    progress: 50,
    status: 'active',
    enrolledAt: '2023-09-01T10:00:00Z',
  },
]

export const mockAcademyCertificates: AcademyCertificate[] = []

export const mockAcademyPaths: AcademyPath[] = [
  {
    id: 'path-1',
    tenantId: 't-1',
    title: 'Trilha Gestão para Personal',
    description: 'Domine a parte financeira, captação e gestão do seu negócio.',
    thumbnailUrl:
      'https://img.usecurling.com/p/400/250?q=office%20desk&color=cyan',
    courseIds: ['ac-4', 'ac-2'],
    badgeId: 'badge-gestao',
  },
  {
    id: 'path-2',
    tenantId: 't-1',
    title: 'Trilha Especialista Técnico',
    description:
      'Aprofunde-se em biomecânica e metodologias avançadas de treinamento.',
    thumbnailUrl:
      'https://img.usecurling.com/p/400/250?q=gym%20training&color=purple',
    courseIds: ['ac-1', 'ac-3'],
    badgeId: 'badge-tecnico',
  },
]

export const mockGamificationProfiles: GamificationProfile[] = [
  {
    userId: 'u-prof1',
    tenantId: 't-1',
    points: 1250,
    level: 4,
    badges: [
      {
        id: 'b-1',
        name: 'Iniciante Curioso',
        iconUrl: 'https://img.usecurling.com/i?q=star&shape=fill&color=yellow',
        earnedAt: '2023-01-10T10:00:00Z',
      },
    ],
  },
  {
    userId: 'u-stu1',
    tenantId: 't-1',
    points: 800,
    level: 2,
    badges: [],
  },
  {
    userId: 'u-stu2',
    tenantId: 't-1',
    points: 2100,
    level: 7,
    badges: [
      {
        id: 'badge-gestao',
        name: 'Gestor Expert',
        iconUrl:
          'https://img.usecurling.com/i?q=briefcase&shape=fill&color=blue',
        earnedAt: '2023-05-10T10:00:00Z',
      },
    ],
  },
]

export const mockCourseEvaluations: CourseEvaluation[] = [
  {
    id: 'eval-1',
    contentId: 'ac-1',
    userId: 'u-prof1',
    rating: 5,
    feedback: 'Excelente curso, mudou minha forma de prescrever.',
    createdAt: '2023-10-01T10:00:00Z',
  },
  {
    id: 'eval-2',
    contentId: 'ac-4',
    userId: 'u-stu2',
    rating: 4,
    feedback: 'Muito bom, mas poderia ter mais planilhas de exemplo.',
    createdAt: '2023-10-05T10:00:00Z',
  },
]

export const mockCommunityPosts: CommunityPost[] = [
  {
    id: 'post-1',
    tenantId: 't-1',
    authorId: 'u-prof1',
    courseId: 'ac-1',
    title: 'Dúvida sobre alavancas musculares',
    content:
      'No módulo 1, fiquei confuso sobre a vantagem mecânica do bíceps. Alguém pode explicar?',
    createdAt: '2023-11-01T14:00:00Z',
    isResolved: true,
    likes: 5,
    replies: [
      {
        id: 'reply-1',
        authorId: 'u-instr1',
        content: 'Claro! A vantagem mecânica ocorre porque o braço de força...',
        createdAt: '2023-11-01T15:30:00Z',
        isBestAnswer: true,
        likes: 12,
      },
    ],
  },
  {
    id: 'post-2',
    tenantId: 't-1',
    authorId: 'u-stu2',
    title: 'Dicas para atrair alunos online?',
    content: 'Pessoal, quais estratégias vocês usam no Instagram?',
    createdAt: '2023-11-02T10:00:00Z',
    isResolved: false,
    likes: 8,
    replies: [],
  },
]

export const mockSocialPosts: SocialPost[] = [
  {
    id: 'sp-1',
    tenantId: 't-1',
    authorId: 'u-prof1',
    content:
      'Treino em grupo hoje foi sensacional! Parabéns a todos pelo foco e dedicação. 💪🔥',
    imageUrl: 'https://img.usecurling.com/p/800/600?q=gym%20group&color=blue',
    likes: ['u-stu1', 'u-stu2'],
    reactions: [
      { userId: 'u-stu1', type: 'fire' },
      { userId: 'u-stu2', type: 'party' },
    ],
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    comments: [
      {
        id: 'sc-1',
        authorId: 'u-stu1',
        content: 'Foi incrível mesmo! Que venha o próximo.',
        createdAt: new Date(Date.now() - 1800000).toISOString(),
      },
    ],
  },
  {
    id: 'sp-2',
    tenantId: 't-1',
    authorId: 'u-stu2',
    content:
      'Bati meu PR no agachamento! Muito feliz com a evolução nesses últimos meses de consultoria.',
    likes: ['u-prof1'],
    reactions: [{ userId: 'u-prof1', type: 'thumbs_up' }],
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    comments: [],
  },
]

const generateHistoricalPosts = () => {
  const posts: SocialPost[] = []
  const now = new Date()
  const reactionTypes: ('heart' | 'fire' | 'thumbs_up' | 'party')[] = [
    'heart',
    'fire',
    'thumbs_up',
    'party',
  ]
  const authors = [
    'u-prof1',
    'u-stu1',
    'u-stu2',
    'u-instr1',
    'u-master',
    'u-admin1',
  ]
  const queries = [
    'workout',
    'gym',
    'fitness',
    'running',
    'weights',
    'healthy',
    'protein',
  ]
  const contents = [
    'Mais um dia de treino concluído! 💪',
    'Foco no objetivo! Hoje foi dia de pernas.',
    'Alimentação em dia, treino em dia. Vamos pra cima!',
    'Check-in feito! Muito suor e dedicação.',
    'Alguém mais com dor muscular pós treino de ontem? 😅',
    'Sextou com treino pesado!',
    'Bati meu recorde pessoal no supino hoje!',
    'A evolução é lenta, mas vale a pena.',
    'Aquele pós-treino merecido!',
    'Preparação para a corrida de fim de semana.',
  ]

  for (let i = 0; i < 40; i++) {
    const daysAgo = Math.floor(Math.random() * 180) + 1
    const date = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000)
    const authorId = authors[Math.floor(Math.random() * authors.length)]

    const hasImage = Math.random() > 0.6
    const query = queries[Math.floor(Math.random() * queries.length)]

    const reactions: SocialReaction[] = []
    const likes: string[] = []

    const numReactions = Math.floor(Math.random() * 5)
    for (let j = 0; j < numReactions; j++) {
      const rAuthor = authors[Math.floor(Math.random() * authors.length)]
      if (!likes.includes(rAuthor)) {
        likes.push(rAuthor)
        reactions.push({
          userId: rAuthor,
          type: reactionTypes[Math.floor(Math.random() * reactionTypes.length)],
        })
      }
    }

    const comments: SocialComment[] = []
    const numComments = Math.floor(Math.random() * 4)
    for (let k = 0; k < numComments; k++) {
      const cAuthor = authors[Math.floor(Math.random() * authors.length)]
      comments.push({
        id: `sc-hist-${i}-${k}`,
        authorId: cAuthor,
        content: [
          'Boa!',
          'Pra cima!',
          'Isso aí!',
          'Inspirador!',
          'Foguete não tem ré! 🚀',
          'Muito bom!',
          'Exemplo!',
        ][Math.floor(Math.random() * 7)],
        createdAt: new Date(date.getTime() + (k + 1) * 3600000).toISOString(),
      })
    }

    posts.push({
      id: `sp-hist-${i}`,
      tenantId: 't-1',
      authorId,
      content: contents[Math.floor(Math.random() * contents.length)],
      imageUrl: hasImage
        ? `https://img.usecurling.com/p/800/600?q=${query}&seed=${i}`
        : undefined,
      likes,
      reactions,
      createdAt: date.toISOString(),
      comments,
    })
  }
  return posts.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  )
}

mockSocialPosts.push(...generateHistoricalPosts())

export const mockStories: Story[] = [
  {
    id: 'st-1',
    tenantId: 't-1',
    authorId: 'u-prof1',
    imageUrl: 'https://img.usecurling.com/p/400/800?q=gym%20selfie',
    createdAt: new Date().toISOString(),
    viewed: false,
  },
  {
    id: 'st-2',
    tenantId: 't-1',
    authorId: 'u-stu1',
    imageUrl: 'https://img.usecurling.com/p/400/800?q=healthy%20food',
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    viewed: true,
  },
  {
    id: 'st-3',
    tenantId: 't-1',
    authorId: 'u-stu2',
    imageUrl: 'https://img.usecurling.com/p/400/800?q=running%20shoes',
    createdAt: new Date(Date.now() - 7200000).toISOString(),
    viewed: false,
  },
]

export const mockDirectMessages: DirectMessage[] = [
  {
    id: 'dm-1',
    tenantId: 't-1',
    senderId: 'u-stu1',
    receiverId: 'u-prof1',
    content: 'Professor, posso trocar o treino de hoje?',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    read: true,
  },
  {
    id: 'dm-2',
    tenantId: 't-1',
    senderId: 'u-prof1',
    receiverId: 'u-stu1',
    content: 'Claro, coloquei um treino alternativo no app.',
    createdAt: new Date(Date.now() - 82800000).toISOString(),
    read: true,
  },
  {
    id: 'dm-3',
    tenantId: 't-1',
    senderId: 'u-stu2',
    receiverId: 'u-prof1',
    content: 'Bom dia! A academia hoje fecha mais cedo?',
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    read: false,
  },
]

export const mockAuditLogsData: AuditLog[] = []

export const mockSurveys: Survey[] = [
  {
    id: 'surv-1',
    tenantId: 't-1',
    title: 'Satisfação Geral - 2024',
    description: 'Como está sendo sua experiência até agora?',
    type: 'satisfaction',
    status: 'active',
    questions: [
      {
        id: 'q1',
        type: 'rating',
        text: 'Atendimento do profissional',
        scale: 5,
      },
      { id: 'q2', type: 'text', text: 'Sugestões de melhoria?' },
    ],
    createdAt: '2023-10-01T10:00:00Z',
  },
  {
    id: 'surv-2',
    tenantId: 't-1',
    title: 'NPS Trimestral',
    description: 'Queremos saber se você nos recomendaria.',
    type: 'nps',
    status: 'active',
    questions: [
      {
        id: 'q1',
        type: 'nps',
        text: 'De 0 a 10, o quanto recomendaria nossos serviços?',
        scale: 10,
      },
      { id: 'q2', type: 'text', text: 'Qual o principal motivo da sua nota?' },
    ],
    createdAt: '2023-11-01T10:00:00Z',
  },
]

export const mockSurveyResponses: SurveyResponse[] = [
  {
    id: 'sr-1',
    tenantId: 't-1',
    surveyId: 'surv-2',
    studentId: 'stu-1',
    answers: [
      { questionId: 'q1', value: 9 },
      { questionId: 'q2', value: 'Ótimos resultados nos treinos.' },
    ],
    createdAt: '2023-11-05T10:00:00Z',
  },
]

export const themeOptions = {
  blue: { primary: '221.2 83.2% 53.3%', secondary: '210 40% 96.1%' },
  emerald: { primary: '142.1 76.2% 36.3%', secondary: '149.3 80.4% 90%' },
  rose: { primary: '346.8 77.2% 49.8%', secondary: '355.7 100% 97.3%' },
  amber: { primary: '37.7 92.1% 50.2%', secondary: '48 96.5% 89%' },
  slate: { primary: '222.2 47.4% 11.2%', secondary: '210 40% 96.1%' },
}
