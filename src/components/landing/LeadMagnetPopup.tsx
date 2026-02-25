import { useState, useEffect } from 'react'
import { X, FileText, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'

export function LeadMagnetPopup() {
  const [open, setOpen] = useState(false)
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    // Show popup after 10 seconds
    const timer = setTimeout(() => {
      const hasSeenPopup = localStorage.getItem('hasSeenLeadMagnet')
      if (!hasSeenPopup) {
        setOpen(true)
      }
    }, 10000)

    // Optional exit intent
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0) {
        const hasSeenPopup = localStorage.getItem('hasSeenLeadMagnet')
        if (!hasSeenPopup) {
          setOpen(true)
        }
      }
    }

    document.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      clearTimeout(timer)
      document.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [])

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen)
    if (!isOpen) {
      localStorage.setItem('hasSeenLeadMagnet', 'true')
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      setSubmitted(true)
      setTimeout(() => {
        setOpen(false)
      }, 3000)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-xl p-0 overflow-hidden border-0 bg-transparent shadow-none">
        <DialogTitle className="sr-only">Checklist gratuito</DialogTitle>
        <div className="flex flex-col sm:flex-row bg-background rounded-lg shadow-xl overflow-hidden">
          <div className="bg-primary p-6 flex flex-col justify-center items-center text-primary-foreground sm:w-2/5">
            <FileText className="h-16 w-16 mb-4 opacity-90" />
            <h3 className="font-bold text-xl text-center mb-2">
              Checklist Gratuito
            </h3>
            <p className="text-center text-sm opacity-90">
              Para personal trainer organizar sua rotina
            </p>
          </div>
          <div className="p-6 sm:w-3/5 relative">
            <button
              onClick={() => handleOpenChange(false)}
              className="absolute right-4 top-4 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="h-4 w-4" />
            </button>

            {!submitted ? (
              <form onSubmit={handleSubmit} className="mt-2">
                <h4 className="font-semibold text-lg mb-2 text-foreground">
                  Otimize seu tempo!
                </h4>
                <p className="text-sm text-muted-foreground mb-6">
                  Descubra os 10 passos para escalar sua carreira e faturar mais
                  trabalhando menos.
                </p>
                <div className="space-y-4">
                  <Input
                    type="email"
                    placeholder="Seu melhor e-mail"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full"
                  />
                  <Button type="submit" className="w-full">
                    Baixar Agora
                  </Button>
                </div>
              </form>
            ) : (
              <div className="flex flex-col items-center justify-center h-full py-8 text-center animate-fade-in">
                <CheckCircle2 className="h-12 w-12 text-emerald-500 mb-3" />
                <h4 className="font-semibold text-lg mb-1 text-foreground">
                  Tudo certo!
                </h4>
                <p className="text-sm text-muted-foreground">
                  O checklist foi enviado para o seu e-mail.
                </p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
