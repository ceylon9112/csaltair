import { formatCurrency, formatCurrencyDetailed } from '../lib/calculate'
import type { CalculationResult, CalculatorInputs } from '../types'
import { OutcomeBadge } from './OutcomeBadge'

export function ResultsPanel({
  result,
  inputs,
}: {
  result: CalculationResult
  inputs: CalculatorInputs
}) {
  const hardTotal = result.hardSavingsAnnual * inputs.contractTermYears
  const opTotal = result.operationalValueAnnual * inputs.contractTermYears
  const signingDue = inputs.equipmentInstallCost * 0.5
  const completionDue = inputs.equipmentInstallCost * 0.5

  return (
    <section className="section results-panel" id="results">
      <h2>Results</h2>

      <OutcomeBadge outcome={result.outcome} text={result.outcomeText} />

      <div className="summary-table">
        <h3>Financial Summary</h3>
        <table>
          <tbody>
            <tr>
              <td>Total system cost</td>
              <td>{formatCurrency(result.totalSystemCost)}</td>
            </tr>
            <tr>
              <td>Hard savings (annual)</td>
              <td>{formatCurrency(result.hardSavingsAnnual)}</td>
            </tr>
            <tr>
              <td>Hard savings over contract term</td>
              <td>{formatCurrency(hardTotal)}</td>
            </tr>
            <tr>
              <td>Operational value (annual)</td>
              <td>{formatCurrency(result.operationalValueAnnual)}</td>
            </tr>
            <tr>
              <td>Operational value over contract term</td>
              <td>{formatCurrency(opTotal)}</td>
            </tr>
            {inputs.includeGuardService && (
              <tr>
                <td>Guard service savings (annual, included)</td>
                <td>{formatCurrency(result.hardBreakdown.guardService)}</td>
              </tr>
            )}
            <tr className="row-emphasis">
              <td>Total annual savings</td>
              <td>{formatCurrency(result.totalAnnualSavings)}</td>
            </tr>
            <tr className="row-emphasis">
              <td>Net benefit over contract term</td>
              <td>{formatCurrency(result.netBenefit)}</td>
            </tr>
            <tr>
              <td>Simple payback period</td>
              <td>
                {result.totalAnnualSavings > 0
                  ? `${result.paybackMonths} months`
                  : 'N/A'}
              </td>
            </tr>
            <tr>
              <td>ROI % over contract term</td>
              <td>{result.roiPercent.toFixed(1)}%</td>
            </tr>
          </tbody>
        </table>

        <p className="financing-note print-only-inline">
          Installation payment display: {formatCurrencyDetailed(signingDue)} due at signing,{' '}
          {formatCurrencyDetailed(completionDue)} due at completion (50/50 — display only, does not
          alter ROI math).
        </p>
      </div>

      <div className="hard-breakdown">
        <h3>Hard Savings Breakdown (annual)</h3>
        <ul>
          <li>Shrinkage / theft reduction: {formatCurrency(result.hardBreakdown.shrinkage)}</li>
          <li>Vandalism / damage reduction: {formatCurrency(result.hardBreakdown.vandalism)}</li>
          <li>False alarm dispatch reduction: {formatCurrency(result.hardBreakdown.falseAlarms)}</li>
          <li>Monitoring cost delta: {formatCurrency(result.hardBreakdown.monitoring)}</li>
          {inputs.includeGuardService && (
            <li>Guard service reduction: {formatCurrency(result.hardBreakdown.guardService)}</li>
          )}
        </ul>
      </div>
    </section>
  )
}
