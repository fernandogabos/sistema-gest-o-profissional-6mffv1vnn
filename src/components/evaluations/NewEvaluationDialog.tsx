import { useState, useMemo } from 'react'
import { FileEdit } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'
import useAppStore from '@/stores/main'
import { getClassification } from '@/lib/evaluations'

export function NewEvaluationDialog() {
  const { evaluationTemplates, students, currentUser, addEvaluationResult } =
    useAppStore()
  const { toast } = useToast()

  const [open, setOpen] = useState(false)
  const [templateId, setTemplateId] = useState('')
  const [targetId, setTargetId] = useState('')
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10))
  const [scores, setScores] = useState<Record<string, number>>({})

  const activeTemplates = evaluationTemplates.filter(
    (t) => t.tenantId === currentUser.tenantId && t.status === 'active',
  )
  const activeStudents = students.filter(
    (s) => s.tenantId === currentUser.tenantId && s.status === 'active',
  )

  const selectedTemplate = useMemo(
    () => activeTemplates.find((t) => t.id === templateId),
    [templateId, activeTemplates],
  )

  const handleScoreChange = (critId: string, val: string) => {
    let num = Number(val)
    if (num > 100) num = 100
    if (num < 0) num = 0
    setScores((prev) => ({ ...prev, [critId]: num }))
  }

  const handleSave = () => {
    if (!selectedTemplate || !targetId) {
      toast({ title: 'Selecione o modelo e o alvo.', variant: 'destructive' })
      return
    }

    let sumWeights = 0
    let sumWeightedScores = 0
    const scoreItems: any[] = []

    for (const c of selectedTemplate.criteria) {
      const s = scores[c.id] || 0
      sumWeights += c.weight
      sumWeightedScores += s * c.weight
      scoreItems.push({
        criterionId: c.id,
        name: c.name,
        weight: c.weight,
        value: s,
      })
    }

    const totalScore = sumWeights > 0 ? sumWeightedScores / sumWeights : 0
    const classification = getClassification(totalScore)

    addEvaluationResult({
      templateId: selectedTemplate.id,
      templateName: selectedTemplate.name,
      targetId,
      date,
      totalScore,
      classification,
      scores: scoreItems,
    })

    toast({ title: 'Avaliação processada e salva com sucesso!' })
    setOpen(false)
    setTemplateId('')
    setTargetId('')
    setScores({})
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <FileEdit className="mr-2 h-4 w-4" /> Nova Avaliação
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Registrar Avaliação</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label>Data</Label>
            <Input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Modelo de Avaliação</Label>
            <Select value={templateId} onValueChange={setTemplateId}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione..." />
              </SelectTrigger>
              <SelectContent>
                {activeTemplates.map((t) => (
                  <SelectItem key={t.id} value={t.id}>
                    {t.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedTemplate && (
            <div className="space-y-2">
              <Label>Aluno Avaliado</Label>
              <Select value={targetId} onValueChange={setTargetId}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o aluno..." />
                </SelectTrigger>
                <SelectContent>
                  {activeStudents.map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      {s.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {selectedTemplate && targetId && (
            <div className="pt-4 border-t space-y-3">
              <Label>Preencha as Notas (0 a 100)</Label>
              {selectedTemplate.criteria.map((c) => (
                <div
                  key={c.id}
                  className="flex items-center justify-between gap-4"
                >
                  <div className="flex-1 text-sm font-medium">{c.name}</div>
                  <div className="text-xs text-muted-foreground w-16">
                    Peso: {c.weight}
                  </div>
                  <div className="w-24">
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      value={scores[c.id] || ''}
                      onChange={(e) => handleScoreChange(c.id, e.target.value)}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          <Button
            className="w-full mt-4"
            onClick={handleSave}
            disabled={!selectedTemplate || !targetId}
          >
            Processar Avaliação
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
