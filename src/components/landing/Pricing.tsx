import { Link } from 'react-router-dom'
import { Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card'

const plans = [
  {
    name: 'Plano Starter',
    desc: 'Para quem está começando a se organizar.',
    price: 'Grátis',
    features: [
      'Agenda inteligente',
      'Cobrança integrada (básico)',
      'Relatórios simplificados',
    ],
    button: 'Começar agora',
    variant: 'outline',
  },
  {
    name: 'Plano Growth',
    desc: 'Para profissionais em crescimento acelerado.',
    price: 'R$ 97/mês',
    features: [
      'Agenda inteligente',
      'Cobrança integrada',
      'Comunidade',
      'Relatórios avançados',
    ],
    button: 'Começar agora',
    variant: 'default',
    popular: true,
  },
  {
    name: 'Plano Pro',
    desc: 'A solução completa para líderes de mercado.',
    price: 'R$ 197/mês',
    features: [
      'Agenda inteligente',
      'Cobrança integrada',
      'Educação',
      'Comunidade',
      'Certificação',
      'Relatórios avançados',
    ],
    button: 'Começar agora',
    variant: 'outline',
  },
]

export function Pricing() {
  return (
    <section id="pricing" className="py-24 bg-muted/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            Planos e Preços
          </h2>
          <p className="mt-4 text-xl text-muted-foreground max-w-2xl mx-auto">
            <span className="font-semibold text-foreground">
              Sem fidelidade.
            </span>{' '}
            Teste gratuito de 14 dias em qualquer plano pago.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto items-stretch">
          {plans.map((p, i) => (
            <Card
              key={i}
              className={`relative flex flex-col bg-card ${p.popular ? 'border-primary shadow-xl md:scale-105 z-10 ring-1 ring-primary' : 'border-border shadow-sm'}`}
            >
              {p.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-6 py-1.5 rounded-full text-sm font-bold uppercase tracking-wider shadow-sm">
                  Mais Escolhido
                </div>
              )}
              <CardHeader className="text-center pb-8 pt-8">
                <CardTitle className="text-2xl">{p.name}</CardTitle>
                <CardDescription className="mt-3 text-base h-10">
                  {p.desc}
                </CardDescription>
                <div className="mt-8 text-5xl font-extrabold text-foreground">
                  {p.price}
                </div>
              </CardHeader>
              <CardContent className="flex-1 px-8">
                <ul className="space-y-5">
                  {p.features.map((f, j) => (
                    <li key={j} className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <span className="text-muted-foreground text-base">
                        {f}
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter className="p-8 pt-6">
                <Button
                  asChild
                  className="w-full h-12 text-base font-semibold"
                  variant={p.variant as any}
                >
                  <Link to="/dashboard">{p.button}</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
