import type { AlertItem } from '@/types/models';

export const SEED_ALERTS: AlertItem[] = [
  {
    id: 'al_2',
    title: 'Gate A busy 4–6 PM',
    body: 'Expect longer lines at Gate A during late afternoon. (Sample operational alert.)',
    severity: 'info',
    effectiveAt: '2026-04-01T00:00:00.000Z',
    expiresAt: '2026-05-04T23:59:59.000Z',
  },
];
