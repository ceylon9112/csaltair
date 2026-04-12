import { useMemo, useRef } from 'react'
import { Field } from '../components/ui/Field'
import { GlassCard } from '../components/ui/GlassCard'
import { SignaturePad } from '../components/SignaturePad'
import { SegmentedYesNo } from '../components/ui/SegmentedYesNo'
import { StepShell } from '../components/ui/StepShell'
import { TapCheck } from '../components/ui/TapCheck'
import {
  DEVICE_LABELS,
  POSITIONING,
  recommendationsIntro,
  reviewKindLabel,
  snapshotHintsForKind,
} from '../content/copy'
import { newId } from '../lib/id'
import { downloadReviewPdf } from '../lib/pdfExport'
import { shareReviewPdf } from '../lib/shareReviewPdf'
import type { DeviceCategoryId, ReviewData, StoredReview } from '../types/review'
import { DEVICE_CATEGORY_IDS, RECOMMENDATION_OPTIONS, SNAPSHOT_ISSUE_CHIPS } from '../types/review'
import { STEP_META } from './constants'

type Patch = (fn: (prev: ReviewData) => ReviewData) => void

const PRIMARY_METHODS = [
  { id: 'keypad', label: 'Keypad' },
  { id: 'mobile', label: 'Mobile app' },
  { id: 'keyfob', label: 'Key fob' },
  { id: 'other', label: 'Other' },
] as const

function toggleMethod(list: string[], id: string): string[] {
  const s = new Set(list)
  if (s.has(id)) s.delete(id)
  else s.add(id)
  return [...s]
}

type StepProps = {
  data: ReviewData
  patch: Patch
  stored: StoredReview
  onComplete: () => void
}

