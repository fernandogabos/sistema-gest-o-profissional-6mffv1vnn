import { Link } from 'react-router-dom'
import { GraduationCap, Video, BookOpen, Award, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function Education() {
  return (
    <section id="education" className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <div className="flex-1 space-y-8">
            <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold text-primary bg-primary/10 border-transparent">
              <GraduationCap className="h-4 w-4 mr-2" />
              Academia INNOVA
            </div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              Mais do que um sistema, um ecossistema de crescimento
              profissional.
            </h2>
            <p className="text-lg text-muted-foreground">
              Não basta apenas organizar, é preciso evoluir. Nossa plataforma
              inclui um hub de educação continuada com conteúdos exclusivos para
              alavancar sua carreira.
            </p>
            <ul className="space-y-4">
              {[
                {
                  icon: Video,
                  text: 'Lives e Mentorias semanais com especialistas do mercado',
                },
                {
                  icon: BookOpen,
                  text: 'Cursos completos de marketing, vendas e biomecânica',
                },
                {
                  icon: Award,
                  text: 'Certificações e selos de autoridade profissional',
                },
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3">
                  <div className="bg-primary/10 p-2 rounded-lg">
                    <item.icon className="h-5 w-5 text-primary" />
                  </div>
                  <span className="font-medium text-foreground">
                    {item.text}
                  </span>
                </li>
              ))}
            </ul>
            <Button size="lg" asChild>
              <Link to="/dashboard">
                Conhecer centro de desenvolvimento{' '}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
          <div className="flex-1 w-full">
            <div className="grid grid-cols-2 gap-4">
              <img
                src="https://img.usecurling.com/p/400/400?q=fitness%20education&color=blue"
                alt="Educação"
                className="rounded-2xl shadow-lg object-cover w-full h-48 md:h-64"
              />
              <img
                src="https://img.usecurling.com/p/400/400?q=online%20course&color=gray"
                alt="Cursos Online"
                className="rounded-2xl shadow-lg object-cover w-full h-48 md:h-64 mt-8"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
