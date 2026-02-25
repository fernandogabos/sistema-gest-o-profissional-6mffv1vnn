import { Link } from 'react-router-dom'
import { Dumbbell, Instagram, Facebook, Youtube, Linkedin } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function Footer() {
  return (
    <footer className="bg-muted/50 border-t pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-primary text-primary-foreground p-1.5 rounded-lg">
                <Dumbbell className="h-6 w-6" />
              </div>
              <span className="font-bold text-xl tracking-tight">
                Personal Pro
              </span>
            </div>
            <p className="text-muted-foreground mb-6 max-w-sm">
              A solução definitiva de gestão para personal trainer. Software
              para profissional de educação física gerir alunos, treinos e
              finanças.
            </p>
            <div className="flex gap-4">
              <a
                href="#"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Youtube className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-foreground">
              Institucional
            </h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="#features"
                  className="text-sm text-muted-foreground hover:text-primary"
                >
                  Funcionalidades
                </a>
              </li>
              <li>
                <a
                  href="#testimonials"
                  className="text-sm text-muted-foreground hover:text-primary"
                >
                  Depoimentos
                </a>
              </li>
              <li>
                <a
                  href="#pricing"
                  className="text-sm text-muted-foreground hover:text-primary"
                >
                  Planos e Preços
                </a>
              </li>
              <li>
                <a
                  href="#education"
                  className="text-sm text-muted-foreground hover:text-primary"
                >
                  Academia INNOVA
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-foreground">Legal</h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="#"
                  className="text-sm text-muted-foreground hover:text-primary"
                >
                  Política de Privacidade
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-muted-foreground hover:text-primary"
                >
                  Termos de Uso
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-muted-foreground hover:text-primary"
                >
                  Conformidade LGPD
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-foreground">Contato</h4>
            <ul className="space-y-3 mb-6">
              <li className="text-sm text-muted-foreground">
                suporte@personalpro.com.br
              </li>
              <li className="text-sm text-muted-foreground">(11) 99999-9999</li>
            </ul>
            <Button variant="outline" className="w-full" asChild>
              <Link to="/dashboard">Acessar Login</Link>
            </Button>
          </div>
        </div>

        <div className="border-t border-border pt-8 text-center text-sm text-muted-foreground">
          <p>
            &copy; {new Date().getFullYear()} Personal Pro. Todos os direitos
            reservados. Sistema para personal trainer.
          </p>
        </div>
      </div>
    </footer>
  )
}
