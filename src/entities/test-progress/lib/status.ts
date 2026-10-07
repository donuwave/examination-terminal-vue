import type { ProgressStatus } from '../model/types'

export const statusMeta: Record<ProgressStatus, { label: string; chip: string }> = {
  1: { label: 'Готов к прохождению', chip: 'bg-brand-soft text-brand' },
  2: { label: 'В процессе', chip: 'bg-pastel-peach text-amber-800' },
  3: { label: 'Завершён', chip: 'bg-pastel-mint text-emerald-800' },
  4: { label: 'Просрочен', chip: 'bg-pastel-rose text-red-800' },
}
