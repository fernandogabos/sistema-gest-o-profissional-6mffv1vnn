import { Star } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

const testimonials = [
  {
    name: 'Carlos Silva',
    specialty: 'Personal Trainer Funcional',
    city: 'São Paulo, SP',
    text: 'Antes da plataforma, eu perdia horas cobrando alunos no WhatsApp. Hoje, recebo tudo no PIX automático e minha taxa de inadimplência zerou. Recomendo para todo profissional de educação física.',
    avatar: 'https://img.usecurling.com/ppl/thumbnail?seed=1&gender=male',
  },
  {
    name: 'Mariana Costa',
    specialty: 'Consultoria Online',
    city: 'Rio de Janeiro, RJ',
    text: 'O ecossistema é incrível! Não só organizei minha agenda de personal, como também já fiz três cursos na Academia INNOVA. O melhor sistema para personal trainer do mercado.',
    avatar: 'https://img.usecurling.com/ppl/thumbnail?seed=2&gender=female',
  },
  {
    name: 'Roberto Almeida',
    specialty: 'Especialista em Emagrecimento',
    city: 'Belo Horizonte, MG',
    text: 'Poder ter meu aplicativo com minha própria marca e gerenciar todos os treinos em um só lugar mudou o nível do meu negócio. Meus alunos adoram a experiência profissional.',
    avatar: 'https://img.usecurling.com/ppl/thumbnail?seed=3&gender=male',
  },
]

export function Testimonials() {
  return (
    <section id="testimonials" className="py-24 bg-muted/30 border-y">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            O que dizem nossos profissionais
          </h2>
          <p className="mt-4 text-xl text-muted-foreground max-w-2xl mx-auto">
            Junte-se a milhares de profissionais que transformaram suas
            carreiras.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {testimonials.map((t, i) => (
            <Card key={i} className="bg-background border-border shadow-sm">
              <CardContent className="p-6">
                <div className="flex gap-1 text-amber-500 mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-6 italic">"{t.text}"</p>
                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarImage src={t.avatar} />
                    <AvatarFallback>{t.name.substring(0, 2)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-semibold text-foreground">{t.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {t.specialty} • {t.city}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center bg-primary text-primary-foreground rounded-3xl p-8 shadow-lg">
          <div>
            <div className="text-4xl font-extrabold mb-2">+10.000</div>
            <div className="text-primary-foreground/80 font-medium">
              Profissionais Ativos
            </div>
          </div>
          <div className="border-y md:border-y-0 md:border-x border-primary-foreground/20 py-6 md:py-0">
            <div className="text-4xl font-extrabold mb-2">+250.000</div>
            <div className="text-primary-foreground/80 font-medium">
              Alunos Gerenciados
            </div>
          </div>
          <div>
            <div className="text-4xl font-extrabold mb-2">R$ 50M+</div>
            <div className="text-primary-foreground/80 font-medium">
              Volume Processado
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
