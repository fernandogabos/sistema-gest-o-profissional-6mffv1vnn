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
  mockTenants,
  mockUsers,
  mockPlans,
  mockLocations,
  mockStudents,
  mockPayments,
  mockExpenses,
  mockSessions,
  mockAuditLogs,
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
  addExpense: (expense: Omit<Expense, 'id' | 'tenantId'>) => void
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
    theme: {
      primaryColor: 'blue',
      brandName: 'Personal Pro',
      logoUrl: 'https://img.usecurling.com/i?q=dumbbell&shape=fill&color=azure',
    },
    currentLocationId: 'all',
  })

  // Auto generate monthly expenses for locations with fixed monthly rent
  useEffect(() => {
    setState((prev) => {
      const today = new Date().toISOString().slice(0, 10)
      const currentMonthStr = today.slice(0, 7)
      const newExpenses = [...prev.expenses]

      prev.locations.forEach((loc) => {
        if (
          loc.tipo_repasse === 'monthly' &&
          loc.valor_mensal_fixo > 0 &&
          loc.ativo
        ) {
          const desc = `Aluguel Fixo - ${loc.name}`
          const alreadyBilled = newExpenses.some(
            (e) =>
              e.descricao === desc &&
              e.data.startsWith(currentMonthStr) &&
              e.tenantId === loc.tenantId,
          )
          if (!alreadyBilled) {
            newExpenses.push({
              id: `exp-auto-${Date.now()}-${loc.id}`,
              tenantId: loc.tenantId,
              descricao: desc,
              valor: loc.valor_mensal_fixo,
              data: today,
            })
          }
        }
      })
      if (newExpenses.length > prev.expenses.length) {
        return { ...prev, expenses: newExpenses }
      }
      return prev
    })
  }, [])

  const actions = useMemo<AppActions>(
    () => ({
      setCurrentUser: (userId: string) => {
        setState((prev) => ({
          ...prev,
          currentUser:
            prev.users.find((u) => u.id === userId) || prev.currentUser,
          currentLocationId: 'all',
        }))
      },
      setTheme: (newTheme: Partial<Theme>) => {
        setState((prev) => ({ ...prev, theme: { ...prev.theme, ...newTheme } }))
      },
      setCurrentLocation: (id: string | 'all') => {
        setState((prev) => ({ ...prev, currentLocationId: id }))
      },
      addLocation: (loc) => {
        setState((prev) => {
          const id = `loc-${Date.now()}`
          const log: AuditLog = {
            id: `log-${Date.now()}`,
            tenantId: prev.currentUser.tenantId!,
            action: 'CREATE',
            entityType: 'Location',
            entityId: id,
            details: 'Created new location',
            createdAt: new Date().toISOString(),
          }
          return {
            ...prev,
            locations: [
              { ...loc, id, tenantId: prev.currentUser.tenantId! },
              ...prev.locations,
            ],
            auditLogs: [log, ...prev.auditLogs],
          }
        })
      },
      updateLocation: (id, updates, justification) => {
        setState((prev) => {
          const log: AuditLog = {
            id: `log-${Date.now()}`,
            tenantId: prev.currentUser.tenantId!,
            action: 'UPDATE',
            entityType: 'Location',
            entityId: id,
            details: JSON.stringify(updates),
            justification,
            createdAt: new Date().toISOString(),
          }
          return {
            ...prev,
            locations: prev.locations.map((l) =>
              l.id === id ? { ...l, ...updates } : l,
            ),
            auditLogs: [log, ...prev.auditLogs],
          }
        })
      },
      addStudent: (stu) => {
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
        }))
      },
      addPlan: (plan) => {
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
        }))
      },
      addSession: (data) => {
        setState((prev) => {
          const loc = prev.locations.find((l) => l.id === data.localId)
          let repasse = 0
          if (loc) {
            if (loc.tipo_repasse === 'percentage')
              repasse = data.valor_bruto * (loc.percentual_repasse / 100)
            else if (loc.tipo_repasse === 'fixed')
              repasse = loc.valor_fixo_por_sessao
            else if (loc.tipo_repasse === 'hybrid')
              repasse =
                data.valor_bruto * (loc.percentual_repasse / 100) +
                loc.valor_fixo_por_sessao
            else if (
              loc.tipo_repasse === 'monthly' ||
              loc.tipo_repasse === 'none'
            )
              repasse = 0
          }
          const id = `ses-${Date.now()}`
          const newSession: Session = {
            ...data,
            id,
            tenantId: prev.currentUser.tenantId!,
            repasse_calculado: repasse,
            lucro_liquido: data.valor_bruto - repasse,
          }
          const log: AuditLog = {
            id: `log-${Date.now()}`,
            tenantId: prev.currentUser.tenantId!,
            action: 'CREATE',
            entityType: 'Session',
            entityId: id,
            details: 'Created new session',
            createdAt: new Date().toISOString(),
          }
          return {
            ...prev,
            sessions: [newSession, ...prev.sessions],
            auditLogs: [log, ...prev.auditLogs],
          }
        })
      },
      updateSession: (id, updates, justification) => {
        setState((prev) => {
          const session = prev.sessions.find((s) => s.id === id)
          if (!session) return prev
          const merged = { ...session, ...updates }

          const loc = prev.locations.find((l) => l.id === merged.localId)
          let repasse = 0
          if (loc) {
            if (loc.tipo_repasse === 'percentage')
              repasse = merged.valor_bruto * (loc.percentual_repasse / 100)
            else if (loc.tipo_repasse === 'fixed')
              repasse = loc.valor_fixo_por_sessao
            else if (loc.tipo_repasse === 'hybrid')
              repasse =
                merged.valor_bruto * (loc.percentual_repasse / 100) +
                loc.valor_fixo_por_sessao
            else if (
              loc.tipo_repasse === 'monthly' ||
              loc.tipo_repasse === 'none'
            )
              repasse = 0
          }
          merged.repasse_calculado = repasse
          merged.lucro_liquido = merged.valor_bruto - repasse

          const log: AuditLog = {
            id: `log-${Date.now()}`,
            tenantId: prev.currentUser.tenantId!,
            action: 'UPDATE',
            entityType: 'Session',
            entityId: id,
            details: JSON.stringify(updates),
            justification,
            createdAt: new Date().toISOString(),
          }

          return {
            ...prev,
            sessions: prev.sessions.map((s) => (s.id === id ? merged : s)),
            auditLogs: [log, ...prev.auditLogs],
          }
        })
      },
      addPayment: (payment) => {
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
        }))
      },
      addExpense: (expense) => {
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
        }))
      },
    }),
    [],
  )

  const value = useMemo(() => ({ ...state, ...actions }), [state, actions])

  return React.createElement(AppContext.Provider, { value }, children)
}

export default function useAppStore() {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useAppStore must be used within an AppProvider')
  }
  return context
}

export { themeOptions }
