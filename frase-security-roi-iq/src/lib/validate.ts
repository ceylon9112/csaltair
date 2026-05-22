import { MAX_CONTRACT_YEARS, MIN_CONTRACT_YEARS } from '../data/verticals'
import type { CalculatorInputs, RoiThresholds } from '../types'

export type FieldErrors = Partial<Record<keyof CalculatorInputs | 'thresholds', string>>

export function validateInputs(
  inputs: CalculatorInputs,
  thresholds: RoiThresholds,
): FieldErrors {
  const errors: FieldErrors = {}

  if (inputs.locations < 1) errors.locations = 'Must be at least 1'
  if (inputs.operatingHoursPerDay <= 0) errors.operatingHoursPerDay = 'Must be greater than 0'
  if (inputs.operatingDaysPerYear <= 0) errors.operatingDaysPerYear = 'Must be greater than 0'
  if (inputs.equipmentInstallCost < 0) errors.equipmentInstallCost = 'Cannot be negative'
  if (inputs.proposedMonitoringMonthly < 0) errors.proposedMonitoringMonthly = 'Cannot be negative'
  if (
    inputs.contractTermYears < MIN_CONTRACT_YEARS ||
    inputs.contractTermYears > MAX_CONTRACT_YEARS
  ) {
    errors.contractTermYears = `Must be between ${MIN_CONTRACT_YEARS} and ${MAX_CONTRACT_YEARS} years`
  }
  if (inputs.employeeHourlyCost <= 0) errors.employeeHourlyCost = 'Must be greater than 0'
  if (inputs.includeGuardService && inputs.guardHoursReductionPct <= 0) {
    errors.guardHoursReductionPct = 'Enter a reduction % when guard service is included'
  }

  const numericFields: (keyof CalculatorInputs)[] = [
    'currentMonitoringMonthly',
    'guardServiceMonthly',
    'annualTheftShrinkage',
    'annualVandalism',
    'falseAlarmDispatchesPerYear',
    'costPerFalseAlarmDispatch',
    'manualSecurityHoursPerWeek',
    'taskHoursReductionPct',
    'shrinkageSavingsPct',
    'vandalismSavingsPct',
    'falseAlarmReductionPct',
  ]

  for (const field of numericFields) {
    const val = inputs[field]
    if (typeof val === 'number' && val < 0) {
      errors[field] = 'Cannot be negative'
    }
  }

  if (thresholds.strongMaxMonths < 1) {
    errors.thresholds = 'Strong threshold must be at least 1 month'
  } else if (thresholds.moderateMaxMonths <= thresholds.strongMaxMonths) {
    errors.thresholds = 'Moderate threshold must be greater than the strong threshold'
  }

  return errors
}

export function hasErrors(errors: FieldErrors): boolean {
  return Object.keys(errors).length > 0
}
