export function newId(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID()
  }
  return `r-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}
