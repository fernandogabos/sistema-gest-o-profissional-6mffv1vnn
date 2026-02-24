export function getClassification(
  score: number,
): 'Critical' | 'Low' | 'Medium' | 'High' {
  if (score < 40) return 'Critical'
  if (score < 66) return 'Low'
  if (score < 86) return 'Medium'
  return 'High'
}

export function getClassificationLabel(cls: string): string {
  const map: Record<string, string> = {
    Critical: 'Crítico',
    Low: 'Baixo',
    Medium: 'Médio',
    High: 'Alto',
  }
  return map[cls] || cls
}

export function getClassificationColors(cls: string): string {
  switch (cls) {
    case 'Critical':
      return 'bg-rose-100 text-rose-700 border-rose-200'
    case 'Low':
      return 'bg-amber-100 text-amber-700 border-amber-200'
    case 'Medium':
      return 'bg-blue-100 text-blue-700 border-blue-200'
    case 'High':
      return 'bg-emerald-100 text-emerald-700 border-emerald-200'
    default:
      return 'bg-muted text-muted-foreground border-border'
  }
}
