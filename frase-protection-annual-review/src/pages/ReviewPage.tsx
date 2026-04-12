import { useCallback, useEffect, useRef, useState } from 'react'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import { FraseLogo } from '../components/FraseLogo'
import { PRODUCT_TITLE } from '../content/copy'
import { createEmptyReviewData } from '../lib/defaults'
import { getReview, saveReview } from '../lib/storage'
import type { ReviewData, StoredReview } from '../types/review'
import { WIZARD_STEP_COUNT } from '../wizard/constants'
import { WizardSteps } from '../wizard/WizardSteps'

function loadOrCreateReview(reviewId: string): StoredReview {
  const existing = getReview(reviewId)
  if (existing) return existing
  const fresh: StoredReview = {
    id: reviewId,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    status: 'draft',
    currentStep: 0,
    data: createEmptyReviewData('residential'),
  }
  void saveReview(fresh)
  return fresh
}

function ReviewSession({ reviewId }: { reviewId: string }) {
  const navigate = useNavigate()
  const [review, setReview] = useState<StoredReview>(() => loadOrCreateReview(reviewId))
  const [storageError, setStorageError] = useState<string | null>(null)
  const skipInitialAutosave = useRef(true)

  useEffect(() => {
    if (skipInitialAutosave.current) {
      skipInitialAutosave.current = false
      return
    }
    const t = window.setTimeout(() => {
      const ok = saveReview(review)
      setStorageError(
        ok
          ? null
          : 'Could not save — storage may be full. Remove photos or delete old reviews from the home screen.',
      )
    }, 450)
    return () => window.clearTimeout(t)
  }, [review])

  const patch = useCallback((fn: (prev: ReviewData) => ReviewData) => {
    setReview((r) =>
      r
        ? {
            ...r,
            data: fn(r.data),
            updatedAt: new Date().toISOString(),
          }
        : r,
    )
  }, [])

  const setStep = useCallback((n: number) => {
    setReview((r) =>
      r
        ? {
            ...r,
            currentStep: Math.max(0, Math.min(WIZARD_STEP_COUNT - 1, n)),
            updatedAt: new Date().toISOString(),
          }
        : r,
    )
  }, [])

  const markComplete = useCallback(() => {
    setReview((r) => {
      if (!r) return r
      const next = { ...r, status: 'completed' as const, updatedAt: new Date().toISOString() }
      saveReview(next)
      return next
    })
    navigate('/')
  }, [navigate])

  const step = review.currentStep
  const progress = ((step + 1) / WIZARD_STEP_COUNT) * 100

  return (
    <div className="app-bg-pattern mx-auto flex min-h-dvh max-w-lg flex-col px-4 pb-28 pt-6 sm:max-w-2xl">
      {storageError ? (
        <div
          role="alert"
          className="mb-4 rounded-2xl border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-sm text-amber-100"
        >
          {storageError}
        </div>
      ) : null}
      <header className="mb-4 shrink-0">
        <div className="mb-3 flex items-center justify-between gap-2">
          <Link to="/" className="text-sm font-medium text-frase-blue-light hover:underline">
            ← Home
          </Link>
          <span className="text-xs text-white/45">Autosaved</span>
        </div>
        <div className="mb-2 flex justify-center">
          <FraseLogo compact className="w-fit" />
        </div>
        <h1 className="mt-1 text-lg font-semibold leading-tight text-white">{PRODUCT_TITLE}</h1>
        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-gradient-to-r from-frase-blue-dark via-frase-blue to-frase-blue-light transition-[width] duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="mt-2 text-xs text-white/50">
          Step {step + 1} of {WIZARD_STEP_COUNT}
        </p>
      </header>

      <main id="review-main" className="flex min-h-0 flex-1 flex-col" aria-label="Review form">
        <WizardSteps
          step={step}
          data={review.data}
          patch={patch}
          stored={review}
          onComplete={markComplete}
        />
      </main>

      <nav className="fixed bottom-0 left-0 right-0 z-10 border-t border-white/10 bg-[#0a1628]/90 px-4 py-3 backdrop-blur-md">
        <div className="mx-auto flex max-w-lg items-center justify-between gap-3 sm:max-w-2xl">
          <button
            type="button"
            disabled={step <= 0}
            onClick={() => setStep(step - 1)}
            className="min-h-[48px] min-w-[100px] rounded-2xl border border-white/15 px-4 text-sm font-medium text-white disabled:opacity-30"
          >
            Back
          </button>
          {step < WIZARD_STEP_COUNT - 1 ? (
            <button
              type="button"
              onClick={() => setStep(step + 1)}
              className="min-h-[48px] min-w-[120px] rounded-2xl bg-frase-blue px-5 text-sm font-semibold text-white shadow-lg shadow-frase-blue/25 hover:bg-frase-blue-light"
            >
              Next
            </button>
          ) : (
            <Link
              to="/"
              className="min-h-[48px] min-w-[120px] rounded-2xl border border-white/20 px-5 py-3 text-center text-sm font-semibold text-white/90 hover:bg-white/10"
            >
              Dashboard
            </Link>
          )}
        </div>
      </nav>
    </div>
  )
}

export function ReviewPage() {
  const { reviewId } = useParams<{ reviewId: string }>()
  if (!reviewId) {
    return <Navigate to="/" replace />
  }
  return <ReviewSession key={reviewId} reviewId={reviewId} />
}
