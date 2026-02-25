import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import useAppStore from '@/stores/main'
import { formatBRL } from '@/lib/formatters'
import { Users, DollarSign, Star, TrendingUp } from 'lucide-react'

export function AcademyInstructor() {
  const {
    academyContents,
    academyEnrollments,
    courseEvaluations,
    currentUser,
  } = useAppStore()

  // Find courses where the current user is the instructor (using instructorId from mock)
  const myCourses = academyContents.filter(
    (c) =>
      c.instructorId === currentUser.id || currentUser.role === 'master_admin',
  )

  if (myCourses.length === 0) {
    return (
      <div className="p-8 text-center text-muted-foreground border border-dashed rounded-lg bg-muted/10">
        Você não possui cursos cadastrados como instrutor.
      </div>
    )
  }

  const totalSubscribers = myCourses.reduce(
    (acc, c) => acc + c.enrolledCount,
    0,
  )
  const totalRevenue = myCourses.reduce((acc, c) => acc + (c.revenue || 0), 0)

  const allMyCourseIds = myCourses.map((c) => c.id)
  const myEvaluations = courseEvaluations.filter((e) =>
    allMyCourseIds.includes(e.contentId),
  )
  const averageRating =
    myEvaluations.length > 0
      ? myEvaluations.reduce((acc, e) => acc + e.rating, 0) /
        myEvaluations.length
      : 0

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total de Alunos
                </p>
                <h3 className="text-2xl font-bold mt-1">{totalSubscribers}</h3>
              </div>
              <div className="p-2 bg-blue-100 text-blue-600 rounded-md">
                <Users className="w-5 h-5" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Faturamento Gerado
                </p>
                <h3 className="text-2xl font-bold mt-1 text-emerald-600">
                  {formatBRL(totalRevenue)}
                </h3>
              </div>
              <div className="p-2 bg-emerald-100 text-emerald-600 rounded-md">
                <DollarSign className="w-5 h-5" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Avaliação Média
                </p>
                <h3 className="text-2xl font-bold mt-1 text-amber-500">
                  {averageRating.toFixed(1)} / 5.0
                </h3>
              </div>
              <div className="p-2 bg-amber-100 text-amber-600 rounded-md">
                <Star className="w-5 h-5" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Taxa de Conclusão Média
                </p>
                <h3 className="text-2xl font-bold mt-1">
                  {Math.round(
                    myCourses.reduce((acc, c) => {
                      const enrolled = academyEnrollments.filter(
                        (e) => e.contentId === c.id,
                      )
                      const completed = enrolled.filter(
                        (e) => e.progress === 100,
                      ).length
                      return (
                        acc +
                        (enrolled.length > 0
                          ? (completed / enrolled.length) * 100
                          : 0)
                      )
                    }, 0) / (myCourses.length || 1),
                  )}
                  %
                </h3>
              </div>
              <div className="p-2 bg-purple-100 text-purple-600 rounded-md">
                <TrendingUp className="w-5 h-5" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Desempenho por Curso</CardTitle>
          <CardDescription>
            Acompanhe métricas detalhadas dos seus conteúdos
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Curso</TableHead>
                <TableHead className="text-right">Alunos</TableHead>
                <TableHead className="text-right">Receita</TableHead>
                <TableHead className="text-center">NPS</TableHead>
                <TableHead className="text-center">Avaliação</TableHead>
                <TableHead className="text-right">Conclusão</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {myCourses.map((course) => {
                const enrolled = academyEnrollments.filter(
                  (e) => e.contentId === course.id,
                )
                const completed = enrolled.filter(
                  (e) => e.progress === 100,
                ).length
                const compRate =
                  enrolled.length > 0
                    ? Math.round((completed / enrolled.length) * 100)
                    : 0

                const evals = courseEvaluations.filter(
                  (e) => e.contentId === course.id,
                )
                const crsRating =
                  evals.length > 0
                    ? evals.reduce((a, e) => a + e.rating, 0) / evals.length
                    : course.averageRating || 0

                return (
                  <TableRow key={course.id}>
                    <TableCell className="font-medium">
                      {course.title}
                    </TableCell>
                    <TableCell className="text-right">
                      {course.enrolledCount}
                    </TableCell>
                    <TableCell className="text-right font-medium text-emerald-600">
                      {formatBRL(course.revenue || 0)}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge
                        variant="outline"
                        className={
                          course.nps && course.nps > 70
                            ? 'border-emerald-500 text-emerald-600'
                            : 'border-amber-500 text-amber-600'
                        }
                      >
                        {course.nps || '-'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                        {crsRating.toFixed(1)}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">{compRate}%</TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
