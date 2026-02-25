import {
  CalendarClock,
  TrendingDown,
  CreditCard,
  Wallet,
  ClipboardCheck,
  Dumbbell,
  GraduationCap,
  Award,
  MessageSquare,
} from 'lucide-react'
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from '@/components/ui/card'

const features = [
  {
    title: 'Agenda inteligente',
    desc: 'Sugestão de encaixe e análise de horários rentáveis.',
    benefit: 'Otimize seu tempo',
    icon: CalendarClock,
  },
  {
    title: 'Previsão de ociosidade',
    desc: 'Antecipação de buracos na agenda.',
    benefit: 'Evite perda de receita',
    icon: TrendingDown,
  },
  {
    title: 'Cobrança integrada',
    desc: 'Suporte para Stripe, Pagar.me e InfinitePay.',
    benefit: 'Receba automaticamente',
    icon: CreditCard,
  },
  {
    title: 'Controle Híbrido',
    desc: 'Gestão de PIX manual, dinheiro e permuta.',
    benefit: 'Flexibilidade financeira',
    icon: Wallet,
  },
  {
    title: 'Avaliações',
    desc: 'Sistema de avaliações físicas e técnicas.',
    benefit: 'Acompanhe evolução',
    icon: ClipboardCheck,
  },
  {
    title: 'Biblioteca de exercícios',
    desc: 'Estrutura completa de treinos.',
    benefit: 'Prescrição rápida',
    icon: Dumbbell,
  },
  {
    title: 'Academia INNOVA',
    desc: 'Centro de desenvolvimento profissional.',
    benefit: 'Evolução contínua',
    icon: GraduationCap,
  },
  {
    title: 'Certificação',
    desc: 'Trilhas formativas e selos de autoridade.',
    benefit: 'Destaque-se no mercado',
    icon: Award,
  },
  {
    title: 'Comunicação',
    desc: 'Integração direta com WhatsApp.',
    benefit: 'Relacionamento próximo',
    icon: MessageSquare,
  },
]

export function Features() {
  return (
    <section id="features" className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            Diferenciais Estratégicos
          </h2>
          <p className="mt-4 text-xl text-muted-foreground max-w-3xl mx-auto">
            Tudo que você precisa para alavancar sua carreira, organizar suas
            finanças e fidelizar seus alunos.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((f, i) => (
            <Card
              key={i}
              className="border-border shadow-sm hover:shadow-md transition-all hover:-translate-y-1 bg-card"
            >
              <CardHeader className="pb-4">
                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <f.icon className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-xl">{f.title}</CardTitle>
                <CardDescription className="text-base mt-2 text-foreground/80">
                  {f.desc}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/5 text-sm font-semibold text-primary">
                  Benefício: {f.benefit}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
