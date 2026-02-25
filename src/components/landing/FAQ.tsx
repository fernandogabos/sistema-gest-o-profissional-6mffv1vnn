import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

const faqs = [
  {
    q: 'Preciso ter CNPJ?',
    a: 'Não! Você pode utilizar a plataforma e o sistema de cobrança como pessoa física (CPF). Temos soluções flexíveis para todos os momentos da sua carreira.',
  },
  {
    q: 'Funciona para personal online?',
    a: 'Com certeza. O sistema foi desenhado para atender tanto o atendimento presencial quanto a consultoria online, permitindo enviar treinos, realizar avaliações e fazer cobranças à distância.',
  },
  {
    q: 'Posso usar só a agenda?',
    a: 'Sim, nossos módulos são independentes. Você pode focar apenas na gestão de agenda de personal agora e adicionar o financeiro e cobranças no futuro, se desejar.',
  },
  {
    q: 'Como funciona a cobrança?',
    a: 'A cobrança integrada permite gerar links de PIX, boletos e cartão de crédito. Você pode configurar planos recorrentes que cobram seus alunos automaticamente todo mês, reduzindo a inadimplência.',
  },
  {
    q: 'Posso cancelar quando quiser?',
    a: 'Sim, não exigimos fidelidade. Nossos planos são mensais e você tem total liberdade para cancelar a qualquer momento diretamente pelo painel.',
  },
  {
    q: 'Tem suporte?',
    a: 'Oferecemos suporte humanizado de segunda a sábado. Nossa equipe de especialistas está pronta para ajudar você a configurar o sistema de cobrança para personal trainer e demais funcionalidades.',
  },
]

export function FAQ() {
  return (
    <section id="faq" className="py-24 bg-background border-t">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            Dúvidas Frequentes
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Tudo o que você precisa saber antes de transformar a gestão da sua
            carreira.
          </p>
        </div>

        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, i) => (
            <AccordionItem key={i} value={`item-${i}`}>
              <AccordionTrigger className="text-left text-lg font-medium">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground text-base leading-relaxed">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}
