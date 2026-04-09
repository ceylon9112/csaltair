import type { TicketType } from '@/types/models';

/** Official-style snapshot — TODO: replace with verified 2026 pricing when published. */
export const SEED_TICKETS: TicketType[] = [
  {
    id: 'tk_1',
    name: 'General Admission — Single Day',
    tier: 'GA',
    price: '$95 (placeholder)',
    availabilityStatus: 'on_sale',
    notes: 'Single-day entry. Child policy: see Festival Info — placeholder summary.',
  },
  {
    id: 'tk_2',
    name: 'General Admission — Weekend Bundle',
    tier: 'GA',
    price: '$265 (placeholder)',
    availabilityStatus: 'limited',
    notes: 'Bundle for Fri–Sun window — subject to official release.',
  },
  {
    id: 'tk_3',
    name: 'VIP Club Experience',
    tier: 'VIP',
    price: '$425 (placeholder)',
    availabilityStatus: 'waitlist',
    notes: 'Elevated amenities — availability may change; check official site.',
  },
  {
    id: 'tk_4',
    name: 'Locals Thursday (if offered)',
    tier: 'Special',
    price: '$75 (placeholder)',
    availabilityStatus: 'coming_soon',
    notes: 'Historically offered for Louisiana residents — confirm on official channels.',
  },
];
