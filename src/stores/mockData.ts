export type Location = {
  id: string
  name: string
  splitType: 'fixed' | 'percentage'
  splitValue: number
}
export type Student = {
  id: string
  name: string
  plan: string
  status: 'active' | 'inactive'
  locationId: string
  joinDate: string
  avatarUrl: string
}
export type Transaction = {
  id: string
  type: 'income' | 'expense'
  amount: number
  date: string
  locationId: string
  description: string
}
export type Theme = { primaryColor: string; name: string; logoUrl: string }

export const mockLocations: Location[] = [
  {
    id: 'loc-1',
    name: 'Studio Centro',
    splitType: 'percentage',
    splitValue: 30,
  },
  { id: 'loc-2', name: 'Academia FitZ', splitType: 'fixed', splitValue: 1000 },
]

export const mockStudents: Student[] = [
  {
    id: 'stu-1',
    name: 'Carlos Santos',
    plan: 'Mensal',
    status: 'active',
    locationId: 'loc-1',
    joinDate: '2023-01-15',
    avatarUrl: 'https://img.usecurling.com/ppl/thumbnail?gender=male&seed=1',
  },
  {
    id: 'stu-2',
    name: 'Ana Oliveira',
    plan: 'Trimestral',
    status: 'active',
    locationId: 'loc-1',
    joinDate: '2023-03-10',
    avatarUrl: 'https://img.usecurling.com/ppl/thumbnail?gender=female&seed=2',
  },
  {
    id: 'stu-3',
    name: 'Rafael Costa',
    plan: 'Anual',
    status: 'inactive',
    locationId: 'loc-2',
    joinDate: '2022-11-05',
    avatarUrl: 'https://img.usecurling.com/ppl/thumbnail?gender=male&seed=3',
  },
  {
    id: 'stu-4',
    name: 'Mariana Lima',
    plan: 'Mensal',
    status: 'active',
    locationId: 'loc-2',
    joinDate: '2024-01-20',
    avatarUrl: 'https://img.usecurling.com/ppl/thumbnail?gender=female&seed=4',
  },
  {
    id: 'stu-5',
    name: 'Lucas Pereira',
    plan: 'Trimestral',
    status: 'active',
    locationId: 'loc-1',
    joinDate: '2023-08-12',
    avatarUrl: 'https://img.usecurling.com/ppl/thumbnail?gender=male&seed=5',
  },
]

export const mockTransactions: Transaction[] = [
  {
    id: 'txn-1',
    type: 'income',
    amount: 350,
    date: '2024-02-01',
    locationId: 'loc-1',
    description: 'Mensalidade - Carlos',
  },
  {
    id: 'txn-2',
    type: 'income',
    amount: 900,
    date: '2024-02-02',
    locationId: 'loc-1',
    description: 'Trimestral - Ana',
  },
  {
    id: 'txn-3',
    type: 'income',
    amount: 300,
    date: '2024-02-05',
    locationId: 'loc-2',
    description: 'Mensalidade - Mariana',
  },
  {
    id: 'txn-4',
    type: 'expense',
    amount: 150,
    date: '2024-02-10',
    locationId: 'loc-1',
    description: 'Manutenção Equipamentos',
  },
  {
    id: 'txn-5',
    type: 'income',
    amount: 350,
    date: '2024-01-01',
    locationId: 'loc-1',
    description: 'Mensalidade - Carlos',
  },
  {
    id: 'txn-6',
    type: 'income',
    amount: 300,
    date: '2024-01-05',
    locationId: 'loc-2',
    description: 'Mensalidade - Mariana',
  },
]

export const themeOptions = {
  blue: { primary: '221.2 83.2% 53.3%', secondary: '210 40% 96.1%' },
  emerald: { primary: '142.1 76.2% 36.3%', secondary: '149.3 80.4% 90%' },
  rose: { primary: '346.8 77.2% 49.8%', secondary: '355.7 100% 97.3%' },
  amber: { primary: '37.7 92.1% 50.2%', secondary: '48 96.5% 89%' },
  slate: { primary: '222.2 47.4% 11.2%', secondary: '210 40% 96.1%' },
}
