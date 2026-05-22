import { Navigate, Route, Routes, useParams } from 'react-router-dom'
import { CalculatorProvider } from './context/CalculatorContext'
import { isVerticalId } from './lib/routes'
import { CalculatorPage } from './pages/CalculatorPage'
import { VerticalPickerPage } from './pages/VerticalPickerPage'
import './App.css'

function CalculatorRoute() {
  const { vertical } = useParams()
  if (!isVerticalId(vertical)) {
    return <Navigate to="/" replace />
  }

  return (
    <CalculatorProvider vertical={vertical} key={vertical}>
      <CalculatorPage vertical={vertical} />
    </CalculatorProvider>
  )
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<VerticalPickerPage />} />
      <Route path="/calculate/:vertical/*" element={<CalculatorRoute />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
