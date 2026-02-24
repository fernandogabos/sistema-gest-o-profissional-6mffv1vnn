import { Dumbbell, PlayCircle, Plus } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

const MOCK_EXERCISES = [
  {
    id: 1,
    name: 'Supino Reto',
    group: 'Peito',
    img: 'https://img.usecurling.com/p/300/200?q=bench%20press&color=gray',
  },
  {
    id: 2,
    name: 'Agachamento Livre',
    group: 'Pernas',
    img: 'https://img.usecurling.com/p/300/200?q=squat&color=gray',
  },
  {
    id: 3,
    name: 'Puxada Frontal',
    group: 'Costas',
    img: 'https://img.usecurling.com/p/300/200?q=lat%20pulldown&color=gray',
  },
  {
    id: 4,
    name: 'Desenvolvimento',
    group: 'Ombros',
    img: 'https://img.usecurling.com/p/300/200?q=shoulder%20press&color=gray',
  },
  {
    id: 5,
    name: 'Rosca Direta',
    group: 'Bíceps',
    img: 'https://img.usecurling.com/p/300/200?q=bicep%20curl&color=gray',
  },
  {
    id: 6,
    name: 'Tríceps Testa',
    group: 'Tríceps',
    img: 'https://img.usecurling.com/p/300/200?q=tricep&color=gray',
  },
]

export default function Workouts() {
  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Treinos e Exercícios
          </h1>
          <p className="text-muted-foreground mt-1">
            Construa rotinas e acesse sua biblioteca de movimentos.
          </p>
        </div>
        <Button className="shrink-0">
          <Plus className="mr-2 h-4 w-4" />
          Novo Treino
        </Button>
      </div>

      <Tabs defaultValue="library" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="library">Biblioteca de Exercícios</TabsTrigger>
          <TabsTrigger value="templates">Meus Templates</TabsTrigger>
        </TabsList>

        <TabsContent value="library" className="mt-6 animate-fade-in">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {MOCK_EXERCISES.map((ex) => (
              <Card
                key={ex.id}
                className="overflow-hidden group cursor-pointer hover:shadow-md transition-shadow"
              >
                <div className="relative aspect-video w-full overflow-hidden bg-muted">
                  <img
                    src={ex.img}
                    alt={ex.name}
                    className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <PlayCircle className="text-white h-10 w-10" />
                  </div>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-lg line-clamp-1">
                    {ex.name}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {ex.group}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="templates" className="mt-6 animate-fade-in">
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16 text-center">
              <div className="bg-primary/10 p-4 rounded-full mb-4">
                <Dumbbell className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">
                Nenhum template salvo
              </h3>
              <p className="text-muted-foreground max-w-sm mb-6">
                Crie templates de treinos para facilitar a prescrição para seus
                alunos de forma rápida.
              </p>
              <Button>Criar Primeiro Template</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
