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

export const mockAuditLogs: AuditLog[] = []

export const themeOptions = {
  blue: { primary: '221.2 83.2% 53.3%', secondary: '210 40% 96.1%' },
  emerald: { primary: '142.1 76.2% 36.3%', secondary: '149.3 80.4% 90%' },
  rose: { primary: '346.8 77.2% 49.8%', secondary: '355.7 100% 97.3%' },
  amber: { primary: '37.7 92.1% 50.2%', secondary: '48 96.5% 89%' },
  slate: { primary: '222.2 47.4% 11.2%', secondary: '210 40% 96.1%' },
}