export function WizardSteps({ step, data, patch, stored, onComplete }: StepProps & { step: number }) {
  const meta = STEP_META[step]
  if (!meta) return null

  switch (step) {
    case 0:
      return (
        <StepShell title={meta.title} subtitle={meta.subtitle}>
          <p className="text-sm text-white/65">{POSITIONING.subtitle}</p>
          <div className="grid gap-3 sm:grid-cols-2">
            {(['residential', 'commercial'] as const).map((kind) => {
              const active = data.kind === kind
              return (
                <button
                  key={kind}
                  type="button"
                  onClick={() => patch((d) => ({ ...d, kind }))}
                  className={`rounded-3xl border px-5 py-6 text-left transition active:scale-[0.99] ${
                    active
                      ? 'border-frase-blue-light/60 bg-frase-blue/20 shadow-lg shadow-frase-blue/15'
                      : 'glass-panel border-white/15'
                  }`}
                >
                  <div className="text-lg font-semibold text-white">{reviewKindLabel(kind)}</div>
                  <p className="mt-2 text-sm leading-relaxed text-white/65">
                    {kind === 'residential'
                      ? 'Home-focused prompts: household use, convenience, and lifestyle upgrades.'
                      : 'Operations-focused prompts: access, visibility, and after-hours awareness.'}
                  </p>
                </button>
              )
            })}
          </div>
        </StepShell>
      )
    case 1:
      return (
        <StepShell title={meta.title} subtitle={meta.subtitle}>
          <div className="space-y-4">
            <Field
              label={data.kind === 'residential' ? 'Customer name' : 'Business name'}
              value={data.account.customerOrBusinessName}
              onChange={(v) => patch((d) => ({ ...d, account: { ...d.account, customerOrBusinessName: v } }))}
              placeholder="Required for the PDF header"
            />
            <Field
              label="Service address"
              value={data.account.serviceAddress}
              onChange={(v) => patch((d) => ({ ...d, account: { ...d.account, serviceAddress: v } }))}
            />
            <Field
              label="Contact name"
              value={data.account.contactName}
              onChange={(v) => patch((d) => ({ ...d, account: { ...d.account, contactName: v } }))}
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <Field
                label="Best phone"
                type="tel"
                value={data.account.phone}
                onChange={(v) => patch((d) => ({ ...d, account: { ...d.account, phone: v } }))}
              />
              <Field
                label="Email"
                type="email"
                value={data.account.email}
                onChange={(v) => patch((d) => ({ ...d, account: { ...d.account, email: v } }))}
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field
                label="Rep name"
                value={data.account.repName}
                onChange={(v) => patch((d) => ({ ...d, account: { ...d.account, repName: v } }))}
              />
              <Field
                label="Review date"
                type="date"
                value={data.account.reviewDate}
                onChange={(v) => patch((d) => ({ ...d, account: { ...d.account, reviewDate: v } }))}
              />
            </div>
            <Field
              label="System brand / platform"
              value={data.account.systemBrand}
              onChange={(v) => patch((d) => ({ ...d, account: { ...d.account, systemBrand: v } }))}
              placeholder="e.g. panel brand / platform"
            />
            <Field
              label="Primary keypad location"
              value={data.account.primaryKeypadLocation}
              onChange={(v) => patch((d) => ({ ...d, account: { ...d.account, primaryKeypadLocation: v } }))}
            />
            <Field
              label="Mobile app in use"
              value={data.account.mobileAppInUse}
              onChange={(v) => patch((d) => ({ ...d, account: { ...d.account, mobileAppInUse: v } }))}
              placeholder="e.g. Alarm.com"
            />
            <div className="space-y-2">
              <p className="text-sm font-medium text-white/80">Monitoring active</p>
              <div className="flex flex-wrap gap-2">
                {(
                  [
                    ['yes', 'Yes'],
                    ['no', 'No'],
                    ['unknown', 'Unsure'],
                  ] as const
                ).map(([key, text]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() =>
                      patch((d) => ({
                        ...d,
                        account: {
                          ...d.account,
                          monitoringActive: d.account.monitoringActive === key ? '' : key,
                        },
                      }))
                    }
                    className={`min-h-[44px] rounded-full px-4 py-2 text-sm font-medium transition ${
                      data.account.monitoringActive === key
                        ? 'bg-frase-blue text-white'
                        : 'bg-white/10 text-white/80 hover:bg-white/15'
                    }`}
                  >
                    {text}
                  </button>
                ))}
              </div>
            </div>
            <Field
              label="Optional visit notes"
              rows={3}
              value={data.account.notes}
              onChange={(v) => patch((d) => ({ ...d, account: { ...d.account, notes: v } }))}
            />
          </div>
        </StepShell>
      )
    case 2:
      return (
        <StepShell title={meta.title} subtitle={snapshotHintsForKind(data.kind)}>
          <Field
            label="How often is the system armed?"
            value={data.useSnapshot.armFrequency}
            onChange={(v) => patch((d) => ({ ...d, useSnapshot: { ...d.useSnapshot, armFrequency: v } }))}
            placeholder="e.g. nightly, when away, irregular"
          />
          <div className="space-y-2">
            <p className="text-sm font-medium text-white/80">Primary method used (tap all that apply)</p>
            <div className="flex flex-wrap gap-2">
              {PRIMARY_METHODS.map(({ id, label }) => {
                const on = data.useSnapshot.primaryMethod.includes(id)
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() =>
                      patch((d) => ({
                        ...d,
                        useSnapshot: {
                          ...d.useSnapshot,
                          primaryMethod: toggleMethod(d.useSnapshot.primaryMethod, id),
                        },
                      }))
                    }
                    className={`min-h-[44px] rounded-full px-4 py-2 text-sm font-medium transition ${
                      on ? 'bg-frase-blue text-white' : 'bg-white/10 text-white/80 hover:bg-white/15'
                    }`}
                  >
                    {label}
                  </button>
                )
              })}
            </div>
          </div>
          <SegmentedYesNo
            variant="yes-no-partial"
            label="Customer understands Stay vs Away"
            value={data.useSnapshot.understandsStayAway}
            onChange={(v) => patch((d) => ({ ...d, useSnapshot: { ...d.useSnapshot, understandsStayAway: v } }))}
          />
          <SegmentedYesNo
            variant="yes-no-partial"
            label="Customer can disarm confidently"
            value={data.useSnapshot.disarmConfidently}
            onChange={(v) => patch((d) => ({ ...d, useSnapshot: { ...d.useSnapshot, disarmConfidently: v } }))}
          />
          <SegmentedYesNo
            variant="yes-no-unknown"
            label="Other users may need training"
            value={data.useSnapshot.otherUsersNeedTraining}
            onChange={(v) =>
              patch((d) => ({ ...d, useSnapshot: { ...d.useSnapshot, otherUsersNeedTraining: v } }))
            }
          />
          <div className="space-y-2">
            <p className="text-sm font-medium text-white/80">Recent beeping, trouble, or false alarms?</p>
            <div className="flex flex-wrap gap-2">
              {SNAPSHOT_ISSUE_CHIPS.map((id) => {
                const on = data.useSnapshot.recentIssues.includes(id)
                const labels: Record<string, string> = {
                  beeping: 'Beeping',
                  trouble_messages: 'Trouble messages',
                  false_alarms: 'False alarms',
                  none_reported: 'None reported',
                }
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() =>
                      patch((d) => {
                        const set = new Set(d.useSnapshot.recentIssues)
                        if (set.has(id)) set.delete(id)
                        else set.add(id)
                        return {
                          ...d,
                          useSnapshot: { ...d.useSnapshot, recentIssues: [...set] },
                        }
                      })
                    }
                    className={`min-h-[44px] rounded-full px-4 py-2 text-sm font-medium transition ${
                      on ? 'bg-frase-blue text-white' : 'bg-white/10 text-white/80 hover:bg-white/15'
                    }`}
                  >
                    {labels[id]}
                  </button>
                )
              })}
            </div>
          </div>
          <Field
            label="Customer questions or frustrations"
            rows={3}
            value={data.useSnapshot.issueNotes}
            onChange={(v) => patch((d) => ({ ...d, useSnapshot: { ...d.useSnapshot, issueNotes: v } }))}
          />
        </StepShell>
      )
    case 3:
      return (
        <StepShell
          title={meta.title}
          subtitle="A coaching review — not a pass/fail test. Tap each item you covered."
        >
          <div className="space-y-3">
            <TapCheck
              label="Customer demonstrated arming"
              checked={data.keypad.demonstratedArming}
              onChange={(v) => patch((d) => ({ ...d, keypad: { ...d.keypad, demonstratedArming: v } }))}
            />
            <TapCheck
              label="Customer demonstrated disarming"
              checked={data.keypad.demonstratedDisarming}
              onChange={(v) => patch((d) => ({ ...d, keypad: { ...d.keypad, demonstratedDisarming: v } }))}
            />
            <TapCheck
              label="Chime or silent mode explained (if applicable)"
              checked={data.keypad.chimeOrSilentExplained}
              onChange={(v) => patch((d) => ({ ...d, keypad: { ...d.keypad, chimeOrSilentExplained: v } }))}
            />
            <TapCheck
              label="Common messages reviewed (low battery, bypass, sensor trouble)"
              checked={data.keypad.commonMessagesReviewed}
              onChange={(v) => patch((d) => ({ ...d, keypad: { ...d.keypad, commonMessagesReviewed: v } }))}
            />
            <TapCheck
              label="Customer knows when to call monitoring vs Frase Protection"
              checked={data.keypad.knowsMonitoringVsFrase}
              onChange={(v) => patch((d) => ({ ...d, keypad: { ...d.keypad, knowsMonitoringVsFrase: v } }))}
            />
            <TapCheck
              label="Visible trouble message during visit"
              checked={data.keypad.troubleVisibleDuringVisit}
              onChange={(v) => patch((d) => ({ ...d, keypad: { ...d.keypad, troubleVisibleDuringVisit: v } }))}
            />
            <Field
              label="Notes"
              rows={3}
              value={data.keypad.notes}
              onChange={(v) => patch((d) => ({ ...d, keypad: { ...d.keypad, notes: v } }))}
            />
          </div>
        </StepShell>
      )
    case 4:
      return (
        <StepShell title={meta.title} subtitle="Strong app use supports retention — quick taps for what you verified.">
          <div className="space-y-3">
            <TapCheck
              label="App installed on primary device"
              checked={data.mobileApp.installedOnPrimary}
              onChange={(v) => patch((d) => ({ ...d, mobileApp: { ...d.mobileApp, installedOnPrimary: v } }))}
            />
            <TapCheck
              label="Customer logged in successfully"
              checked={data.mobileApp.loggedInOk}
              onChange={(v) => patch((d) => ({ ...d, mobileApp: { ...d.mobileApp, loggedInOk: v } }))}
            />
            <TapCheck
              label="Customer can arm / disarm from the app"
              checked={data.mobileApp.canArmDisarmInApp}
              onChange={(v) => patch((d) => ({ ...d, mobileApp: { ...d.mobileApp, canArmDisarmInApp: v } }))}
            />
            <TapCheck
              label="Notifications reviewed"
              checked={data.mobileApp.notificationsReviewed}
              onChange={(v) => patch((d) => ({ ...d, mobileApp: { ...d.mobileApp, notificationsReviewed: v } }))}
            />
            <TapCheck
              label="Additional users discussed"
              checked={data.mobileApp.additionalUsersDiscussed}
              onChange={(v) =>
                patch((d) => ({ ...d, mobileApp: { ...d.mobileApp, additionalUsersDiscussed: v } }))
              }
            />
            <Field
              label="Questions or coaching notes"
              rows={3}
              value={data.mobileApp.coachingNotes}
              onChange={(v) => patch((d) => ({ ...d, mobileApp: { ...d.mobileApp, coachingNotes: v } }))}
            />
          </div>
        </StepShell>
      )
    case 5:
      return (
        <StepShell
          title={meta.title}
          subtitle="Stacked cards per category — tap to mark what applies. This is a basic visual review only."
        >
          <div className="space-y-4">
            {DEVICE_CATEGORY_IDS.map((id) => (
              <DeviceCategoryCard
                key={id}
                id={id}
                label={DEVICE_LABELS[id] ?? id}
                row={data.devices[id]}
                patch={patch}
              />
            ))}
          </div>
        </StepShell>
      )
    case 6:
      return (
        <StepShell title={meta.title} subtitle={recommendationsIntro(data.kind)}>
          <div className="space-y-3">
            {RECOMMENDATION_OPTIONS.map((opt) => (
              <TapCheck
                key={opt.id}
                label={opt.label}
                checked={!!data.recommendations.selected[opt.id]}
                onChange={(v) =>
                  patch((d) => ({
                    ...d,
                    recommendations: {
                      ...d.recommendations,
                      selected: { ...d.recommendations.selected, [opt.id]: v },
                    },
                  }))
                }
              />
            ))}
            <Field
              label="Why these recommendations fit this customer / site"
              rows={4}
              value={data.recommendations.whyTheseFit}
              onChange={(v) =>
                patch((d) => ({
                  ...d,
                  recommendations: { ...d.recommendations, whyTheseFit: v },
                }))
              }
            />
          </div>
        </StepShell>
      )
    case 7:
      return (
        <StepShell title={meta.title} subtitle="Leave the visit with clarity on training and follow-up.">
          <div className="space-y-3">
            <TapCheck
              label="Customer trained on arm / disarm"
              checked={data.outcome.trainedArmDisarm}
              onChange={(v) => patch((d) => ({ ...d, outcome: { ...d.outcome, trainedArmDisarm: v } }))}
            />
            <TapCheck
              label="Customer trained on mobile app"
              checked={data.outcome.trainedMobileApp}
              onChange={(v) => patch((d) => ({ ...d, outcome: { ...d.outcome, trainedMobileApp: v } }))}
            />
            <TapCheck
              label="Basic issue observed — service follow-up may be needed"
              checked={data.outcome.serviceFollowUpNeeded}
              onChange={(v) => patch((d) => ({ ...d, outcome: { ...d.outcome, serviceFollowUpNeeded: v } }))}
            />
            <TapCheck
              label="Customer requested quote or more information"
              checked={data.outcome.quoteOrMoreInfoRequested}
              onChange={(v) =>
                patch((d) => ({ ...d, outcome: { ...d.outcome, quoteOrMoreInfoRequested: v } }))
              }
            />
            <TapCheck
              label="Photos intended for CRM / archive upload"
              checked={data.outcome.photosForCrm}
              onChange={(v) => patch((d) => ({ ...d, outcome: { ...d.outcome, photosForCrm: v } }))}
            />
            <Field
              label="Follow-up summary"
              rows={3}
              value={data.outcome.followUpSummary}
              onChange={(v) => patch((d) => ({ ...d, outcome: { ...d.outcome, followUpSummary: v } }))}
            />
            <Field
              label="Internal notes (optional)"
              rows={3}
              value={data.outcome.internalNotes}
              onChange={(v) => patch((d) => ({ ...d, outcome: { ...d.outcome, internalNotes: v } }))}
            />
          </div>
        </StepShell>
      )
    case 8:
      return <PhotosStep meta={meta} data={data} patch={patch} />
    case 9:
      return (
        <StepShell
          title={meta.title}
          subtitle="Confirm this was a basic system review and coaching visit — not a formal inspection or certification."
        >
          <GlassCard className="space-y-4">
            <Field
              label="Customer printed name"
              value={data.acknowledgment.customerName}
              onChange={(v) =>
                patch((d) => ({
                  ...d,
                  acknowledgment: { ...d.acknowledgment, customerName: v },
                }))
              }
            />
            <Field
              label="Acknowledgment date"
              type="date"
              value={data.acknowledgment.ackDate}
              onChange={(v) =>
                patch((d) => ({
                  ...d,
                  acknowledgment: { ...d.acknowledgment, ackDate: v },
                }))
              }
            />
            <SignaturePad
              label="Customer signature"
              value={data.acknowledgment.customerSignatureDataUrl}
              onChange={(v) =>
                patch((d) => ({
                  ...d,
                  acknowledgment: { ...d.acknowledgment, customerSignatureDataUrl: v },
                }))
              }
            />
            <Field
              label="Rep confirmation (name)"
              value={data.acknowledgment.repNameConfirm}
              onChange={(v) =>
                patch((d) => ({
                  ...d,
                  acknowledgment: { ...d.acknowledgment, repNameConfirm: v },
                }))
              }
            />
            <SignaturePad
              label="Rep signature"
              value={data.acknowledgment.repSignatureDataUrl}
              onChange={(v) =>
                patch((d) => ({
                  ...d,
                  acknowledgment: { ...d.acknowledgment, repSignatureDataUrl: v },
                }))
              }
            />
            <Field
              label="Typed acknowledgment (optional if signatures used)"
              rows={3}
              value={data.acknowledgment.typedAcknowledgment}
              onChange={(v) =>
                patch((d) => ({
                  ...d,
                  acknowledgment: { ...d.acknowledgment, typedAcknowledgment: v },
                }))
              }
              placeholder="e.g. Customer understands this visit was educational and not a certified inspection."
            />
          </GlassCard>
        </StepShell>
      )
    case 10:
      return <SummaryStep meta={meta} stored={stored} onComplete={onComplete} />
    default:
      return null
  }
}

