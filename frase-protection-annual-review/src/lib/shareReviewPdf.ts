import type { StoredReview } from '../types/review'
import { downloadReviewPdf, getReviewPdfBlob, reviewPdfFilename } from './pdfExport'

/**
 * Share the review PDF via the system share sheet.
 * Uses `{ files: [...] }` only — adding `title`/`text`/`url` can cause some mail clients to omit attachments.
 */
export async function shareReviewPdf(stored: StoredReview): Promise<void> {
  const filename = reviewPdfFilename(stored)
  const blob = await getReviewPdfBlob(stored)
  const file = new File([blob], filename, {
    type: 'application/pdf',
    lastModified: Date.now(),
  })

  const data: ShareData = { files: [file] }

  if (typeof navigator.share !== 'function') {
    await downloadReviewPdf(stored)
    return
  }

  try {
    await navigator.share(data)
  } catch (e) {
    const err = e as Error & { name?: string }
    if (err.name === 'AbortError') return
    await downloadReviewPdf(stored)
  }
}
