export type VerticalId =
  | 'retail'
  | 'restaurant'
  | 'office'
  | 'property_management'
  | 'manufacturing'

export interface VerticalDefaults {
  operatingHoursPerDay: number
  operatingDaysPerYear: number
  annualTheftShrinkage: number
  annualVandalism: number
  falseAlarmDispatchesPerYear: number
  costPerFalseAlarmDispatch: number
  manualSecurityHoursPerWeek: number
  taskHoursReductionPct: number
  shrinkageSavingsPct: number
  vandalismSavingsPct: number
  falseAlarmReductionPct: number
}

export interface CalculatorInputs {
  businessName: string
  locations: number
  squareFootage: number
  employees: number
  operatingHoursPerDay: number
  operatingDaysPerYear: number
  currentMonitoringMonthly: number
  guardServiceMonthly: number
  includeGuardService: boolean
  guardHoursReductionPct: number
  annualTheftShrinkage: number
  annualVandalism: number
  falseAlarmDispatchesPerYear: number
  costPerFalseAlarmDispatch: number
  equipmentInstallCost: number
  proposedMonitoringMonthly: number
  contractTermYears: number
  manualSecurityHoursPerWeek: number
  employeeHourlyCost: number
  taskHoursReductionPct: number
  shrinkageSavingsPct: number
  vandalismSavingsPct: number
  falseAlarmReductionPct: number
}

export interface RoiThresholds {
  strongMaxMonths: number
  moderateMaxMonths: number
}

export type OutcomeLabel =
  | 'Strong ROI Case'
  | 'Moderate ROI Case'
  | 'Weak ROI Case'
  | 'Inconclusive — Insufficient Data'

export interface CalculationResult {
  hardSavingsAnnual: number
  hardBreakdown: {
    shrinkage: number
    vandalism: number
    falseAlarms: number
    monitoring: number
    guardService: number
  }
  operationalValueAnnual: number
  totalAnnualSavings: number
  totalSystemCost: number
  paybackMonths: number
  roiPercent: number
  netBenefit: number
  outcome: OutcomeLabel
  outcomeText: string
}

export interface AssumptionRow {
  key: string
  label: string
  value: string
  source: 'vertical default' | 'user-entered' | 'system constant'
  note: string
  editable: boolean
}
