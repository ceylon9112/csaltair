/** Brief explanations for Operational Value Inputs — shown on user click. */
export const OPERATIONAL_FIELD_HELP = {
  manualSecurityHoursPerWeek:
    'Average hours your team spends each week on manual check-ins, lock-ups, or other security-related tasks that the new system could reduce.',
  employeeHourlyCost:
    'Fully loaded labor cost per hour (wages plus benefits and overhead) used to convert saved task time into dollar value.',
  taskHoursReductionPct:
    'Your estimate of how much manual security task time the system will eliminate, expressed as a percentage of the hours entered above.',
  shrinkageSavingsPct:
    'Expected percentage reduction in annual theft or shrinkage losses you attribute to better monitoring, deterrence, or alerts from the system.',
  vandalismSavingsPct:
    'Expected percentage reduction in annual vandalism or property damage costs you attribute to the proposed security system.',
  falseAlarmReductionPct:
    'Expected percentage reduction in false alarm dispatches and their associated fees after the system is installed and optimized.',
} as const
