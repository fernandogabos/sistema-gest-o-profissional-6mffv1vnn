import { Check, X } from 'lucide-react'

const benefits = [
  'Aumento de previsibilidade de receita',
  'Redução de inadimplência',
  'Otimização de horários',
  'Maior retenção de alunos',
  'Posicionamento premium',
]

export function Results() {
  return (
    <section id="results" className="py-24 bg-primary text-primary-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            Transforme sua profissão em um negócio estruturado.
          </h2>
          <p className="mt-4 text-xl text-primary-foreground/80 max-w-2xl mx-auto">
            Os números não mentem. Profissionais que utilizam nossa plataforma
            mudam de patamar.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            {benefits.map((b, i) => (
              <div
                key={i}
                className="flex items-center gap-4 bg-primary-foreground/10 p-4 rounded-xl backdrop-blur-sm border border-primary-foreground/10"
              >
                <div className="bg-primary-foreground text-primary p-2 rounded-full shrink-0">
                  <Check className="h-5 w-5" />
                </div>
                <span className="text-xl font-medium">{b}</span>
              </div>
            ))}
          </div>

          <div className="bg-background text-foreground rounded-3xl p-8 shadow-2xl relative">
            <div className="absolute -top-6 -right-6 bg-emerald-500 text-white font-bold px-6 py-2 rounded-full shadow-lg transform rotate-12">
              Resultados Reais
            </div>
            <h3 className="text-2xl font-bold mb-8 text-center border-b pb-4">
              Antes vs. Depois
            </h3>
            <div className="space-y-8">
              <div className="bg-rose-50 dark:bg-rose-950/20 p-6 rounded-xl border border-rose-100 dark:border-rose-900/30">
                <h4 className="flex items-center gap-2 text-rose-600 font-bold mb-3 text-lg">
                  <X className="h-6 w-6" /> Antes da Plataforma
                </h4>
                <p className="text-muted-foreground leading-relaxed">
                  Cobranças esquecidas, alunos desmotivados, agenda com buracos
                  e faturamento estagnado. Você trabalhando muito e ganhando
                  pouco devido à falta de gestão.
                </p>
              </div>
              <div className="bg-emerald-50 dark:bg-emerald-950/20 p-6 rounded-xl border border-emerald-100 dark:border-emerald-900/30">
                <h4 className="flex items-center gap-2 text-emerald-600 font-bold mb-3 text-lg">
                  <Check className="h-6 w-6" /> Depois da Plataforma
                </h4>
                <p className="text-muted-foreground leading-relaxed">
                  Receitas automáticas recorrentes, alunos engajados, agenda
                  100% otimizada e faturamento previsível. Você no total
                  controle do seu negócio.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
