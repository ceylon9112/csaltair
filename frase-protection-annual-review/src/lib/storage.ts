import type { StoredReview } from '../types/review'

export const STORAGE_KEY = 'frase-annual-review-v1'

function isStoredReview(v: unknown): v is StoredReview {
  if (typeof v !== 'object' || v === null) return false
  const o = v as Record<string, unknown>
  return (
    typeof o.id === 'string' &&
    typeof o.status === 'string' &&
    typeof o.createdAt === 'string' &&
    typeof o.updatedAt === 'string' &&
    typeof o.currentStep === 'number' &&
    o.data !== null &&
    typeof o.data === 'object'
  )
}

function readAll(): StoredReview[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed.filter(isStoredReview)
  } catch {
    return []
  }
}

function writeAll(list: StoredReview[]): boolean {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
    return true
  } catch (e) {
    if (e instanceof DOMException && e.name === 'QuotaExceededError') {
      return false
    }
    return false
  }
}

export function listReviews(): StoredReview[] {
  return readAll().sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
  )
}

export function getReview(id: string): StoredReview | undefined {
  return readAll().find((r) => r.id === id)
}

/** @returns false if storage is full or unavailable */
export function saveReview(review: StoredReview): boolean {
  const all = readAll()
  const i = all.findIndex((r) => r.id === review.id)
  const next = { ...review, updatedAt: new Date().toISOString() }
  if (i >= 0) all[i] = next
  else all.push(next)
  return writeAll(all)
}

export function deleteReview(id: string): boolean {
  return writeAll(readAll().filter((r) => r.id !== id))
}
