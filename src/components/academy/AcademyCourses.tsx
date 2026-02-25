import { useState } from 'react'
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
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import useAppStore from '@/stores/main'
import { formatBRL } from '@/lib/formatters'
import {
  PlayCircle,
  FileText,
  CheckCircle2,
  Award,
  Clock,
  User,
  Star,
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { Progress } from '@/components/ui/progress'

export function AcademyCourses() {
  const {
    academyContents,
    academyEnrollments,
    subscriptions,
    currentUser,
    enrollAcademy,
    completeAcademyCourse,
    evaluateCourse,
  } = useAppStore()
  const { toast } = useToast()

  const [evalOpen, setEvalOpen] = useState(false)
  const [activeEvalCourseId, setActiveEvalCourseId] = useState('')
  const [rating, setRating] = useState(0)
  const [feedback, setFeedback] = useState('')

  const courses = academyContents.filter((c) => c.type === 'course')
  const hasPremiumPlan =
    subscriptions.some(
      (s) => s.alunoId === currentUser.id && s.status === 'active',
    ) || currentUser.role === 'master_admin'

  const handleEvaluate = () => {
    if (rating === 0)
      return toast({
        title: 'Atenção',
        description: 'Selecione uma nota de 1 a 5 estrelas.',
        variant: 'destructive',
      })
    evaluateCourse(activeEvalCourseId, rating, feedback)
    toast({
      title: 'Avaliação enviada',
      description: 'Obrigado pelo seu feedback!',
    })
    setEvalOpen(false)
    setRating(0)
    setFeedback('')
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {courses.map((course) => {
        const enrollment = academyEnrollments.find(
          (e) => e.contentId === course.id && e.userId === currentUser.id,
        )
        const isEnrolled = !!enrollment
        const finalPrice = hasPremiumPlan ? course.price * 0.8 : course.price // 20% discount for premium

        return (
          <Card
            key={course.id}
            className="overflow-hidden hover:shadow-md transition-all group flex flex-col relative"
          >
            {hasPremiumPlan && !course.isFree && !isEnrolled && (
              <Badge className="absolute top-2 left-2 z-10 bg-amber-500 hover:bg-amber-600 border-none">
                -20% Premium
              </Badge>
            )}
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
                <div className="flex justify-between items-center mt-1">
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <User className="w-3 h-3" /> {course.instructor}
                  </p>
                  {course.averageRating && (
                    <p className="text-xs font-medium text-amber-600 flex items-center gap-0.5">
                      <Star className="w-3 h-3 fill-amber-500" />{' '}
                      {course.averageRating.toFixed(1)}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center justify-between text-sm border-t pt-2">
                <span className="flex items-center gap-1 text-muted-foreground">
                  <Clock className="w-4 h-4" /> {course.workload}h
                </span>
                <div className="text-right">
                  {course.isFree ? (
                    <span className="font-bold text-emerald-600">Gratuito</span>
                  ) : (
                    <div className="flex flex-col">
                      {hasPremiumPlan ? (
                        <>
                          <span className="text-xs text-muted-foreground line-through">
                            {formatBRL(course.price)}
                          </span>
                          <span className="font-bold text-primary">
                            {formatBRL(finalPrice)}
                          </span>
                        </>
                      ) : (
                        <span className="font-bold text-primary">
                          {formatBRL(course.price)}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {isEnrolled && (
                <div className="space-y-2 mt-auto pt-2 border-t">
                  <div className="flex justify-between text-xs font-medium">
                    <span>Progresso</span>
                    <span
                      className={
                        enrollment.progress === 100 ? 'text-emerald-600' : ''
                      }
                    >
                      {enrollment.progress}%
                    </span>
                  </div>
                  <Progress value={enrollment.progress} className="h-2" />
                </div>
              )}

              <div className={!isEnrolled ? 'mt-auto' : ''}>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant={isEnrolled ? 'outline' : 'default'}
                      className="w-full mt-2"
                    >
                      {isEnrolled
                        ? enrollment.progress === 100
                          ? 'Revisar Conteúdo'
                          : 'Continuar Curso'
                        : 'Ver Detalhes'}
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
                              : `Comprar por ${formatBRL(finalPrice)}`}
                          </Button>
                        ) : enrollment.progress < 100 ? (
                          <Button
                            onClick={() => {
                              completeAcademyCourse(course.id)
                              toast({
                                title: 'Parabéns!',
                                description:
                                  'Curso concluído. Seu certificado foi gerado e você ganhou pontos!',
                              })
                            }}
                          >
                            <CheckCircle2 className="w-4 h-4 mr-2" /> Simular
                            Conclusão
                          </Button>
                        ) : (
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              onClick={() => {
                                setActiveEvalCourseId(course.id)
                                setEvalOpen(true)
                              }}
                            >
                              <Star className="w-4 h-4 mr-2" /> Avaliar Curso
                            </Button>
                            <Button
                              disabled
                              variant="outline"
                              className="text-emerald-600 border-emerald-200 bg-emerald-50"
                            >
                              <Award className="w-4 h-4 mr-2" /> Concluído
                            </Button>
                          </div>
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

      <Dialog open={evalOpen} onOpenChange={setEvalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Avaliar Curso</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="flex flex-col items-center gap-2">
              <Label>Que nota você dá para este conteúdo?</Label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-8 h-8 cursor-pointer ${rating >= star ? 'fill-amber-500 text-amber-500' : 'text-muted-foreground hover:text-amber-300'}`}
                    onClick={() => setRating(star)}
                  />
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label>Deixe seu feedback (opcional)</Label>
              <Textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="O que você mais gostou? O que pode melhorar?"
                rows={4}
              />
            </div>
            <Button className="w-full" onClick={handleEvaluate}>
              Enviar Avaliação
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
