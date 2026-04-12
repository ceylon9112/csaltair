import {
  type DeviceCategoryId,
  type DeviceRowState,
  type ReviewData,
  type ReviewKind,
  DEVICE_CATEGORY_IDS,
  RECOMMENDATION_OPTIONS,
} from '../types/review'

function emptyDeviceRow(): DeviceRowState {
  return {
    present: false,
    looksOk: false,
    customerUnderstands: false,
    issueFollowUp: false,
    upgradeOpportunity: false,
    notes: '',
  }
}

function emptyDevices(): Record<DeviceCategoryId, DeviceRowState> {
  const o = {} as Record<DeviceCategoryId, DeviceRowState>
  for (const id of DEVICE_CATEGORY_IDS) {
    o[id] = emptyDeviceRow()
  }
  return o
}

function emptyRecommendationSelected(): Record<string, boolean> {
  const s: Record<string, boolean> = {}
  for (const { id } of RECOMMENDATION_OPTIONS) {
    s[id] = false
  }
  return s
}

export function createEmptyReviewData(kind: ReviewKind): ReviewData {
  return {
    kind,
    account: {
      customerOrBusinessName: '',
      serviceAddress: '',
      contactName: '',
      phone: '',
      email: '',
      repName: '',
      reviewDate: new Date().toISOString().slice(0, 10),
      systemBrand: '',
      primaryKeypadLocation: '',
      mobileAppInUse: '',
      monitoringActive: '',
      notes: '',
    },
    useSnapshot: {
      armFrequency: '',
      primaryMethod: [],
      understandsStayAway: '',
      disarmConfidently: '',
      otherUsersNeedTraining: '',
      recentIssues: [],
      issueNotes: '',
    },
    keypad: {
      demonstratedArming: false,
      demonstratedDisarming: false,
      chimeOrSilentExplained: false,
      commonMessagesReviewed: false,
      knowsMonitoringVsFrase: false,
      troubleVisibleDuringVisit: false,
      notes: '',
    },
    mobileApp: {
      installedOnPrimary: false,
      loggedInOk: false,
      canArmDisarmInApp: false,
      notificationsReviewed: false,
      additionalUsersDiscussed: false,
      coachingNotes: '',
    },
    devices: emptyDevices(),
    recommendations: {
      selected: emptyRecommendationSelected(),
      whyTheseFit: '',
    },
    outcome: {
      trainedArmDisarm: false,
      trainedMobileApp: false,
      serviceFollowUpNeeded: false,
      quoteOrMoreInfoRequested: false,
      photosForCrm: false,
      followUpSummary: '',
      internalNotes: '',
    },
    photos: [],
    acknowledgment: {
      customerName: '',
      ackDate: new Date().toISOString().slice(0, 10),
      customerSignatureDataUrl: '',
      repNameConfirm: '',
      repSignatureDataUrl: '',
      typedAcknowledgment: '',
    },
  }
}
