import { lazy, Suspense } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'

const Dashboard = lazy(async () => {
  const m = await import('./pages/Dashboard')
  return { default: m.Dashboard }
})

const ReviewPage = lazy(async () => {
  const m = await import('./pages/ReviewPage')
  return { default: m.ReviewPage }
})

function RouteFallback() {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-[#0b1220] text-sm text-white/70">
      Loading…
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<RouteFallback />}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/review/:reviewId" element={<ReviewPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}

export default App
