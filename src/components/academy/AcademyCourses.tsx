import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import useAppStore from '@/stores/main'
import { formatBRL } from '@/lib/formatters'
import {
  PlayCircle,
  FileText,
  CheckCircle2,
  Award,
  Clock,
  User,
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { Progress } from '@/components/ui/progress'

export function AcademyCourses() {
  const {
    academyContents,
    academyEnrollments,
    currentUser,
    enrollAcademy,
    completeAcademyCourse,
  } = useAppStore()
  const { toast } = useToast()

  const courses = academyContents.filter((c) => c.type === 'course')

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {courses.map((course) => {
        const enrollment = academyEnrollments.find(
          (e) => e.contentId === course.id && e.userId === currentUser.id,
        )
        const isEnrolled = !!enrollment

        return (
          <Card
            key={course.id}
            className="overflow-hidden hover:shadow-md transition-all group flex flex-col"
          >
            <div className="relative aspect-video w-full overflow-hidden bg-muted">
              <img
                src={course.thumbnailUrl}
                alt={course.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
              />
              <Badge className="absolute top-2 right-2 bg-black/70 hover:bg-black/80 text-white border-0">
                {course.category}
              </Badge>
            </div>
            <CardContent className="p-4 space-y-4 flex flex-col flex-1">
              <div>
                <h3 className="font-bold text-lg leading-tight line-clamp-1">
                  {course.title}
                </h3>
                <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                  <User className="w-3 h-3" /> {course.instructor}
                </p>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-1 text-muted-foreground">
                  <Clock className="w-4 h-4" /> {course.workload}h
                </span>
                <span className="font-bold text-primary">
                  {course.isFree ? 'Gratuito' : formatBRL(course.price)}
                </span>
              </div>

              {isEnrolled && (
                <div className="space-y-2 mt-auto">
                  <div className="flex justify-between text-xs">
                    <span>Progresso</span>
                    <span>{enrollment.progress}%</span>
                  </div>
                  <Progress value={enrollment.progress} className="h-2" />
                </div>
              )}

              <div className={!isEnrolled ? 'mt-auto' : ''}>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant={isEnrolled ? 'outline' : 'default'}
                      className="w-full mt-4"
                    >
                      {isEnrolled ? 'Acessar Curso' : 'Ver Detalhes'}
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>{course.title}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 pt-2">
                      <div className="flex flex-col sm:flex-row gap-4 items-start">
                        <img
                          src={course.thumbnailUrl}
                          alt={course.title}
                          className="w-full sm:w-40 aspect-video object-cover rounded-md"
                        />
                        <div>
                          <p className="text-sm text-muted-foreground mb-3">
                            {course.description}
                          </p>
                          <div className="flex gap-2 flex-wrap">
                            <Badge variant="outline">
                              Público: {course.targetAudience}
                            </Badge>
                            <Badge variant="outline">
                              Pré-requisito: {course.prerequisites}
                            </Badge>
                          </div>
                        </div>
                      </div>

                      <div className="border rounded-md p-4 bg-muted/20 space-y-3">
                        <h4 className="font-semibold text-sm">
                          Conteúdo Programático
                        </h4>
                        {course.modules?.map((mod) => (
                          <div key={mod.id} className="space-y-2">
                            <p className="font-medium text-sm border-b pb-1">
                              {mod.title}
                            </p>
                            {mod.lessons.map((lesson) => (
                              <div
                                key={lesson.id}
                                className="flex items-center justify-between text-sm pl-2"
                              >
                                <div className="flex items-center gap-2 text-muted-foreground">
                                  {lesson.type === 'video' ? (
                                    <PlayCircle className="w-4 h-4" />
                                  ) : (
                                    <FileText className="w-4 h-4" />
                                  )}
                                  <span>{lesson.title}</span>
                                </div>
                                <span className="text-xs text-muted-foreground">
                                  {lesson.duration} min
                                </span>
                              </div>
                            ))}
                          </div>
                        ))}
                      </div>

                      <div className="flex justify-end gap-2 pt-2">
                        {!isEnrolled ? (
                          <Button
                            onClick={() => {
                              enrollAcademy(course.id)
                              toast({
                                title: 'Sucesso!',
                                description: course.isFree
                                  ? 'Matrícula realizada.'
                                  : 'Cobrança gerada com sucesso e matrícula liberada.',
                              })
                            }}
                          >
                            {course.isFree
                              ? 'Matricular Gratuitamente'
                              : `Comprar por ${formatBRL(course.price)}`}
                          </Button>
                        ) : enrollment.progress < 100 ? (
                          <Button
                            onClick={() => {
                              completeAcademyCourse(course.id)
                              toast({
                                title: 'Parabéns!',
                                description:
                                  'Curso concluído. Seu certificado foi gerado na aba Certificações.',
                              })
                            }}
                          >
                            <CheckCircle2 className="w-4 h-4 mr-2" /> Simular
                            Conclusão
                          </Button>
                        ) : (
                          <Button disabled variant="outline">
                            <Award className="w-4 h-4 mr-2" /> Curso Concluído
                          </Button>
                        )}
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
