import { Header } from '@/components/landing/Header'
import { Hero } from '@/components/landing/Hero'
import { PainPoints } from '@/components/landing/PainPoints'
import { Features } from '@/components/landing/Features'
import { Results } from '@/components/landing/Results'
import { Pricing } from '@/components/landing/Pricing'

export default function Landing() {
  return (
    <div className="min-h-screen bg-background font-sans text-foreground overflow-x-hidden">
      <Header />
      <main>
        <Hero />
        <PainPoints />
        <Features />
        <Results />
        <Pricing />
      </main>
      <footer className="bg-card py-12 text-center border-t">
        <p className="text-muted-foreground">
          &copy; {new Date().getFullYear()} Personal Pro. Todos os direitos
          reservados.
        </p>
      </footer>
    </div>
  )
}
