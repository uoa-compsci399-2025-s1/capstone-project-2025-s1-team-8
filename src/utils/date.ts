export const formatDate = (date: string | Date): string => {
  const d = new Date(date)
  return d.toLocaleDateString('en-NZ', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
  })
}
