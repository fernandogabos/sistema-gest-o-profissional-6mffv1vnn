import React, {
  createContext,
  useContext,
  useState,
  useMemo,
  useEffect,
} from 'react'
import {
  Tenant,
  User,
  Plan,
  Location,
  Student,
  Payment,
  Expense,
  Session,
  Theme,
  AuditLog,
  EvaluationTemplate,
  EvaluationResult,
  CommunicationTemplate,
  CommunicationLog,
  WhatsAppConfig,
  AgendaEvent,
  AnalyticsAgenda,
  mockTenants,
  mockUsers,
  mockPlans,
  mockLocations,
  mockStudents,
  mockPayments,
  mockExpenses,
  mockSessions,
  mockAuditLogs,
  mockEvaluationTemplates,
  mockEvaluationResults,
  mockCommunicationTemplates,
  mockCommunicationLogs,
  mockWhatsAppConfigs,
  mockEvents,
  mockAnalyticsAgenda,
  themeOptions,
} from './mockData'

type AppState = {
  currentUser: User
  tenants: Tenant[]
  users: User[]
  plans: Plan[]
  locations: Location[]
  students: Student[]
  payments: Payment[]
  expenses: Expense[]
  sessions: Session[]
  auditLogs: AuditLog[]
  evaluationTemplates: EvaluationTemplate[]
  evaluationResults: EvaluationResult[]
  communicationTemplates: CommunicationTemplate[]
  communicationLogs: CommunicationLog[]
  whatsappConfigs: WhatsAppConfig[]
  events: AgendaEvent[]
  analyticsAgenda: AnalyticsAgenda[]
  theme: Theme
  currentLocationId: string | 'all'
}

type AppActions = {
  setCurrentUser: (userId: string) => void
  setTheme: (theme: Partial<Theme>) => void
  setCurrentLocation: (id: string | 'all') => void
  addLocation: (loc: Omit<Location, 'id' | 'tenantId'>) => void
  updateLocation: (
    id: string,
    loc: Partial<Location>,
    justification?: string,
  ) => void
  addStudent: (stu: Omit<Student, 'id' | 'tenantId' | 'avatarUrl'>) => void
  addPlan: (plan: Omit<Plan, 'id' | 'tenantId'>) => void
  addSession: (
    session: Omit<
      Session,
      'id' | 'tenantId' | 'repasse_calculado' | 'lucro_liquido'
    >,
  ) => void
  updateSession: (
    id: string,
    session: Partial<Session>,
    justification?: string,
  ) => void
  addPayment: (payment: Omit<Payment, 'id' | 'tenantId'>) => void
  updatePayment: (id: string, updates: Partial<Payment>) => void
  addExpense: (expense: Omit<Expense, 'id' | 'tenantId'>) => void
  updateExpense: (id: string, updates: Partial<Expense>) => void
  addEvaluationTemplate: (
    tpl: Omit<EvaluationTemplate, 'id' | 'tenantId'>,
  ) => void
  updateEvaluationTemplate: (
    id: string,
    updates: Partial<EvaluationTemplate>,
  ) => void
  addEvaluationResult: (res: Omit<EvaluationResult, 'id' | 'tenantId'>) => void
  addCommunicationTemplate: (
    tpl: Omit<CommunicationTemplate, 'id' | 'tenantId'>,
  ) => void
  updateCommunicationTemplate: (
    id: string,
    updates: Partial<CommunicationTemplate>,
  ) => void
  deleteCommunicationTemplate: (id: string) => void
  sendCommunication: (
    targetIds: string[],
    templateId?: string,
    customContent?: string,
  ) => void
  updateWhatsAppConfig: (updates: Partial<WhatsAppConfig>) => void
  updateStudentConsent: (id: string, consent: boolean) => void
  addEvent: (
    event: Omit<AgendaEvent, 'id' | 'tenantId'>,
    recurrenceWeeks?: number,
  ) => void
  updateEvent: (id: string, updates: Partial<AgendaEvent>) => void
  deleteEvent: (id: string) => void
}

