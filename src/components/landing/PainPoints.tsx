import { XCircle, CheckCircle2 } from 'lucide-react'

const points = [
  'Agenda no papel ou WhatsApp',
  'Cobrança manual',
  'Falta de controle financeiro',
  'Cancelamentos frequentes',
  'Dificuldade de crescer',
  'Falta de diferenciação no mercado',
  'Desorganização em múltiplos locais',
]

export function PainPoints() {
  return (
    <section id="audience" className="py-24 bg-muted/40 border-y">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
            Você ainda faz isso manualmente?
          </h2>
          <p className="mt-4 text-xl text-muted-foreground max-w-2xl mx-auto">
            Muitos profissionais perdem horas por semana com tarefas
            operacionais que poderiam ser automatizadas.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16 max-w-5xl mx-auto">
          {points.map((pt, i) => (
            <div
              key={i}
              className="flex items-start gap-4 bg-background p-6 rounded-xl shadow-sm border hover:shadow-md transition-shadow"
            >
              <XCircle className="h-6 w-6 text-destructive shrink-0 mt-0.5" />
              <span className="font-medium text-lg text-foreground">{pt}</span>
            </div>
          ))}
        </div>

        <div className="text-center bg-primary/5 rounded-2xl p-8 max-w-3xl mx-auto border border-primary/10">
          <p className="text-2xl font-bold text-primary flex flex-col sm:flex-row items-center justify-center gap-3">
            <CheckCircle2 className="h-8 w-8" /> Existe uma forma mais
            profissional de trabalhar.
          </p>
        </div>
      </div>
    </section>
  )
}