function DeviceCategoryCard({
  id,
  label,
  row,
  patch,
}: {
  id: DeviceCategoryId
  label: string
  row: ReviewData['devices'][DeviceCategoryId]
  patch: Patch
}) {
  return (
    <GlassCard>
      <h3 className="mb-3 text-base font-semibold text-white">{label}</h3>
      <div className="space-y-2">
        <TapCheck
          label="Present on site"
          checked={row.present}
          onChange={(v) =>
            patch((d) => ({
              ...d,
              devices: { ...d.devices, [id]: { ...d.devices[id], present: v } },
            }))
          }
        />
        <TapCheck
          label="Looks OK / visually acceptable"
          checked={row.looksOk}
          onChange={(v) =>
            patch((d) => ({
              ...d,
              devices: { ...d.devices, [id]: { ...d.devices[id], looksOk: v } },
            }))
          }
        />
        <TapCheck
          label="Customer understands use"
          checked={row.customerUnderstands}
          onChange={(v) =>
            patch((d) => ({
              ...d,
              devices: { ...d.devices, [id]: { ...d.devices[id], customerUnderstands: v } },
            }))
          }
        />
        <TapCheck
          label="Issue or follow-up needed"
          checked={row.issueFollowUp}
          onChange={(v) =>
            patch((d) => ({
              ...d,
              devices: { ...d.devices, [id]: { ...d.devices[id], issueFollowUp: v } },
            }))
          }
        />
        <TapCheck
          label="Upgrade opportunity"
          checked={row.upgradeOpportunity}
          onChange={(v) =>
            patch((d) => ({
              ...d,
              devices: { ...d.devices, [id]: { ...d.devices[id], upgradeOpportunity: v } },
            }))
          }
        />
        <Field
          label="Notes"
          value={row.notes}
          onChange={(v) =>
            patch((d) => ({
              ...d,
              devices: { ...d.devices, [id]: { ...d.devices[id], notes: v } },
            }))
          }
          rows={2}
        />
      </div>
    </GlassCard>
  )
}

