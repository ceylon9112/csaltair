import type { jsPDF } from 'jspdf'
import fraseLogoUrl from '../assets/frase-logo.png'
import { DEVICE_LABELS, PRODUCT_TITLE, reviewKindLabel } from '../content/copy'
import type { DeviceCategoryId, StoredReview } from '../types/review'
import { DEVICE_CATEGORY_IDS, RECOMMENDATION_OPTIONS } from '../types/review'

function loadLogoDataUrlForPdf(): Promise<string | undefined> {
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => {
      try {
        const c = document.createElement('canvas')
        c.width = img.naturalWidth
        c.height = img.naturalHeight
        const ctx = c.getContext('2d')
        if (!ctx) {
          resolve(undefined)
          return
        }
        ctx.drawImage(img, 0, 0)
        resolve(c.toDataURL('image/png'))
      } catch {
        resolve(undefined)
      }
    }
    img.onerror = () => resolve(undefined)
    img.src = fraseLogoUrl
  })
}

function addWrapped(doc: jsPDF, text: string, x: number, y: number, maxW: number, lineHeight: number): number {
  if (!text.trim()) return y
  const lines = doc.splitTextToSize(text, maxW)
  doc.text(lines, x, y)
  return y + lines.length * lineHeight
}

export function reviewPdfFilename(stored: StoredReview): string {
  const safeName = (stored.data.account.customerOrBusinessName || 'visit')
    .replace(/[^\w\d-]+/g, '-')
    .slice(0, 60)
  return `Frase-Annual-Review-${safeName}.pdf`
}

