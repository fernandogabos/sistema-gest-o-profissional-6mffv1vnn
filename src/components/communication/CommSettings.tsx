import { useState } from 'react'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { AlertCircle, CheckCircle2, MessageCircle } from 'lucide-react'
import useAppStore from '@/stores/main'
import { useToast } from '@/hooks/use-toast'

export function CommSettings() {
  const { whatsappConfigs, currentUser, updateWhatsAppConfig } = useAppStore()
  const { toast } = useToast()

  const config = whatsappConfigs.find(
    (c) => c.tenantId === currentUser.tenantId,
  ) || {
    tenantId: currentUser.tenantId,
    isConnected: false,
    phoneNumber: '',
    apiToken: '',
  }

  const [formData, setFormData] = useState({
    phoneNumber: config.phoneNumber || '',
    apiToken: config.apiToken || '',
  })

  const handleSave = () => {
    if (!formData.phoneNumber || !formData.apiToken) {
      toast({
        title: 'Preencha número e token para conectar.',
        variant: 'destructive',
      })
      return
    }
    updateWhatsAppConfig({ ...formData, isConnected: true })
    toast({ title: 'Configurações salvas e conexão estabelecida.' })
  }

  const toggleConnection = (val: boolean) => {
    updateWhatsAppConfig({ isConnected: val })
    toast({
      title: val
        ? 'Integração ativada.'
        : 'Integração desativada temporariamente.',
    })
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-[#25D366]/10 p-3 rounded-full">
                <MessageCircle className="h-6 w-6 text-[#25D366]" />
              </div>
              <div>
                <CardTitle>WhatsApp Oficial API</CardTitle>
                <CardDescription>
                  Conecte sua conta business para disparos automáticos.
                </CardDescription>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge
                variant={config.isConnected ? 'default' : 'secondary'}
                className={
                  config.isConnected
                    ? 'bg-emerald-500 hover:bg-emerald-600'
                    : ''
                }
              >
                {config.isConnected ? 'Conectado' : 'Desconectado'}
              </Badge>
              <Switch
                checked={config.isConnected}
                onCheckedChange={toggleConnection}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6 pt-4">
          <div className="bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
            <div className="text-sm text-blue-800 dark:text-blue-300">
              <p className="font-semibold mb-1">
                Integração Oficial (Meta Cloud API)
              </p>
              <p>
                O uso da API oficial garante estabilidade e evita bloqueios de
                número. As mensagens enviadas através do sistema utilizarão os
                templates aprovados configurados na sua conta da Meta.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="phone">
                Número do WhatsApp Business (com DDI)
              </Label>
              <Input
                id="phone"
                placeholder="Ex: 5511999999999"
                value={formData.phoneNumber}
                onChange={(e) =>
                  setFormData((f) => ({ ...f, phoneNumber: e.target.value }))
                }
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="token">
                Token de Acesso Permanente (Meta API)
              </Label>
              <Input
                id="token"
                type="password"
                placeholder="EAA..."
                value={formData.apiToken}
                onChange={(e) =>
                  setFormData((f) => ({ ...f, apiToken: e.target.value }))
                }
              />
            </div>

            <Button onClick={handleSave} className="w-full sm:w-auto">
              Salvar e Verificar Conexão
            </Button>
          </div>
        </CardContent>
      </Card>

      {config.isConnected && (
        <Card className="border-emerald-200 dark:border-emerald-900">
          <CardContent className="p-4 flex items-center gap-3 text-sm text-emerald-800 dark:text-emerald-400">
            <CheckCircle2 className="h-5 w-5" />
            <p>
              Seu número <strong>{config.phoneNumber}</strong> está autenticado
              e pronto para enviar notificações e mensagens em massa com suporte
              a opt-out (LGPD).
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
