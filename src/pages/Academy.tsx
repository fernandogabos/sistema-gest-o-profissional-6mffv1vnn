import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { AcademyCourses } from '@/components/academy/AcademyCourses'
import { AcademyLives } from '@/components/academy/AcademyLives'
import { AcademyEvents } from '@/components/academy/AcademyEvents'
import { AcademyCertifications } from '@/components/academy/AcademyCertifications'
import { AcademyDashboard } from '@/components/academy/AcademyDashboard'
import { AcademyPaths } from '@/components/academy/AcademyPaths'
import { AcademyCommunity } from '@/components/academy/AcademyCommunity'
import { AcademyInstructor } from '@/components/academy/AcademyInstructor'
import { AcademyAnalytics } from '@/components/academy/AcademyAnalytics'
import { GraduationCap } from 'lucide-react'
import useAppStore from '@/stores/main'

export default function Academy() {
  const { currentUser } = useAppStore()

  const isMaster = currentUser.role === 'master_admin'
  const isInstructor = currentUser.role === 'instructor' || isMaster

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <GraduationCap className="w-8 h-8 text-primary" /> Academia INNOVA
        </h1>
        <p className="text-muted-foreground mt-1">
          Centro de Desenvolvimento Profissional: Evolua com trilhas, comunidade
          e conquistas.
        </p>
      </div>

      <Tabs defaultValue="dashboard" className="w-full">
        <TabsList className="flex flex-wrap h-auto w-full justify-start gap-1 bg-transparent p-0 mb-6 border-b pb-2 rounded-none">
          <TabsTrigger
            value="dashboard"
            className="data-[state=active]:bg-muted/50 data-[state=active]:shadow-none border border-transparent data-[state=active]:border-border rounded-t-md rounded-b-none"
          >
            Dashboard & Conquistas
          </TabsTrigger>
          <TabsTrigger
            value="paths"
            className="data-[state=active]:bg-muted/50 data-[state=active]:shadow-none border border-transparent data-[state=active]:border-border rounded-t-md rounded-b-none"
          >
            Trilhas Formativas
          </TabsTrigger>
          <TabsTrigger
            value="courses"
            className="data-[state=active]:bg-muted/50 data-[state=active]:shadow-none border border-transparent data-[state=active]:border-border rounded-t-md rounded-b-none"
          >
            Catálogo de Cursos
          </TabsTrigger>
          <TabsTrigger
            value="lives"
            className="data-[state=active]:bg-muted/50 data-[state=active]:shadow-none border border-transparent data-[state=active]:border-border rounded-t-md rounded-b-none"
          >
            Lives & Eventos
          </TabsTrigger>
          <TabsTrigger
            value="certifications"
            className="data-[state=active]:bg-muted/50 data-[state=active]:shadow-none border border-transparent data-[state=active]:border-border rounded-t-md rounded-b-none"
          >
            Meus Certificados
          </TabsTrigger>
          <TabsTrigger
            value="community"
            className="data-[state=active]:bg-muted/50 data-[state=active]:shadow-none border border-transparent data-[state=active]:border-border rounded-t-md rounded-b-none"
          >
            Comunidade
          </TabsTrigger>
          {isInstructor && (
            <TabsTrigger
              value="instructor"
              className="data-[state=active]:bg-primary/10 text-primary data-[state=active]:shadow-none border border-transparent data-[state=active]:border-border rounded-t-md rounded-b-none"
            >
              Área do Instrutor
            </TabsTrigger>
          )}
          {isMaster && (
            <TabsTrigger
              value="analytics"
              className="data-[state=active]:bg-primary/10 text-primary data-[state=active]:shadow-none border border-transparent data-[state=active]:border-border rounded-t-md rounded-b-none"
            >
              Analytics Estratégico
            </TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="dashboard">
          <AcademyDashboard />
        </TabsContent>
        <TabsContent value="paths">
          <AcademyPaths />
        </TabsContent>
        <TabsContent value="courses">
          <AcademyCourses />
        </TabsContent>
        <TabsContent value="lives">
          <div className="grid gap-6">
            <div>
              <h3 className="text-xl font-bold mb-4">
                Mentorias e Aulas ao Vivo
              </h3>
              <AcademyLives />
            </div>
            <div className="border-t pt-6">
              <h3 className="text-xl font-bold mb-4">
                Eventos Presenciais e Híbridos
              </h3>
              <AcademyEvents />
            </div>
          </div>
        </TabsContent>
        <TabsContent value="certifications">
          <AcademyCertifications />
        </TabsContent>
        <TabsContent value="community">
          <AcademyCommunity />
        </TabsContent>
        {isInstructor && (
          <TabsContent value="instructor">
            <AcademyInstructor />
          </TabsContent>
        )}
        {isMaster && (
          <TabsContent value="analytics">
            <AcademyAnalytics />
          </TabsContent>
        )}
      </Tabs>
    </div>
  )
}
