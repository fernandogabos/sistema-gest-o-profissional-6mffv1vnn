import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import useAppStore from '@/stores/main'
import { Award, Download, ShieldCheck } from 'lucide-react'
import { formatDate } from '@/lib/formatters'

export function AcademyCertifications() {
  const { academyCertificates, gamificationProfiles, currentUser } =
    useAppStore()
  const myCerts = academyCertificates.filter((c) => c.userId === currentUser.id)
  const myProfile = gamificationProfiles.find(
    (p) => p.userId === currentUser.id,
  )
  const myBadges = myProfile?.badges || []

  if (myCerts.length === 0 && myBadges.length === 0) {
    return (
      <div className="text-center py-16 bg-muted/20 rounded-lg border border-dashed">
        <Award className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
        <h3 className="text-lg font-semibold">Nenhuma certificação ainda</h3>
        <p className="text-muted-foreground max-w-sm mx-auto mt-2">
          Conclua os treinamentos e participe de eventos na Academia INNOVA para
          conquistar seus certificados oficiais e selos.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {myBadges.length > 0 && (
        <section>
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-primary" /> Meus Selos de
            Especialista
          </h3>
          <div className="flex flex-wrap gap-4">
            {myBadges.map((b) => (
              <div
                key={b.id}
                className="bg-card border rounded-lg p-4 flex items-center gap-4 w-full sm:w-auto min-w-[250px] shadow-sm hover:shadow-md transition-shadow"
              >
                <img src={b.iconUrl} alt={b.name} className="w-14 h-14" />
                <div>
                  <h4 className="font-bold text-sm leading-tight">{b.name}</h4>
                  <p className="text-[10px] text-muted-foreground mt-1">
                    Conquistado em {formatDate(b.earnedAt)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <section>
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Award className="w-5 h-5 text-primary" /> Certificados de Conclusão
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {myCerts.map((cert) => (
            <Card key={cert.id} className="relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-2 h-full bg-emerald-500"></div>
              <CardContent className="p-6 pl-8">
                <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center">
                    <Award className="w-6 h-6" />
                  </div>
                  <Badge
                    variant="outline"
                    className="bg-emerald-50 text-emerald-700 border-emerald-200"
                  >
                    <ShieldCheck className="w-3 h-3 mr-1" /> Oficial da
                    Plataforma
                  </Badge>
                </div>
                <h3 className="text-xl font-bold mb-1 line-clamp-1">
                  {cert.courseName}
                </h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Instrutor responsável: {cert.instructor}
                </p>

                <div className="grid grid-cols-2 gap-4 text-sm mb-6 bg-muted/30 p-3 rounded-md">
                  <div>
                    <p className="text-muted-foreground text-xs">
                      Data de Emissão
                    </p>
                    <p className="font-medium">{formatDate(cert.issueDate)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs">
                      Carga Horária
                    </p>
                    <p className="font-medium">{cert.workload} horas</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-muted-foreground text-xs">
                      Link Público de Validação
                    </p>
                    <p className="font-mono font-medium text-xs text-blue-600 truncate cursor-pointer hover:underline">
                      app.innova.com/cert/{cert.validationCode}
                    </p>
                  </div>
                </div>

                <Button
                  variant="outline"
                  className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                >
                  <Download className="w-4 h-4 mr-2" /> Baixar PDF HD
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  )
}
