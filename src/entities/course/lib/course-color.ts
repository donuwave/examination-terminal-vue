const COLORS = [
  'bg-pastel-rose',
  'bg-pastel-peach',
  'bg-pastel-lavender',
  'bg-pastel-lime',
  'bg-pastel-mint',
  'bg-pastel-sky',
] as const

/** Один курс всегда одного цвета, поэтому цвет считается от id. */
export const courseColor = (id: number) => COLORS[id % COLORS.length]
