import { MasterDashboard } from '@/components/dashboard/MasterDashboard'
import { ProfessionalDashboard } from '@/components/dashboard/ProfessionalDashboard'
import useAppStore from '@/stores/main'

export default function Index() {
  const { currentUser } = useAppStore()

  if (currentUser.role === 'master_admin') {
    return <MasterDashboard />
  }

  return <ProfessionalDashboard />
}
