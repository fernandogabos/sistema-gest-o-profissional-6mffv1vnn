import React, { createContext, useContext, useState, useMemo } from 'react'
import {
  Location,
  Student,
  Transaction,
  Theme,
  mockLocations,
  mockStudents,
  mockTransactions,
  themeOptions,
} from './mockData'

type AppState = {
  locations: Location[]
  students: Student[]
  transactions: Transaction[]
  theme: Theme
  currentLocationId: string | 'all'
  userRole: 'professional' | 'student' | 'master'
}

type AppActions = {
  setTheme: (theme: Partial<Theme>) => void
  setCurrentLocation: (id: string | 'all') => void
  addTransaction: (txn: Omit<Transaction, 'id'>) => void
  addStudent: (student: Omit<Student, 'id' | 'joinDate' | 'avatarUrl'>) => void
}

type AppStore = AppState & AppActions

const AppContext = createContext<AppStore | null>(null)

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [locations] = useState<Location[]>(mockLocations)
  const [students, setStudents] = useState<Student[]>(mockStudents)
  const [transactions, setTransactions] =
    useState<Transaction[]>(mockTransactions)
  const [theme, setThemeState] = useState<Theme>({
    primaryColor: 'blue',
    name: 'Personal Pro',
    logoUrl: 'https://img.usecurling.com/i?q=dumbbell&shape=fill&color=azure',
  })
  const [currentLocationId, setCurrentLocation] = useState<string | 'all'>(
    'all',
  )
  const [userRole] = useState<'professional' | 'student' | 'master'>(
    'professional',
  )

  const actions = useMemo(
    () => ({
      setTheme: (newTheme: Partial<Theme>) =>
        setThemeState((prev) => ({ ...prev, ...newTheme })),
      setCurrentLocation,
      addTransaction: (txn: Omit<Transaction, 'id'>) => {
        const newTxn = { ...txn, id: `txn-${Date.now()}` }
        setTransactions((prev) => [newTxn, ...prev])
      },
      addStudent: (student: Omit<Student, 'id' | 'joinDate' | 'avatarUrl'>) => {
        const newStudent: Student = {
          ...student,
          id: `stu-${Date.now()}`,
          joinDate: new Date().toISOString(),
          avatarUrl: `https://img.usecurling.com/ppl/thumbnail?seed=${Date.now()}`,
        }
        setStudents((prev) => [newStudent, ...prev])
      },
    }),
    [],
  )

  const value = useMemo(
    () => ({
      locations,
      students,
      transactions,
      theme,
      currentLocationId,
      userRole,
      ...actions,
    }),
    [
      locations,
      students,
      transactions,
      theme,
      currentLocationId,
      userRole,
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
