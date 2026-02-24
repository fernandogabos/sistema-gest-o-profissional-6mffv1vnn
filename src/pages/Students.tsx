import { useState, useMemo } from 'react'
import { Plus, Search, Filter } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { StudentProfileSheet } from '@/components/StudentProfileSheet'
import { Student } from '@/stores/mockData'
import useAppStore from '@/stores/main'

export default function Students() {
  const { students, locations, currentLocationId } = useAppStore()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)

  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      const matchesSearch = s.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
      const matchesLocation =
        currentLocationId === 'all' || s.locationId === currentLocationId
      return matchesSearch && matchesLocation
    })
  }, [students, searchTerm, currentLocationId])

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Alunos</h1>
          <p className="text-muted-foreground mt-1">
            Gerencie seus alunos e acompanhe os progressos.
          </p>
        </div>
        <Button className="shrink-0">
          <Plus className="mr-2 h-4 w-4" />
          Adicionar Aluno
        </Button>
      </div>

      <Card className="overflow-hidden">
        <div className="p-4 flex gap-4 border-b bg-muted/20">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nome..."
              className="pl-9 bg-background"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline" size="icon" className="shrink-0">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Aluno</TableHead>
                <TableHead>Plano</TableHead>
                <TableHead>Local</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ação</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStudents.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="h-24 text-center text-muted-foreground"
                  >
                    Nenhum aluno encontrado.
                  </TableCell>
                </TableRow>
              ) : (
                filteredStudents.map((student) => {
                  const locName = locations.find(
                    (l) => l.id === student.locationId,
                  )?.name
                  return (
                    <TableRow
                      key={student.id}
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => setSelectedStudent(student)}
                    >
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9">
                            <AvatarImage src={student.avatarUrl} />
                            <AvatarFallback>
                              {student.name.substring(0, 2)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="font-medium">{student.name}</div>
                        </div>
                      </TableCell>
                      <TableCell>{student.plan}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {locName}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            student.status === 'active'
                              ? 'default'
                              : 'secondary'
                          }
                          className="font-normal"
                        >
                          {student.status === 'active' ? 'Ativo' : 'Inativo'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">
                          Ver Perfil
                        </Button>
                      </TableCell>
                    </TableRow>
                  )
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <StudentProfileSheet
        student={selectedStudent}
        open={!!selectedStudent}
        onOpenChange={(open) => !open && setSelectedStudent(null)}
      />
    </div>
  )
}
