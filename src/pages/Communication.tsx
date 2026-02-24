import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { CommDashboard } from '@/components/communication/CommDashboard'
import { CommBulk } from '@/components/communication/CommBulk'
import { CommTemplates } from '@/components/communication/CommTemplates'
import { CommSettings } from '@/components/communication/CommSettings'

export default function Communication() {
  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Comunicação e Automação
        </h1>
        <p className="text-muted-foreground mt-1">
          Gerencie templates, envie mensagens e configure a integração oficial
          do WhatsApp.
        </p>
      </div>

      <Tabs defaultValue="dashboard" className="w-full">
        <TabsList className="grid w-full grid-cols-4 lg:w-[600px] mb-6">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="bulk">Envio em Massa</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="settings">WhatsApp API</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard">
          <CommDashboard />
        </TabsContent>
        <TabsContent value="bulk">
          <CommBulk />
        </TabsContent>
        <TabsContent value="templates">
          <CommTemplates />
        </TabsContent>
        <TabsContent value="settings">
          <CommSettings />
        </TabsContent>
      </Tabs>
    </div>
  )
}
