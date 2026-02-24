import React, { createContext, useContext, useState, useMemo } from 'react'
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
  mockTenants,
  mockUsers,
  mockPlans,
  mockLocations,
  mockStudents,
  mockPayments,
  mockExpenses,
  mockSessions,
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
  theme: Theme
  currentLocationId: string | 'all'
}

type AppActions = {
  setCurrentUser: (userId: string) => void
  setTheme: (theme: Partial<Theme>) => void
  setCurrentLocation: (id: string | 'all') => void
  addLocation: (loc: Omit<Location, 'id' | 'tenantId'>) => void
  addStudent: (stu: Omit<Student, 'id' | 'tenantId' | 'avatarUrl'>) => void
  addPlan: (plan: Omit<Plan, 'id' | 'tenantId'>) => void
  addSession: (
    session: Omit<
      Session,
      'id' | 'tenantId' | 'repasseCalculado' | 'lucroLiquido'
    >,
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
    theme: {
      primaryColor: 'blue',
      brandName: 'Personal Pro',
      logoUrl: 'https://img.usecurling.com/i?q=dumbbell&shape=fill&color=azure',
    },
    currentLocationId: 'all',
  })

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
        }))
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
            repasse =
              loc.repasseTipo === 'percentage'
                ? data.valorSessao * (loc.repassePercentual / 100)
                : loc.repasseValorFixo
          }
          const newSession: Session = {
            ...data,
            id: `ses-${Date.now()}`,
            tenantId: prev.currentUser.tenantId!,
            repasseCalculado: repasse,
            lucroLiquido: data.valorSessao - repasse,
          }
          return { ...prev, sessions: [newSession, ...prev.sessions] }
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
