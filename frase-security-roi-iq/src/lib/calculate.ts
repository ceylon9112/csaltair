import { WEEKS_PER_YEAR } from '../data/verticals'
import type { CalculatorInputs, CalculationResult, OutcomeLabel, RoiThresholds } from '../types'

function classifyOutcome(
  paybackMonths: number,
  netBenefit: number,
  totalAnnualSavings: number,
  thresholds: RoiThresholds,
  outcomeText: Record<string, string>,
): { outcome: OutcomeLabel; outcomeText: string } {
  if (totalAnnualSavings <= 0 || netBenefit <= 0) {
    return {
      outcome: 'Inconclusive — Insufficient Data',
      outcomeText: outcomeText['Inconclusive — Insufficient Data'],
    }
  }

  const strongMax = Math.max(1, thresholds.strongMaxMonths)
  const moderateMax = Math.max(strongMax + 1, thresholds.moderateMaxMonths)

  let outcome: OutcomeLabel
  if (paybackMonths <= strongMax) {
    outcome = 'Strong ROI Case'
  } else if (paybackMonths <= moderateMax) {
    outcome = 'Moderate ROI Case'
  } else {
    outcome = 'Weak ROI Case'
  }

  return { outcome, outcomeText: outcomeText[outcome] }
}

export function calculateRoi(
  inputs: CalculatorInputs,
  thresholds: RoiThresholds,
  outcomeText: Record<string, string>,
): CalculationResult {
  const shrinkage = inputs.annualTheftShrinkage * (inputs.shrinkageSavingsPct / 100)
  const vandalism = inputs.annualVandalism * (inputs.vandalismSavingsPct / 100)
  const falseAlarms =
    inputs.falseAlarmDispatchesPerYear *
    inputs.costPerFalseAlarmDispatch *
    (inputs.falseAlarmReductionPct / 100)
  const monitoringDelta = Math.max(
    0,
    (inputs.currentMonitoringMonthly - inputs.proposedMonitoringMonthly) * 12,
  )
  const guardService = inputs.includeGuardService
    ? Math.max(0, inputs.guardServiceMonthly * 12 * (inputs.guardHoursReductionPct / 100))
    : 0

  const hardSavingsAnnual = shrinkage + vandalism + falseAlarms + monitoringDelta + guardService

  const operationalValueAnnual =
    inputs.manualSecurityHoursPerWeek *
    (inputs.taskHoursReductionPct / 100) *
    WEEKS_PER_YEAR *
    inputs.employeeHourlyCost

  const totalAnnualSavings = hardSavingsAnnual + operationalValueAnnual
  const totalSystemCost =
    inputs.equipmentInstallCost +
    inputs.proposedMonitoringMonthly * 12 * inputs.contractTermYears

  const paybackMonths =
    totalAnnualSavings > 0
      ? Math.ceil(totalSystemCost / (totalAnnualSavings / 12))
      : Infinity

  const netBenefit = totalAnnualSavings * inputs.contractTermYears - totalSystemCost
  const roiPercent =
    totalSystemCost > 0
      ? ((totalAnnualSavings * inputs.contractTermYears - totalSystemCost) / totalSystemCost) * 100
      : 0

  const { outcome, outcomeText: text } = classifyOutcome(
    paybackMonths,
    netBenefit,
    totalAnnualSavings,
    thresholds,
    outcomeText,
  )

  return {
    hardSavingsAnnual,
    hardBreakdown: {
      shrinkage,
      vandalism,
      falseAlarms,
      monitoring: monitoringDelta,
      guardService,
    },
    operationalValueAnnual,
    totalAnnualSavings,
    totalSystemCost,
    paybackMonths: Number.isFinite(paybackMonths) ? paybackMonths : 0,
    roiPercent,
    netBenefit,
    outcome,
    outcomeText: text,
  }
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value)
}

export function formatCurrencyDetailed(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(value)
}
