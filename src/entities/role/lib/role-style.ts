export const roleStyle = (name: string) =>
  name === 'Преподаватель'
    ? { bg: 'bg-pastel-lavender', hint: 'Создаёт курсы и тесты' }
    : { bg: 'bg-pastel-sky', hint: 'Проходит тесты' }
