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
}

type AppStore = AppState & AppActions

const AppContext = createContext<AppStore | null>(null)

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentUser, setCurrentUserObj] = useState<User>(mockUsers[1]) // Default to professional
  const [tenants] = useState<Tenant[]>(mockTenants)
  const [users] = useState<User[]>(mockUsers)
  const [plans] = useState<Plan[]>(mockPlans)
  const [locations] = useState<Location[]>(mockLocations)
  const [students] = useState<Student[]>(mockStudents)
  const [payments] = useState<Payment[]>(mockPayments)
  const [expenses] = useState<Expense[]>(mockExpenses)
  const [sessions] = useState<Session[]>(mockSessions)
  const [theme, setThemeState] = useState<Theme>({
    primaryColor: 'blue',
    name: 'Personal Pro',
    logoUrl: 'https://img.usecurling.com/i?q=dumbbell&shape=fill&color=azure',
  })
  const [currentLocationId, setCurrentLocation] = useState<string | 'all'>(
    'all',
  )

  const actions = useMemo(
    () => ({
      setCurrentUser: (userId: string) => {
        const user = users.find((u) => u.id === userId)
        if (user) {
          setCurrentUserObj(user)
          setCurrentLocation('all')
        }
      },
      setTheme: (newTheme: Partial<Theme>) =>
        setThemeState((prev) => ({ ...prev, ...newTheme })),
      setCurrentLocation,
    }),
    [users],
  )

  const value = useMemo(
    () => ({
      currentUser,
      tenants,
      users,
      plans,
      locations,
      students,
      payments,
      expenses,
      sessions,
      theme,
      currentLocationId,
      ...actions,
    }),
    [
      currentUser,
      tenants,
      users,
      plans,
      locations,
      students,
      payments,
      expenses,
      sessions,
      theme,
      currentLocationId,
      actions,
    ],
  )

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
