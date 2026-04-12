export type ReviewKind = 'residential' | 'commercial'

export type ReviewStatus = 'draft' | 'completed'

export interface PhotoItem {
  id: string
  dataUrl: string
  caption: string
}

export interface AccountSection {
  customerOrBusinessName: string
  serviceAddress: string
  contactName: string
  phone: string
  email: string
  repName: string
  reviewDate: string
  systemBrand: string
  primaryKeypadLocation: string
  mobileAppInUse: string
  monitoringActive: '' | 'yes' | 'no' | 'unknown'
  notes: string
}

export interface UseSnapshotSection {
  armFrequency: string
  primaryMethod: string[]
  understandsStayAway: '' | 'yes' | 'no' | 'partial'
  disarmConfidently: '' | 'yes' | 'no' | 'partial'
  otherUsersNeedTraining: '' | 'yes' | 'no' | 'unknown'
  recentIssues: string[]
  issueNotes: string
}

export interface KeypadSection {
  demonstratedArming: boolean
  demonstratedDisarming: boolean
  chimeOrSilentExplained: boolean
  commonMessagesReviewed: boolean
  knowsMonitoringVsFrase: boolean
  troubleVisibleDuringVisit: boolean
  notes: string
}

export interface MobileAppSection {
  installedOnPrimary: boolean
  loggedInOk: boolean
  canArmDisarmInApp: boolean
  notificationsReviewed: boolean
  additionalUsersDiscussed: boolean
  coachingNotes: string
}

export type DeviceCategoryId = (typeof DEVICE_CATEGORY_IDS)[number]

export interface DeviceRowState {
  present: boolean
  looksOk: boolean
  customerUnderstands: boolean
  issueFollowUp: boolean
  upgradeOpportunity: boolean
  notes: string
}

export interface RecommendationsSection {
  selected: Record<string, boolean>
  whyTheseFit: string
}

export interface OutcomeSection {
  trainedArmDisarm: boolean
  trainedMobileApp: boolean
  serviceFollowUpNeeded: boolean
  quoteOrMoreInfoRequested: boolean
  photosForCrm: boolean
  followUpSummary: string
  internalNotes: string
}

export interface AcknowledgmentSection {
  customerName: string
  ackDate: string
  customerSignatureDataUrl: string
  repNameConfirm: string
  repSignatureDataUrl: string
  typedAcknowledgment: string
}

export interface ReviewData {
  kind: ReviewKind
  account: AccountSection
  useSnapshot: UseSnapshotSection
  keypad: KeypadSection
  mobileApp: MobileAppSection
  devices: Record<DeviceCategoryId, DeviceRowState>
  recommendations: RecommendationsSection
  outcome: OutcomeSection
  photos: PhotoItem[]
  acknowledgment: AcknowledgmentSection
}

export interface StoredReview {
  id: string
  createdAt: string
  updatedAt: string
  status: ReviewStatus
  currentStep: number
  data: ReviewData
}

export const DEVICE_CATEGORY_IDS = [
  'door_contacts',
  'window_contacts',
  'motion',
  'glass_break',
  'smoke',
  'heat',
  'carbon_monoxide',
  'flood_leak',
  'freeze_temp',
  'panic',
  'siren_strobe',
  'cameras',
  'video_doorbell',
  'smart_lock_automation',
  'other_devices',
] as const

export const RECOMMENDATION_OPTIONS = [
  { id: 'video_doorbell', label: 'Video doorbell' },
  { id: 'outdoor_cameras', label: 'Outdoor cameras' },
  { id: 'indoor_camera', label: 'Indoor camera' },
  { id: 'flood_leak', label: 'Flood / leak sensor' },
  { id: 'freeze_temp', label: 'Freeze / temperature sensor' },
  { id: 'additional_keypad', label: 'Additional keypad' },
  { id: 'smoke_co', label: 'Smoke / CO enhancement' },
  { id: 'smart_lock', label: 'Smart lock / automation' },
  { id: 'app_training', label: 'App training only' },
  { id: 'communicator', label: 'Communicator upgrade' },
  { id: 'commercial_visibility', label: 'Commercial visibility upgrades' },
  { id: 'user_codes', label: 'User code / access discussion' },
  { id: 'other_custom', label: 'Other (custom)' },
] as const

export const SNAPSHOT_ISSUE_CHIPS = [
  'beeping',
  'trouble_messages',
  'false_alarms',
  'none_reported',
] as const
