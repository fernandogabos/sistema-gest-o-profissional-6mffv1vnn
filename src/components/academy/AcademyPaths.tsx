import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import useAppStore from '@/stores/main'
import { BookOpen, Shield } from 'lucide-react'

export function AcademyPaths() {
  const { academyPaths, academyContents, academyEnrollments, currentUser } =
    useAppStore()

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {academyPaths.map((path) => {
        const pathCourses = academyContents.filter((c) =>
          path.courseIds.includes(c.id),
        )

        let completedCount = 0
        path.courseIds.forEach((cid) => {
          if (
            academyEnrollments.some(
              (e) =>
                e.contentId === cid &&
                e.userId === currentUser.id &&
                e.progress === 100,
            )
          ) {
            completedCount++
          }
        })

        const progress =
          Math.round((completedCount / path.courseIds.length) * 100) || 0
        const isCompleted = progress === 100

        return (
          <Card key={path.id} className="overflow-hidden flex flex-col">
            <div className="h-32 bg-muted relative">
              <img
                src={path.thumbnailUrl}
                alt={path.title}
                className="w-full h-full object-cover opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-4">
                <h3 className="text-xl font-bold text-white">{path.title}</h3>
              </div>
              {isCompleted && (
                <Badge className="absolute top-4 right-4 bg-emerald-500">
                  <Shield className="w-3 h-3 mr-1" /> Concluída
                </Badge>
              )}
            </div>

            <CardContent className="p-5 flex-1 flex flex-col">
              <p className="text-sm text-muted-foreground mb-4">
                {path.description}
              </p>

              <div className="space-y-2 mb-4 bg-muted/20 p-3 rounded-md border">
                <div className="flex justify-between text-xs font-medium">
                  <span>Progresso da Trilha</span>
                  <span>
                    {completedCount} de {path.courseIds.length} Cursos
                  </span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>

              <div className="space-y-3 flex-1">
                <h4 className="font-semibold text-sm flex items-center gap-2">
                  <BookOpen className="w-4 h-4" /> Cursos Inclusos
                </h4>
                <div className="space-y-2">
                  {pathCourses.map((c, idx) => {
                    const isCourseDone = academyEnrollments.some(
                      (e) =>
                        e.contentId === c.id &&
                        e.userId === currentUser.id &&
                        e.progress === 100,
                    )
                    return (
                      <div
                        key={c.id}
                        className="flex items-start gap-2 text-sm"
                      >
                        <div
                          className={`mt-0.5 w-4 h-4 rounded-full flex items-center justify-center shrink-0 border text-[10px] ${isCourseDone ? 'bg-primary border-primary text-primary-foreground' : 'border-muted-foreground text-muted-foreground'}`}
                        >
                          {isCourseDone ? '✓' : idx + 1}
                        </div>
                        <span
                          className={
                            isCourseDone
                              ? 'line-through text-muted-foreground'
                              : 'font-medium'
                          }
                        >
                          {c.title}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>

              <Button
                className="w-full mt-6"
                variant={isCompleted ? 'outline' : 'default'}
                disabled={isCompleted}
              >
                {isCompleted ? 'Trilha Dominada' : 'Continuar Aprendizado'}
              </Button>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