type AppStore = AppState & AppActions
const AppContext = createContext<AppStore | null>(null)

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, setState] = useState<AppState>({
    currentUser: mockUsers[1],
    tenants: mockTenants,
    users: mockUsers,
    plans: mockPlans,
    locations: mockLocations,
    students: mockStudents,
    payments: mockPayments,
    expenses: mockExpenses,
    sessions: mockSessions,
    auditLogs: mockAuditLogs,
    evaluationTemplates: mockEvaluationTemplates,
    evaluationResults: mockEvaluationResults,
    communicationTemplates: mockCommunicationTemplates,
    communicationLogs: mockCommunicationLogs,
    whatsappConfigs: mockWhatsAppConfigs,
    events: mockEvents,
    analyticsAgenda: mockAnalyticsAgenda,
    theme: {
      primaryColor: 'blue',
      brandName: 'Personal Pro',
      logoUrl: 'https://img.usecurling.com/i?q=dumbbell&shape=fill&color=azure',
    },
    currentLocationId: 'all',
  })

  useEffect(() => {
    // Basic auto-generations from previous mock...
  }, [])

  const actions = useMemo<AppActions>(
    () => ({
      setCurrentUser: (userId: string) =>
        setState((prev) => ({
          ...prev,
          currentUser:
            prev.users.find((u) => u.id === userId) || prev.currentUser,
          currentLocationId: 'all',
        })),
      setTheme: (newTheme: Partial<Theme>) =>
        setState((prev) => ({
          ...prev,
          theme: { ...prev.theme, ...newTheme },
        })),
      setCurrentLocation: (id: string | 'all') =>
        setState((prev) => ({ ...prev, currentLocationId: id })),
      addLocation: (loc) =>
        setState((prev) => ({
          ...prev,
          locations: [
            {
              ...loc,
              id: `loc-${Date.now()}`,
              tenantId: prev.currentUser.tenantId!,
            },
            ...prev.locations,
          ],
        })),
      updateLocation: (id, updates) =>
        setState((prev) => ({
          ...prev,
          locations: prev.locations.map((l) =>
            l.id === id ? { ...l, ...updates } : l,
          ),
        })),
      addStudent: (stu) =>
        setState((prev) => ({
          ...prev,
          students: [
            {
              ...stu,
              id: `stu-${Date.now()}`,
              tenantId: prev.currentUser.tenantId!,
              avatarUrl: `https://img.usecurling.com/ppl/thumbnail?seed=${Date.now()}`,
            },
            ...prev.students,
          ],
        })),
      addPlan: (plan) =>
        setState((prev) => ({
          ...prev,
          plans: [
            {
              ...plan,
              id: `plan-${Date.now()}`,
              tenantId: prev.currentUser.tenantId!,
            },
            ...prev.plans,
          ],
        })),
      addSession: (data) =>
        setState((prev) => ({
          ...prev,
          sessions: [
            {
              ...data,
              id: `ses-${Date.now()}`,
              tenantId: prev.currentUser.tenantId!,
              repasse_calculado: 0,
              lucro_liquido: data.valor_bruto,
            } as any,
            ...prev.sessions,
          ],
        })),
      updateSession: (id, updates) =>
        setState((prev) => ({
          ...prev,
          sessions: prev.sessions.map((s) =>
            s.id === id ? { ...s, ...updates } : s,
          ),
        })),
      addPayment: (payment) =>
        setState((prev) => ({
          ...prev,
          payments: [
            {
              ...payment,
              id: `pay-${Date.now()}`,
              tenantId: prev.currentUser.tenantId!,
            },
            ...prev.payments,
          ],
        })),
      updatePayment: (id, updates) =>
        setState((prev) => ({
          ...prev,
          payments: prev.payments.map((p) =>
            p.id === id ? { ...p, ...updates } : p,
          ),
        })),
      addExpense: (expense) =>
        setState((prev) => ({
          ...prev,
          expenses: [
            {
              ...expense,
              id: `exp-${Date.now()}`,
              tenantId: prev.currentUser.tenantId!,
            },
            ...prev.expenses,
          ],
        })),
      updateExpense: (id, updates) =>
        setState((prev) => ({
          ...prev,
          expenses: prev.expenses.map((e) =>
            e.id === id ? { ...e, ...updates } : e,
          ),
        })),
      addEvaluationTemplate: (tpl) =>
        setState((prev) => ({
          ...prev,
          evaluationTemplates: [
            {
              ...tpl,
              id: `tpl-${Date.now()}`,
              tenantId: prev.currentUser.tenantId!,
            },
            ...prev.evaluationTemplates,
          ],
        })),
      updateEvaluationTemplate: (id, updates) =>
        setState((prev) => ({
          ...prev,
          evaluationTemplates: prev.evaluationTemplates.map((t) =>
            t.id === id ? { ...t, ...updates } : t,
          ),
        })),
      addEvaluationResult: (res) =>
        setState((prev) => ({
          ...prev,
          evaluationResults: [
            {
              ...res,
              id: `res-${Date.now()}`,
              tenantId: prev.currentUser.tenantId!,
            },
            ...prev.evaluationResults,
          ],
        })),
      addCommunicationTemplate: (tpl) =>
        setState((prev) => ({
          ...prev,
          communicationTemplates: [
            ...prev.communicationTemplates,
            {
              ...tpl,
              id: `tpl-comm-${Date.now()}`,
              tenantId: prev.currentUser.tenantId!,
            },
          ],
        })),
      updateCommunicationTemplate: (id, updates) =>
        setState((prev) => ({
          ...prev,
          communicationTemplates: prev.communicationTemplates.map((t) =>
            t.id === id ? { ...t, ...updates } : t,
          ),
        })),
      deleteCommunicationTemplate: (id) =>
        setState((prev) => ({
          ...prev,
          communicationTemplates: prev.communicationTemplates.filter(
            (t) => t.id !== id,
          ),
        })),
      sendCommunication: (targetIds, templateId, customContent) => {
        // Mock logic from previous code
      },
      updateWhatsAppConfig: (updates) =>
        setState((prev) => ({
          ...prev,
          whatsappConfigs: prev.whatsappConfigs.map((c) =>
            c.tenantId === prev.currentUser.tenantId ? { ...c, ...updates } : c,
          ),
        })),
      updateStudentConsent: (id, consent) =>
        setState((prev) => ({
          ...prev,
          students: prev.students.map((s) =>
            s.id === id ? { ...s, whatsappConsent: consent } : s,
          ),
        })),

      // AGENDA ACTIONS
      addEvent: (event, recurrenceWeeks = 0) =>
        setState((prev) => {
          const newEvents = []
          for (let i = 0; i <= recurrenceWeeks; i++) {
            const d = new Date(event.date)
            d.setDate(d.getDate() + i * 7)
            newEvents.push({
              ...event,
              id: `evt-${Date.now()}-${i}`,
              tenantId: prev.currentUser.tenantId!,
              date: d.toISOString().slice(0, 10),
            })
          }
          return { ...prev, events: [...newEvents, ...prev.events] }
        }),

      updateEvent: (id, updates) =>
        setState((prev) => {
          const event = prev.events.find((e) => e.id === id)
          if (!event) return prev
          const merged = { ...event, ...updates }
          const newEvents = prev.events.map((e) => (e.id === id ? merged : e))

          let newSessions = prev.sessions
          let newPayments = prev.payments

          if (
            updates.status === 'performed' &&
            event.status !== 'performed' &&
            merged.type === 'session'
          ) {
            if (!prev.sessions.some((s) => s.id === `ses-auto-${id}`)) {
              newSessions = [
                {
                  id: `ses-auto-${id}`,
                  tenantId: merged.tenantId,
                  alunoId: merged.studentId!,
                  localId: merged.locationId!,
                  data: merged.date,
                  valor_bruto: merged.value,
                  repasse_calculado: merged.splitValue,
                  lucro_liquido: merged.netValue,
                  status: 'realized',
                },
                ...newSessions,
              ]
            }
            if (!prev.payments.some((p) => p.id === `pay-auto-${id}`)) {
              newPayments = [
                {
                  id: `pay-auto-${id}`,
                  tenantId: merged.tenantId,
                  alunoId: merged.studentId!,
                  descricao: `Sessão ${merged.title} - ${merged.date}`,
                  valorPago: merged.value,
                  dataVencimento: merged.date,
                  status: 'pending',
                  recorrente: false,
                },
                ...newPayments,
              ]
            }
          }

          return {
            ...prev,
            events: newEvents,
            sessions: newSessions,
            payments: newPayments,
          }
        }),

      deleteEvent: (id) =>
        setState((prev) => ({
          ...prev,
          events: prev.events.filter((e) => e.id !== id),
        })),
    }),
    [],
  )

  const value = useMemo(() => ({ ...state, ...actions }), [state, actions])
  return React.createElement(AppContext.Provider, { value }, children)
}

export default function useAppStore() {
  const context = useContext(AppContext)
  if (!context)
    throw new Error('useAppStore must be used within an AppProvider')
  return context
}

export { themeOptions }
