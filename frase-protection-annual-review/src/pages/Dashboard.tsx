import { Link } from 'react-router-dom'
import { FraseLogo } from '../components/FraseLogo'
import { POSITIONING, PRODUCT_TITLE, reviewKindLabel } from '../content/copy'
import { newId } from '../lib/id'
import { listReviews } from '../lib/storage'

export function Dashboard() {
  const reviews = listReviews()

  return (
    <div className="app-bg-pattern mx-auto flex min-h-dvh max-w-lg flex-col px-4 pb-10 pt-8 sm:max-w-2xl">
      <header className="mb-8 text-center">
        <div className="mb-4 flex justify-center">
          <FraseLogo />
        </div>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-white sm:text-3xl">{PRODUCT_TITLE}</h1>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-white/65">{POSITIONING.subtitle}</p>
      </header>

      <Link
        to={`/review/${newId()}`}
        className="glass-panel-strong mb-8 block rounded-3xl px-6 py-5 text-center text-lg font-semibold text-white shadow-xl shadow-frase-blue/10 transition hover:bg-white/[0.12]"
      >
        Start new review
      </Link>

      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-white/50">Recent</h2>
        {reviews.length === 0 ? (
          <p className="glass-panel rounded-2xl px-4 py-6 text-center text-sm text-white/55">
            No saved reviews yet. Start a new visit when you arrive on site.
          </p>
        ) : (
          <ul className="space-y-2">
            {reviews.map((r) => {
              const name = r.data.account.customerOrBusinessName || 'Untitled visit'
              return (
                <li key={r.id}>
                  <Link
                    to={`/review/${r.id}`}
                    className="glass-panel flex items-center justify-between gap-3 rounded-2xl px-4 py-4 transition hover:bg-white/[0.08]"
                  >
                    <div className="min-w-0 text-left">
                      <p className="truncate font-medium text-white">{name}</p>
                      <p className="text-xs text-white/50">
                        {reviewKindLabel(r.data.kind)} ·{' '}
                        {r.status === 'completed' ? 'Completed' : 'Draft'} ·{' '}
                        {new Date(r.updatedAt).toLocaleString()}
                      </p>
                    </div>
                    <span className="shrink-0 text-frase-blue-light" aria-hidden>
                      →
                    </span>
                  </Link>
                </li>
              )
            })}
          </ul>
        )}
      </section>
    </div>
  )
}
