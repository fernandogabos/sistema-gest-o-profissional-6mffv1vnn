import { Link } from 'react-router-dom'
import { ArrowRight, PlayCircle, CalendarCheck, CreditCard } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { formatBRL } from '@/lib/formatters'

export function Hero() {
  return (
    <section className="pt-32 pb-20 md:pt-40 md:pb-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12 lg:gap-8">
      <div className="flex-1 space-y-8 animate-fade-in-up z-10 text-center lg:text-left">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground leading-tight">
          A Plataforma Completa para Profissionais de Educação Física que Querem
          Crescer com{' '}
          <span className="text-primary bg-primary/10 px-2 rounded-md">
            Gestão, Inteligência e Receita Recorrente
          </span>
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto lg:mx-0">
          Gerencie alunos, agenda, cobranças, avaliações e desenvolvimento
          profissional em um único sistema.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
          <Button size="lg" asChild className="text-base px-8 h-14">
            <Link to="/dashboard">
              Começar teste gratuito <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="text-base px-8 h-14 bg-background"
          >
            <PlayCircle className="mr-2 h-5 w-5 text-primary" /> Ver
            demonstração
          </Button>
        </div>
      </div>

      <div className="flex-1 w-full relative animate-fade-in lg:ml-10">
        <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent blur-3xl rounded-full" />

        <div className="relative z-10 grid gap-6">
          <Card className="shadow-2xl border-primary/20 bg-background/95 backdrop-blur-sm transform lg:-rotate-2 hover:rotate-0 transition-transform duration-500">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="bg-emerald-100 dark:bg-emerald-900/30 p-4 rounded-full">
                <CreditCard className="h-8 w-8 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  Cobrança Integrada Recebida
                </p>
                <h3 className="text-2xl font-bold">{formatBRL(450)}</h3>
                <p className="text-xs text-emerald-600 font-medium mt-1">
                  Status: Pago (PIX Automático)
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-2xl border-primary/20 bg-background/95 backdrop-blur-sm transform lg:translate-x-12 lg:rotate-2 hover:rotate-0 transition-transform duration-500">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="bg-blue-100 dark:bg-blue-900/30 p-4 rounded-full">
                <CalendarCheck className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  Agenda Inteligente Otimizada
                </p>
                <h3 className="text-xl font-bold">14:00 - Treino Personal</h3>
                <p className="text-xs text-blue-600 font-medium mt-1">
                  Horário premium preenchido
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
