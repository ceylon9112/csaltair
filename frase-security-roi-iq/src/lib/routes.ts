import { VERTICAL_LABELS } from '../data/verticals'
import type { VerticalId } from '../types'

const VERTICAL_SET = new Set<string>(Object.keys(VERTICAL_LABELS))

export function isVerticalId(value: string | undefined): value is VerticalId {
  return value !== undefined && VERTICAL_SET.has(value)
}

export function verticalPath(vertical: VerticalId): string {
  return `/calculate/${vertical}`
}

export function resultsPath(vertical: VerticalId): string {
  return `/calculate/${vertical}/results`
}
