/**
 * Domain models for Jazz Fest 2026 content.
 * TODO: When wiring a remote API, keep these shapes stable or version them.
 */

export type MapZoneType =
  | 'stage'
  | 'restroom'
  | 'first_aid'
  | 'rest_area'
  | 'gate'
  | 'accessibility'
  | 'parking'
  | 'shuttle'
  | 'other';

export interface Artist {
  id: string;
  name: string;
  imageUrl: string;
  genre: string;
  shortBio: string;
  discography: string[];
  awards: string[];
  performanceIds: string[];
}

export interface Performance {
  id: string;
  artistId: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm (local fest day)
  endTime: string;
  stageId: string;
  stageName: string;
  mapZoneId: string;
}

export interface Stage {
  id: string;
  name: string;
  description: string;
  mapZoneId: string;
}

export interface MapZone {
  id: string;
  name: string;
  type: MapZoneType;
  /** Normalized overlay rect on the static map (0–1 coordinates). */
  overlay: { x: number; y: number; width: number; height: number };
  /** Short text for on-map labels (optional; falls back to name). */
  shortLabel?: string;
  detailText: string;
  accessibilityTags?: string[];
}

export type TicketAvailabilityStatus =
  | 'on_sale'
  | 'waitlist'
  | 'sold_out'
  | 'limited'
  | 'coming_soon';

export interface TicketType {
  id: string;
  name: string;
  tier: string;
  price: string;
  availabilityStatus: TicketAvailabilityStatus;
  notes: string;
}

export type FestivalInfoCategory =
  | 'dates_hours'
  | 'venue'
  | 'family'
  | 'policy'
  | 'transport'
  | 'health'
  | 'faq'
  | 'general';

export interface FestivalInfoSection {
  id: string;
  title: string;
  body: string;
  category: FestivalInfoCategory;
}

export type AlertSeverity = 'info' | 'notice' | 'warning';

export interface AlertItem {
  id: string;
  title: string;
  body: string;
  severity: AlertSeverity;
  effectiveAt: string; // ISO
  expiresAt: string; // ISO
  ctaLabel?: string;
  ctaRoute?: string; // e.g. /info/alerts
}

export interface SavedPerformance {
  performanceId: string;
  reminderOffsetMinutes: number;
  savedAt: string; // ISO
}

export interface UserReview {
  performanceId: string;
  rating: number; // 1–5
  note: string; // max 100 chars enforced in UI + persist layer
  updatedAt: string; // ISO
}

export interface ContentBundle {
  artists: Artist[];
  performances: Performance[];
  stages: Stage[];
  mapZones: MapZone[];
  ticketTypes: TicketType[];
  infoSections: FestivalInfoSection[];
  alerts: AlertItem[];
  contentVersion: string;
}
