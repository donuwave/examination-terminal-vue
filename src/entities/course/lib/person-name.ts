interface Named {
  email: string
  first_name: string | null
  last_name: string | null
}

export const personName = (person: Named) =>
  [person.first_name, person.last_name].filter(Boolean).join(' ') || person.email

export const personInitials = (person: Named) =>
  personName(person)
    .split(' ')
    .map((part) => part.charAt(0))
    .slice(0, 2)
    .join('')
    .toUpperCase()