function PhotosStep({
  meta,
  data,
  patch,
}: {
  meta: { title: string; subtitle: string }
  data: ReviewData
  patch: Patch
}) {
  const inputRef = useRef<HTMLInputElement>(null)

  const addFiles = (files: FileList | null) => {
    if (!files?.length) return
    const remaining = 5 - data.photos.length
    const toRead = Math.min(remaining, files.length)
    for (let i = 0; i < toRead; i++) {
      const f = files[i]
      const reader = new FileReader()
      reader.onload = () => {
        const dataUrl = reader.result as string
        patch((d) => ({
          ...d,
          photos: [
            ...d.photos,
            { id: newId(), dataUrl, caption: '' },
          ],
        }))
      }
      reader.readAsDataURL(f)
    }
  }

  return (
    <StepShell title={meta.title} subtitle={meta.subtitle}>
      <p className="text-sm text-white/65">Optional — up to five photos. Compress large images for best PDF size.</p>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={data.photos.length >= 5}
        className="min-h-[48px] w-full rounded-2xl border border-dashed border-white/25 bg-white/5 py-3 text-sm font-medium text-white/90 hover:bg-white/10 disabled:opacity-40"
      >
        {data.photos.length >= 5 ? 'Maximum 5 photos' : 'Add photo from device'}
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={(e) => {
          addFiles(e.target.files)
          e.target.value = ''
        }}
      />
      <div className="space-y-4">
        {data.photos.map((ph) => (
          <GlassCard key={ph.id} className="!p-3">
            <div className="flex gap-3">
              <img src={ph.dataUrl} alt="" className="h-24 w-24 shrink-0 rounded-xl object-cover" />
              <div className="min-w-0 flex-1 space-y-2">
                <input
                  className="w-full rounded-lg border border-white/15 bg-white/5 px-2 py-1.5 text-sm text-white placeholder:text-white/35"
                  placeholder="Caption (optional)"
                  value={ph.caption}
                  onChange={(e) =>
                    patch((d) => ({
                      ...d,
                      photos: d.photos.map((p) =>
                        p.id === ph.id ? { ...p, caption: e.target.value } : p,
                      ),
                    }))
                  }
                />
                <button
                  type="button"
                  className="text-sm text-rose-300 hover:underline"
                  onClick={() =>
                    patch((d) => ({
                      ...d,
                      photos: d.photos.filter((p) => p.id !== ph.id),
                    }))
                  }
                >
                  Remove
                </button>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>
    </StepShell>
  )
}

function SummaryStep({
  meta,
  stored,
  onComplete,
}: {
  meta: { title: string; subtitle: string }
  stored: StoredReview
  onComplete: () => void
}) {
  const d = stored.data
  const recs = useMemo(
    () =>
      RECOMMENDATION_OPTIONS.filter((o) => d.recommendations.selected[o.id]).map((o) => o.label),
    [d.recommendations.selected],
  )

  return (
    <StepShell title={meta.title} subtitle={meta.subtitle}>
      <div className="space-y-3 text-sm leading-relaxed text-white/85">
        <GlassCard className="!p-4">
          <h3 className="text-base font-semibold text-white">Visit</h3>
          <p className="mt-1">
            {reviewKindLabel(d.kind)} · {d.account.reviewDate || '—'}
          </p>
          <p>
            {d.account.customerOrBusinessName || '—'} — {d.account.serviceAddress || '—'}
          </p>
          <p className="text-white/65">
            Rep {d.account.repName || '—'} · {d.account.phone || '—'} · {d.account.email || '—'}
          </p>
        </GlassCard>
        <GlassCard className="!p-4">
          <h3 className="text-base font-semibold text-white">Recommendations</h3>
          <p>{recs.length ? recs.join(', ') : 'None selected'}</p>
        </GlassCard>
        <GlassCard className="!p-4">
          <h3 className="text-base font-semibold text-white">Photos</h3>
          <p>{d.photos.length ? `${d.photos.length} attached` : 'None'}</p>
        </GlassCard>
        <GlassCard className="!p-4">
          <h3 className="text-base font-semibold text-white">Acknowledgment</h3>
          <p>
            {d.acknowledgment.customerName || '—'} · {d.acknowledgment.ackDate || '—'}
          </p>
        </GlassCard>
      </div>
      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={() => void downloadReviewPdf(stored)}
          className="min-h-[48px] flex-1 rounded-2xl bg-frase-blue px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-frase-blue/30 hover:bg-frase-blue-light"
        >
          Download PDF
        </button>
        <button
          type="button"
          onClick={() => void shareReviewPdf(stored)}
          className="min-h-[48px] flex-1 rounded-2xl border border-white/20 bg-white/5 px-4 py-3 text-sm font-semibold text-white hover:bg-white/10"
        >
          Share report
        </button>
      </div>
      <p className="mt-2 text-center text-xs text-white/50">
        Sharing sends the PDF as an attachment when your device supports it. Otherwise the file downloads
        so you can attach it manually.
      </p>
      <button
        type="button"
        onClick={onComplete}
        className="mt-4 w-full min-h-[48px] rounded-2xl border border-frase-blue-light/40 bg-frase-blue/10 px-4 py-3 text-sm font-semibold text-blue-100 hover:bg-frase-blue/20"
      >
        Mark review complete
      </button>
    </StepShell>
  )
}
