import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { buildInputsFromVertical, DEFAULT_THRESHOLDS } from '../data/verticals'
import type { CalculatorInputs, RoiThresholds, VerticalId } from '../types'

interface CalculatorContextValue {
  inputs: CalculatorInputs
  thresholds: RoiThresholds
  patchInputs: (patch: Partial<CalculatorInputs>) => void
  patchThresholds: (patch: Partial<RoiThresholds>) => void
  resetThresholds: () => void
  resetForVertical: (vertical: VerticalId) => void
}

const CalculatorContext = createContext<CalculatorContextValue | null>(null)

export function CalculatorProvider({
  vertical,
  children,
}: {
  vertical: VerticalId
  children: ReactNode
}) {
  const [inputs, setInputs] = useState(() => buildInputsFromVertical(vertical))
  const [thresholds, setThresholds] = useState<RoiThresholds>({ ...DEFAULT_THRESHOLDS })

  const resetForVertical = useCallback((next: VerticalId) => {
    setInputs(buildInputsFromVertical(next))
    setThresholds({ ...DEFAULT_THRESHOLDS })
  }, [])

  const value = useMemo(
    (): CalculatorContextValue => ({
      inputs,
      thresholds,
      patchInputs: (patch) => setInputs((prev) => ({ ...prev, ...patch })),
      patchThresholds: (patch) => setThresholds((prev) => ({ ...prev, ...patch })),
      resetThresholds: () => setThresholds({ ...DEFAULT_THRESHOLDS }),
      resetForVertical,
    }),
    [inputs, thresholds, resetForVertical],
  )

  return <CalculatorContext.Provider value={value}>{children}</CalculatorContext.Provider>
}

export function useCalculator() {
  const ctx = useContext(CalculatorContext)
  if (!ctx) throw new Error('useCalculator must be used within CalculatorProvider')
  return ctx
}
