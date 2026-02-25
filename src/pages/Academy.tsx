import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { AcademyCourses } from '@/components/academy/AcademyCourses'
import { AcademyLives } from '@/components/academy/AcademyLives'
import { AcademyEvents } from '@/components/academy/AcademyEvents'
import { AcademyCertifications } from '@/components/academy/AcademyCertifications'
import { GraduationCap, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function Academy() {
  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <GraduationCap className="w-8 h-8 text-primary" /> Academia INNOVA
        </h1>
        <p className="text-muted-foreground mt-1">
          Centro de Desenvolvimento Profissional: Evolua suas habilidades
          técnicas e de gestão.
        </p>
      </div>

      <Tabs defaultValue="courses" className="w-full">
        <TabsList className="flex flex-wrap h-auto w-full justify-start gap-1 bg-transparent p-0 mb-6">
          <TabsTrigger
            value="courses"
            className="data-[state=active]:bg-card data-[state=active]:shadow-sm border border-transparent data-[state=active]:border-border"
          >
            Cursos EAD
          </TabsTrigger>
          <TabsTrigger
            value="lives"
            className="data-[state=active]:bg-card data-[state=active]:shadow-sm border border-transparent data-[state=active]:border-border"
          >
            Lives & Mentorias
          </TabsTrigger>
          <TabsTrigger
            value="events"
            className="data-[state=active]:bg-card data-[state=active]:shadow-sm border border-transparent data-[state=active]:border-border"
          >
            Eventos
          </TabsTrigger>
          <TabsTrigger
            value="certifications"
            className="data-[state=active]:bg-card data-[state=active]:shadow-sm border border-transparent data-[state=active]:border-border"
          >
            Certificações
          </TabsTrigger>
          <TabsTrigger
            value="community"
            className="data-[state=active]:bg-card data-[state=active]:shadow-sm border border-transparent data-[state=active]:border-border"
          >
            Comunidade
          </TabsTrigger>
        </TabsList>

        <TabsContent value="courses">
          <AcademyCourses />
        </TabsContent>
        <TabsContent value="lives">
          <AcademyLives />
        </TabsContent>
        <TabsContent value="events">
          <AcademyEvents />
        </TabsContent>
        <TabsContent value="certifications">
          <AcademyCertifications />
        </TabsContent>
        <TabsContent value="community">
          <div className="flex flex-col items-center justify-center p-12 text-center bg-card rounded-lg border">
            <div className="w-16 h-16 bg-primary/10 text-primary flex items-center justify-center rounded-full mb-4">
              <Users className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold mb-2">Comunidade Exclusiva</h3>
            <p className="text-muted-foreground mb-4 max-w-md">
              Interaja com outros profissionais, faça networking, tire dúvidas e
              feche parcerias no nosso hub oficial de comunidade.
            </p>
            <Button>Acessar Fórum da Comunidade</Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
