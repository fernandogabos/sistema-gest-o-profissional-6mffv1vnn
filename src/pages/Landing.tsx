import { useEffect } from 'react'
import { Header } from '@/components/landing/Header'
import { Hero } from '@/components/landing/Hero'
import { PainPoints } from '@/components/landing/PainPoints'
import { Features } from '@/components/landing/Features'
import { Results } from '@/components/landing/Results'
import { Testimonials } from '@/components/landing/Testimonials'
import { Education } from '@/components/landing/Education'
import { Pricing } from '@/components/landing/Pricing'
import { FAQ } from '@/components/landing/FAQ'
import { Footer } from '@/components/landing/Footer'
import { LeadMagnetPopup } from '@/components/landing/LeadMagnetPopup'
import { WhatsAppButton } from '@/components/landing/WhatsAppButton'

export default function Landing() {
  useEffect(() => {
    document.title =
      'Sistema Gestão Profissional | Software e Agenda para Personal Trainer'
    let metaDescription = document.querySelector('meta[name="description"]')
    if (!metaDescription) {
      metaDescription = document.createElement('meta')
      metaDescription.setAttribute('name', 'description')
      document.head.appendChild(metaDescription)
    }
    metaDescription.setAttribute(
      'content',
      'Sistema para personal trainer. Software para profissional de educação física com agenda para personal e sistema de cobrança para personal trainer. Gestão para personal trainer completa.',
    )
  }, [])

  return (
    <div className="min-h-screen bg-background font-sans text-foreground overflow-x-hidden">
      <Header />
      <main>
        <Hero />
        <PainPoints />
        <Features />
        <Results />
        <Testimonials />
        <Education />
        <Pricing />
        <FAQ />
      </main>
      <Footer />
      <LeadMagnetPopup />
      <WhatsAppButton />
    </div>
  )
}
