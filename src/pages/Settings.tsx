import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import useAppStore, { themeOptions } from '@/stores/main'
import { cn } from '@/lib/utils'
import { Paintbrush, Image as ImageIcon } from 'lucide-react'

export default function Settings() {
  const { theme, setTheme } = useAppStore()
  const { toast } = useToast()

  const handleSave = () => {
    toast({
      title: 'Configurações salvas',
      description: 'A aparência da plataforma foi atualizada.',
    })
  }

  const handleColorChange = (colorKey: keyof typeof themeOptions) => {
    setTheme({ primaryColor: colorKey })
  }

  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Configurações White Label
        </h1>
        <p className="text-muted-foreground mt-1">
          Personalize a aparência da plataforma com sua marca.
        </p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ImageIcon className="h-5 w-5" />
              Identidade Visual
            </CardTitle>
            <CardDescription>
              Configure o nome e a logo do seu negócio.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="brandName">Nome da Marca</Label>
              <Input
                id="brandName"
                value={theme.name}
                onChange={(e) => setTheme({ name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="logoUrl">URL da Logo</Label>
              <Input
                id="logoUrl"
                value={theme.logoUrl}
                onChange={(e) => setTheme({ logoUrl: e.target.value })}
              />
              <p className="text-xs text-muted-foreground">
                Dica: Use uma imagem quadrada ou ícone SVG para melhor ajuste na
                barra lateral.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Paintbrush className="h-5 w-5" />
              Cores do Tema
            </CardTitle>
            <CardDescription>
              Escolha a cor principal para destacar elementos da interface.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4 mt-2">
              {(
                Object.keys(themeOptions) as Array<keyof typeof themeOptions>
              ).map((key) => {
                const isActive = theme.primaryColor === key
                // Convert HSL string to standard CSS readable format for preview
                const bgStyle = {
                  backgroundColor: `hsl(${themeOptions[key].primary})`,
                }

                return (
                  <button
                    key={key}
                    onClick={() => handleColorChange(key)}
                    className={cn(
                      'h-12 w-12 rounded-full border-2 transition-all hover:scale-110 flex items-center justify-center shadow-sm',
                      isActive
                        ? 'border-primary ring-2 ring-primary ring-offset-2'
                        : 'border-transparent',
                    )}
                    style={bgStyle}
                    aria-label={`Select ${key} theme`}
                  >
                    {isActive && (
                      <div className="h-3 w-3 rounded-full bg-white shadow-sm" />
                    )}
                  </button>
                )
              })}
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button onClick={handleSave} size="lg">
            Salvar Configurações
          </Button>
        </div>
      </div>
    </div>
  )
}
