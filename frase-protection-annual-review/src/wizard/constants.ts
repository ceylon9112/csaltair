export const WIZARD_STEP_COUNT = 11

export const STEP_META = [
  { title: 'Review type', subtitle: 'Residential or commercial annual system review' },
  { title: 'Visit information', subtitle: 'Customer / account details for this visit' },
  { title: 'Customer use snapshot', subtitle: 'How the system is used day to day' },
  { title: 'Keypad & basic operation', subtitle: 'Coaching-style check-in on core use' },
  { title: 'Mobile app review', subtitle: 'Log-in, arming, notifications, and users' },
  { title: 'Visual device review', subtitle: 'Basic visible check by category — not a formal test' },
  { title: 'Recommended options', subtitle: 'Consultative upgrade or training notes' },
  { title: 'Visit outcome & follow-up', subtitle: 'Close the visit with clear next steps' },
  { title: 'Photos', subtitle: 'Up to five optional site photos' },
  { title: 'Customer acknowledgment', subtitle: 'Review was coaching, not certification' },
  { title: 'Summary & export', subtitle: 'Review everything, then generate your PDF' },
] as const
