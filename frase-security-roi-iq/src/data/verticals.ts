import type { CalculatorInputs, VerticalDefaults, VerticalId } from '../types'

export const VERTICAL_LABELS: Record<VerticalId, string> = {
  retail: 'Retail',
  restaurant: 'Restaurant',
  office: 'Office / Professional Services',
  property_management: 'Property Management',
  manufacturing: 'Light Manufacturing / Warehouse',
}

export const VERTICAL_DEFAULTS: Record<VerticalId, VerticalDefaults> = {
  retail: {
    operatingHoursPerDay: 12,
    operatingDaysPerYear: 340,
    annualTheftShrinkage: 18000,
    annualVandalism: 2500,
    falseAlarmDispatchesPerYear: 6,
    costPerFalseAlarmDispatch: 150,
    manualSecurityHoursPerWeek: 3,
    taskHoursReductionPct: 40,
    shrinkageSavingsPct: 30,
    vandalismSavingsPct: 25,
    falseAlarmReductionPct: 50,
  },
  restaurant: {
    operatingHoursPerDay: 14,
    operatingDaysPerYear: 340,
    annualTheftShrinkage: 8000,
    annualVandalism: 1500,
    falseAlarmDispatchesPerYear: 8,
    costPerFalseAlarmDispatch: 150,
    manualSecurityHoursPerWeek: 2,
    taskHoursReductionPct: 35,
    shrinkageSavingsPct: 25,
    vandalismSavingsPct: 20,
    falseAlarmReductionPct: 50,
  },
  office: {
    operatingHoursPerDay: 9,
    operatingDaysPerYear: 250,
    annualTheftShrinkage: 3000,
    annualVandalism: 1000,
    falseAlarmDispatchesPerYear: 4,
    costPerFalseAlarmDispatch: 150,
    manualSecurityHoursPerWeek: 2,
    taskHoursReductionPct: 30,
    shrinkageSavingsPct: 20,
    vandalismSavingsPct: 15,
    falseAlarmReductionPct: 50,
  },
  property_management: {
    operatingHoursPerDay: 24,
    operatingDaysPerYear: 365,
    annualTheftShrinkage: 5000,
    annualVandalism: 6000,
    falseAlarmDispatchesPerYear: 10,
    costPerFalseAlarmDispatch: 150,
    manualSecurityHoursPerWeek: 4,
    taskHoursReductionPct: 45,
    shrinkageSavingsPct: 25,
    vandalismSavingsPct: 35,
    falseAlarmReductionPct: 50,
  },
  manufacturing: {
    operatingHoursPerDay: 10,
    operatingDaysPerYear: 260,
    annualTheftShrinkage: 12000,
    annualVandalism: 3000,
    falseAlarmDispatchesPerYear: 5,
    costPerFalseAlarmDispatch: 150,
    manualSecurityHoursPerWeek: 3,
    taskHoursReductionPct: 40,
    shrinkageSavingsPct: 30,
    vandalismSavingsPct: 20,
    falseAlarmReductionPct: 50,
  },
}

export const DEFAULT_EMPLOYEE_HOURLY_COST = 25

export const DEFAULT_THRESHOLDS = {
  strongMaxMonths: 24,
  moderateMaxMonths: 48,
}

export const WEEKS_PER_YEAR = 52
export const MIN_CONTRACT_YEARS = 1
export const MAX_CONTRACT_YEARS = 5

export const OUTCOME_TEXT: Record<string, string> = {
  'Strong ROI Case':
    'Based on the inputs provided, this system is projected to pay for itself in under 2 years with a positive return over the contract term. The financial case is well-supported.',
  'Moderate ROI Case':
    'The system is projected to break even within the contract term, though the payback period is longer. The case is supportable with the right priorities in place.',
  'Weak ROI Case':
    'The numbers as entered suggest the payback period extends beyond 4 years. The ROI case is not strong on financial grounds alone. Consider whether non-financial value (see below) changes the decision.',
  'Inconclusive — Insufficient Data':
    'The numbers as entered do not support a positive return. Review the assumptions, check that all relevant savings have been captured, or consider whether this system configuration is the right fit.',
}

export const SOFT_STRATEGIC_VALUES = [
  'Potential reduction in property/casualty insurance premiums (verify with your carrier — not included in totals above)',
  'Deterrence value — incidents avoided are not counted in loss figures',
  'Employee safety and peace of mind',
  'Customer confidence and perception',
  'Remote visibility and management for owners and managers',
  'Faster incident response and documentation for claims',
]

export function buildInputsFromVertical(vertical: VerticalId): CalculatorInputs {
  const d = VERTICAL_DEFAULTS[vertical]
  return {
    businessName: '',
    locations: 1,
    squareFootage: 0,
    employees: 0,
    operatingHoursPerDay: d.operatingHoursPerDay,
    operatingDaysPerYear: d.operatingDaysPerYear,
    currentMonitoringMonthly: 0,
    guardServiceMonthly: 0,
    includeGuardService: false,
    guardHoursReductionPct: 0,
    annualTheftShrinkage: d.annualTheftShrinkage,
    annualVandalism: d.annualVandalism,
    falseAlarmDispatchesPerYear: d.falseAlarmDispatchesPerYear,
    costPerFalseAlarmDispatch: d.costPerFalseAlarmDispatch,
    equipmentInstallCost: 0,
    proposedMonitoringMonthly: 0,
    contractTermYears: 3,
    manualSecurityHoursPerWeek: d.manualSecurityHoursPerWeek,
    employeeHourlyCost: DEFAULT_EMPLOYEE_HOURLY_COST,
    taskHoursReductionPct: d.taskHoursReductionPct,
    shrinkageSavingsPct: d.shrinkageSavingsPct,
    vandalismSavingsPct: d.vandalismSavingsPct,
    falseAlarmReductionPct: d.falseAlarmReductionPct,
  }
}