function fillReviewPdf(doc: jsPDF, stored: StoredReview, contentStartY: number): void {
  const margin = 48
  const pageW = doc.internal.pageSize.getWidth()
  const maxW = pageW - margin * 2
  let y = contentStartY
  const d = stored.data
  const lh = 14

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(16)
  y = addWrapped(doc, PRODUCT_TITLE, margin, y, maxW, 18) + 8
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(10)
  y = addWrapped(
    doc,
    `${reviewKindLabel(d.kind)} review · ${d.account.reviewDate || '—'} · Rep: ${d.account.repName || '—'}`,
    margin,
    y,
    maxW,
    lh,
  )
  y += 16

  const section = (title: string) => {
    if (y > 720) {
      doc.addPage()
      y = margin
    }
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(12)
    y = addWrapped(doc, title, margin, y, maxW, 16) + 4
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(10)
  }

  section('Customer / site')
  const siteLines = [
    `Name: ${d.account.customerOrBusinessName || '—'}`,
    `Address: ${d.account.serviceAddress || '—'}`,
    `Contact: ${d.account.contactName || '—'}`,
    `Phone: ${d.account.phone || '—'} · Email: ${d.account.email || '—'}`,
    `System: ${d.account.systemBrand || '—'} · Keypad: ${d.account.primaryKeypadLocation || '—'}`,
    `Mobile app: ${d.account.mobileAppInUse || '—'} · Monitoring: ${d.account.monitoringActive || '—'}`,
  ]
  for (const line of siteLines) {
    y = addWrapped(doc, line, margin, y, maxW, lh)
  }
  if (d.account.notes) y = addWrapped(doc, `Notes: ${d.account.notes}`, margin, y + 4, maxW, lh)
  y += 12

  section('Use snapshot')
  y = addWrapped(
    doc,
    `Arm frequency: ${d.useSnapshot.armFrequency || '—'} · Primary methods: ${d.useSnapshot.primaryMethod.join(', ') || '—'}`,
    margin,
    y,
    maxW,
    lh,
  )
  y = addWrapped(
    doc,
    `Stay/Away: ${d.useSnapshot.understandsStayAway || '—'} · Disarm confidently: ${d.useSnapshot.disarmConfidently || '—'} · Others need training: ${d.useSnapshot.otherUsersNeedTraining || '—'}`,
    margin,
    y,
    maxW,
    lh,
  )
  if (d.useSnapshot.recentIssues.length)
    y = addWrapped(doc, `Recent issues noted: ${d.useSnapshot.recentIssues.join(', ')}`, margin, y, maxW, lh)
  if (d.useSnapshot.issueNotes) y = addWrapped(doc, d.useSnapshot.issueNotes, margin, y + 4, maxW, lh)
  y += 12

  section('Keypad & operation')
  const k = d.keypad
  y = addWrapped(
    doc,
    [
      `Demonstrated arming: ${k.demonstratedArming ? 'Yes' : 'No'}`,
      `Demonstrated disarming: ${k.demonstratedDisarming ? 'Yes' : 'No'}`,
      `Chime/silent explained: ${k.chimeOrSilentExplained ? 'Yes' : 'No'}`,
      `Common messages reviewed: ${k.commonMessagesReviewed ? 'Yes' : 'No'}`,
      `Knows monitoring vs Frase: ${k.knowsMonitoringVsFrase ? 'Yes' : 'No'}`,
      `Trouble visible on visit: ${k.troubleVisibleDuringVisit ? 'Yes' : 'No'}`,
    ].join(' · '),
    margin,
    y,
    maxW,
    lh,
  )
  if (k.notes) y = addWrapped(doc, k.notes, margin, y + 4, maxW, lh)
  y += 12

  section('Mobile app')
  const m = d.mobileApp
  y = addWrapped(
    doc,
    [
      `Installed: ${m.installedOnPrimary ? 'Yes' : 'No'}`,
      `Logged in: ${m.loggedInOk ? 'Yes' : 'No'}`,
      `Arm/disarm in app: ${m.canArmDisarmInApp ? 'Yes' : 'No'}`,
      `Notifications reviewed: ${m.notificationsReviewed ? 'Yes' : 'No'}`,
      `Additional users discussed: ${m.additionalUsersDiscussed ? 'Yes' : 'No'}`,
    ].join(' · '),
    margin,
    y,
    maxW,
    lh,
  )
  if (m.coachingNotes) y = addWrapped(doc, m.coachingNotes, margin, y + 4, maxW, lh)
  y += 12

  section('Devices (visual review)')
  for (const id of DEVICE_CATEGORY_IDS) {
    const row = d.devices[id as DeviceCategoryId]
    const any =
      row.present ||
      row.looksOk ||
      row.customerUnderstands ||
      row.issueFollowUp ||
      row.upgradeOpportunity ||
      row.notes
    if (!any) continue
    const bits: string[] = []
    if (row.present) bits.push('Present')
    if (row.looksOk) bits.push('Looks OK')
    if (row.customerUnderstands) bits.push('Customer understands')
    if (row.issueFollowUp) bits.push('Follow-up')
    if (row.upgradeOpportunity) bits.push('Upgrade opportunity')
    const line = `${DEVICE_LABELS[id] ?? id}: ${bits.join(', ') || '—'}${row.notes ? ` — ${row.notes}` : ''}`
    y = addWrapped(doc, line, margin, y, maxW, lh)
    if (y > 740) {
      doc.addPage()
      y = margin
    }
  }
  y += 12

  section('Recommendations')
  const recLabels = RECOMMENDATION_OPTIONS.filter((o) => d.recommendations.selected[o.id]).map((o) => o.label)
  y = addWrapped(doc, recLabels.length ? recLabels.join(', ') : 'None selected', margin, y, maxW, lh)
  if (d.recommendations.whyTheseFit) y = addWrapped(doc, `Why these fit: ${d.recommendations.whyTheseFit}`, margin, y + 4, maxW, lh)
  y += 12

  section('Outcome')
  const o = d.outcome
  y = addWrapped(
    doc,
    [
      `Trained arm/disarm: ${o.trainedArmDisarm ? 'Yes' : 'No'}`,
      `Trained app: ${o.trainedMobileApp ? 'Yes' : 'No'}`,
      `Service follow-up: ${o.serviceFollowUpNeeded ? 'Yes' : 'No'}`,
      `Quote / more info: ${o.quoteOrMoreInfoRequested ? 'Yes' : 'No'}`,
      `Photos for CRM: ${o.photosForCrm ? 'Yes' : 'No'}`,
    ].join(' · '),
    margin,
    y,
    maxW,
    lh,
  )
  if (o.followUpSummary) y = addWrapped(doc, `Follow-up: ${o.followUpSummary}`, margin, y + 4, maxW, lh)
  if (o.internalNotes) y = addWrapped(doc, `Internal: ${o.internalNotes}`, margin, y + 4, maxW, lh)
  y += 12

  section('Acknowledgment')
  y = addWrapped(
    doc,
    `Customer: ${d.acknowledgment.customerName || '—'} · Date: ${d.acknowledgment.ackDate || '—'} · Rep confirm: ${d.acknowledgment.repNameConfirm || '—'}`,
    margin,
    y,
    maxW,
    lh,
  )
  if (d.acknowledgment.typedAcknowledgment)
    y = addWrapped(doc, d.acknowledgment.typedAcknowledgment, margin, y + 4, maxW, lh)

  if (d.photos.length) {
    y += 16
    section('Photos')
    const imgW = maxW
    const imgH = 180
    for (const ph of d.photos) {
      if (y > 520) {
        doc.addPage()
        y = margin
      }
      const fmt = ph.dataUrl.includes('image/png') ? 'PNG' : 'JPEG'
      doc.addImage(ph.dataUrl, fmt, margin, y, imgW, imgH)
      y += imgH + 8
      if (ph.caption) {
        doc.setFontSize(9)
        y = addWrapped(doc, ph.caption, margin, y, maxW, lh)
        doc.setFontSize(10)
        y += 8
      }
    }
  }
}

async function newPdfDocument(): Promise<jsPDF> {
  const { jsPDF } = await import('jspdf')
  return new jsPDF({ unit: 'pt', format: 'letter' })
}

export async function buildReviewPdf(stored: StoredReview): Promise<jsPDF> {
  const doc = await newPdfDocument()
  const margin = 48
  let y = margin
  const logoData = await loadLogoDataUrlForPdf()
  if (logoData) {
    const logoW = 132
    const logoH = 38
    doc.addImage(logoData, 'PNG', margin, y, logoW, logoH)
    y += logoH + 14
  }
  fillReviewPdf(doc, stored, y)
  return doc
}

export async function getReviewPdfBlob(stored: StoredReview): Promise<Blob> {
  const doc = await buildReviewPdf(stored)
  const ab = doc.output('arraybuffer')
  return new Blob([ab], { type: 'application/pdf' })
}

export async function downloadReviewPdf(stored: StoredReview): Promise<void> {
  const doc = await buildReviewPdf(stored)
  doc.save(reviewPdfFilename(stored))
}
