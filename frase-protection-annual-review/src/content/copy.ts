import type { ReviewKind } from '../types/review'

export const PRODUCT_TITLE = 'Frase Protection Annual Alarm System Review'

export const POSITIONING = {
  subtitle:
    'Customer confidence visit — basic system review and coaching, not a formal inspection or certification.',
}

export function reviewKindLabel(kind: ReviewKind): string {
  return kind === 'residential' ? 'Residential' : 'Commercial'
}

export const DEVICE_LABELS: Record<string, string> = {
  door_contacts: 'Door contacts',
  window_contacts: 'Window contacts',
  motion: 'Motion detectors',
  glass_break: 'Glass break detectors',
  smoke: 'Smoke detectors (tied to system)',
  heat: 'Heat detectors',
  carbon_monoxide: 'Carbon monoxide devices',
  flood_leak: 'Flood / leak sensors',
  freeze_temp: 'Freeze / temperature sensors',
  panic: 'Panic buttons',
  siren_strobe: 'Siren / sounder / strobe',
  cameras: 'Cameras',
  video_doorbell: 'Video doorbell',
  smart_lock_automation: 'Smart lock / automation',
  other_devices: 'Other smart or security devices',
}

export function snapshotHintsForKind(kind: ReviewKind): string {
  if (kind === 'residential') {
    return 'Focus on how the household uses the system day to day and who may need a quick refresher.'
  }
  return 'Focus on staff routines, openings/closings, and who should have app or code access.'
}

export function recommendationsIntro(kind: ReviewKind): string {
  if (kind === 'residential') {
    return 'Select options that fit the home’s lifestyle — entry points, porch, environmental sensors, and app comfort.'
  }
  return 'Select options that fit operations — visibility, accountability, after-hours awareness, and access control.'
}
