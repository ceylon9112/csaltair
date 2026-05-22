import { useEffect, useMemo, useState } from 'react'
import { Link, useMatch, useNavigate } from 'react-router-dom'
import { useCalculator } from '../context/CalculatorContext'
import {
  OUTCOME_TEXT,
  SOFT_STRATEGIC_VALUES,
  VERTICAL_DEFAULTS,
  VERTICAL_LABELS,
  WEEKS_PER_YEAR,
} from '../data/verticals'
import { OPERATIONAL_FIELD_HELP } from '../data/operationalHelp'
import { calculateRoi } from '../lib/calculate'
import { resultsPath } from '../lib/routes'
import { hasErrors, validateInputs } from '../lib/validate'
import type { CalculatorInputs, VerticalId } from '../types'
import { Field, NumberInput, Section, TextInput } from '../components/FormFields'
import { ResultsPanel } from '../components/ResultsPanel'
import { HeaderBanner } from '../components/HeaderBanner'

export function CalculatorPage({ vertical }: { vertical: VerticalId }) {
  const navigate = useNavigate()
  const showResults = useMatch({ path: '/calculate/:vertical/results', end: true }) !== null
  const { inputs, thresholds, patchInputs, patchThresholds, resetThresholds } = useCalculator()
  const [assumptionsOpen, setAssumptionsOpen] = useState(false)
  const [thresholdsOpen, setThresholdsOpen] = useState(false)

  const errors = useMemo(() => validateInputs(inputs, thresholds), [inputs, thresholds])

  const result = useMemo(() => {
    if (!showResults || hasErrors(errors)) return null
    return calculateRoi(inputs, thresholds, OUTCOME_TEXT)
  }, [inputs, thresholds, showResults, errors])

  useEffect(() => {
    if (showResults && result) {
      document.getElementById('results')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [showResults, result])

  function handleCalculate() {
    if (hasErrors(errors)) return
    navigate(resultsPath(vertical))
  }

  function handlePrint() {
    window.print()
  }

  const canCalculate = !hasErrors(errors)

  return (
    <div className="app">
      <HeaderBanner
        title="Security ROI Calculator"
        businessName={inputs.businessName || undefined}
        printOnlyEyebrow
        subtitle={
          <p className="subtitle no-print">
            Vertical: <strong>{VERTICAL_LABELS[vertical]}</strong>
            <Link to="/" className="link-btn">
              Change vertical
            </Link>
          </p>
        }
      />

      <Section title="Business Profile">
        <Field label="Business name (optional)" hint="Used in report header and print output">
          <TextInput
            value={inputs.businessName}
            onChange={(v) => patchInputs({ businessName: v })}
            placeholder="e.g. Acme Retail Co."
          />
        </Field>
        <Field label="Number of locations" required error={errors.locations}>
          <NumberInput value={inputs.locations} min={1} onChange={(v) => patchInputs({ locations: v })} />
        </Field>
        <Field label="Square footage">
          <NumberInput value={inputs.squareFootage} min={0} onChange={(v) => patchInputs({ squareFootage: v })} />
        </Field>
        <Field label="Number of employees">
          <NumberInput value={inputs.employees} min={0} onChange={(v) => patchInputs({ employees: v })} />
        </Field>
        <Field label="Operating hours per day" required error={errors.operatingHoursPerDay}>
          <NumberInput
            value={inputs.operatingHoursPerDay}
            min={1}
            onChange={(v) => patchInputs({ operatingHoursPerDay: v })}
          />
        </Field>
        <Field label="Operating days per year" required error={errors.operatingDaysPerYear}>
          <NumberInput
            value={inputs.operatingDaysPerYear}
            min={1}
            max={366}
            onChange={(v) => patchInputs({ operatingDaysPerYear: v })}
          />
        </Field>
      </Section>

      <Section title="Current Security Costs">
        <Field label="Current monthly monitoring cost">
          <NumberInput
            prefix="$"
            value={inputs.currentMonitoringMonthly}
            min={0}
            onChange={(v) => patchInputs({ currentMonitoringMonthly: v })}
          />
        </Field>
        <Field label="Current guard service cost per month (optional)">
          <NumberInput
            prefix="$"
            value={inputs.guardServiceMonthly}
            min={0}
            onChange={(v) => patchInputs({ guardServiceMonthly: v })}
          />
        </Field>
        <Field label="Annual theft / shrinkage losses">
          <NumberInput
            prefix="$"
            value={inputs.annualTheftShrinkage}
            min={0}
            onChange={(v) => patchInputs({ annualTheftShrinkage: v })}
          />
        </Field>
        <Field label="Annual vandalism / property damage">
          <NumberInput
            prefix="$"
            value={inputs.annualVandalism}
            min={0}
            onChange={(v) => patchInputs({ annualVandalism: v })}
          />
        </Field>
        <Field label="False alarm dispatches per year">
          <NumberInput
            value={inputs.falseAlarmDispatchesPerYear}
            min={0}
            onChange={(v) => patchInputs({ falseAlarmDispatchesPerYear: v })}
          />
        </Field>
        <Field label="Cost per false alarm dispatch">
          <NumberInput
            prefix="$"
            value={inputs.costPerFalseAlarmDispatch}
            min={0}
            onChange={(v) => patchInputs({ costPerFalseAlarmDispatch: v })}
          />
        </Field>
        <div className="full-width guard-toggle">
          <label className="toggle-row">
            <input
              type="checkbox"
              checked={inputs.includeGuardService}
              onChange={(e) => patchInputs({ includeGuardService: e.target.checked })}
            />
            Include guard service reduction in ROI calculation
          </label>
          {inputs.includeGuardService && (
            <Field
              label="Estimated % reduction in guard hours due to system"
              required
              error={errors.guardHoursReductionPct}
            >
              <NumberInput
                suffix="%"
                value={inputs.guardHoursReductionPct}
                min={0}
                max={100}
                onChange={(v) => patchInputs({ guardHoursReductionPct: v })}
              />
            </Field>
          )}
        </div>
      </Section>

      <Section title="Proposed System">
        <Field label="Total equipment and installation cost" required error={errors.equipmentInstallCost}>
          <NumberInput
            prefix="$"
            value={inputs.equipmentInstallCost}
            min={0}
            onChange={(v) => patchInputs({ equipmentInstallCost: v })}
          />
        </Field>
        <Field label="Proposed monthly monitoring cost" required error={errors.proposedMonitoringMonthly}>
          <NumberInput
            prefix="$"
            value={inputs.proposedMonitoringMonthly}
            min={0}
            onChange={(v) => patchInputs({ proposedMonitoringMonthly: v })}
          />
        </Field>
        <Field label="Contract term (years)" required error={errors.contractTermYears}>
          <NumberInput
            value={inputs.contractTermYears}
            min={1}
            max={5}
            onChange={(v) => patchInputs({ contractTermYears: v })}
          />
        </Field>
        <p className="full-width financing-note no-print">
          Installation display note: 50% due at signing, 50% due at completion — informational only;
          does not alter ROI math.
        </p>
      </Section>

      <Section title="Operational Value Inputs">
        <Field
          label="Manual security task hours per week"
          helpText={OPERATIONAL_FIELD_HELP.manualSecurityHoursPerWeek}
        >
          <NumberInput
            value={inputs.manualSecurityHoursPerWeek}
            min={0}
            step={0.5}
            onChange={(v) => patchInputs({ manualSecurityHoursPerWeek: v })}
          />
        </Field>
        <Field
          label="Employee hourly cost (fully loaded)"
          required
          error={errors.employeeHourlyCost}
          hint="Editable each session — default $25/hr"
          helpText={OPERATIONAL_FIELD_HELP.employeeHourlyCost}
        >
          <NumberInput
            prefix="$"
            value={inputs.employeeHourlyCost}
            min={0.01}
            step={0.5}
            onChange={(v) => patchInputs({ employeeHourlyCost: v })}
          />
        </Field>
        <Field
          label="Estimated reduction in task hours due to system"
          helpText={OPERATIONAL_FIELD_HELP.taskHoursReductionPct}
        >
          <NumberInput
            suffix="%"
            value={inputs.taskHoursReductionPct}
            min={0}
            max={100}
            onChange={(v) => patchInputs({ taskHoursReductionPct: v })}
          />
        </Field>
        <Field
          label="Assumed shrinkage savings from system"
          helpText={OPERATIONAL_FIELD_HELP.shrinkageSavingsPct}
        >
          <NumberInput
            suffix="%"
            value={inputs.shrinkageSavingsPct}
            min={0}
            max={100}
            onChange={(v) => patchInputs({ shrinkageSavingsPct: v })}
          />
        </Field>
        <Field
          label="Assumed vandalism savings from system"
          helpText={OPERATIONAL_FIELD_HELP.vandalismSavingsPct}
        >
          <NumberInput
            suffix="%"
            value={inputs.vandalismSavingsPct}
            min={0}
            max={100}
            onChange={(v) => patchInputs({ vandalismSavingsPct: v })}
          />
        </Field>
        <Field
          label="Assumed false alarm dispatch reduction"
          helpText={OPERATIONAL_FIELD_HELP.falseAlarmReductionPct}
        >
          <NumberInput
            suffix="%"
            value={inputs.falseAlarmReductionPct}
            min={0}
            max={100}
            onChange={(v) => patchInputs({ falseAlarmReductionPct: v })}
          />
        </Field>
      </Section>

      <section className="section collapsible no-print">
        <button
          type="button"
          className="collapse-toggle"
          onClick={() => setThresholdsOpen((o) => !o)}
          aria-expanded={thresholdsOpen}
        >
          <h2>ROI Classification Thresholds</h2>
          <span>{thresholdsOpen ? '−' : '+'}</span>
        </button>
        {thresholdsOpen && (
          <div className="section-grid threshold-panel">
            <p className="full-width threshold-intro">
              Adjust payback thresholds for this session. Strong applies when payback is at or below
              the first value; Moderate applies up to the second value; Weak applies above that (when
              net benefit is still positive).
            </p>
            <Field label="Strong ROI — max payback (months)" required error={errors.thresholds}>
              <NumberInput
                value={thresholds.strongMaxMonths}
                min={1}
                onChange={(v) => patchThresholds({ strongMaxMonths: v })}
              />
            </Field>
            <Field label="Moderate ROI — max payback (months)" required>
              <NumberInput
                value={thresholds.moderateMaxMonths}
                min={2}
                onChange={(v) => patchThresholds({ moderateMaxMonths: v })}
              />
            </Field>
            <p className="full-width threshold-summary">
              Current rules: Strong ≤ {thresholds.strongMaxMonths} mo · Moderate{' '}
              {thresholds.strongMaxMonths + 1}–{thresholds.moderateMaxMonths} mo · Weak &gt;{' '}
              {thresholds.moderateMaxMonths} mo · Inconclusive when net benefit ≤ 0 or annual savings
              = $0
            </p>
            <button type="button" className="secondary-btn" onClick={resetThresholds}>
              Reset thresholds to defaults (24 / 48 months)
            </button>
          </div>
        )}
      </section>

      <div className="actions no-print">
        <button type="button" className="primary-btn" disabled={!canCalculate} onClick={handleCalculate}>
          Calculate ROI
        </button>
        {!canCalculate && <p className="action-hint">Fix highlighted fields before calculating.</p>}
      </div>

      {showResults && result && (
        <>
          <ResultsPanel result={result} inputs={inputs} />

          <section className="section soft-values">
            <h2>Soft / Strategic Value</h2>
            <p className="soft-note">
              These factors are real but not included in the financial totals above.
            </p>
            <ul>
              {SOFT_STRATEGIC_VALUES.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>

          <section className="section collapsible no-print">
            <button
              type="button"
              className="collapse-toggle"
              onClick={() => setAssumptionsOpen((o) => !o)}
              aria-expanded={assumptionsOpen}
            >
              <h2>Assumptions</h2>
              <span>{assumptionsOpen ? '−' : '+'}</span>
            </button>
            {assumptionsOpen && (
              <AssumptionsEditor inputs={inputs} vertical={vertical} onChange={patchInputs} />
            )}
          </section>

          <section className="section access-control no-print">
            <h2>Access Control Options</h2>
            <div className="access-cards">
              <article>
                <h3>Alarm.com Access Control</h3>
                <p className="tag primary-tag">Primary / common path</p>
                <p>
                  Cloud-managed access control integrated with the security system. Recommended for
                  most commercial applications.
                </p>
              </article>
              <article>
                <h3>Brivo Access Control</h3>
                <p className="tag alt-tag">Alternative</p>
                <p>
                  Enterprise-grade cloud access control for multi-door, multi-location deployments.
                </p>
              </article>
            </div>
          </section>

          <div className="actions no-print">
            <button type="button" className="secondary-btn" onClick={handlePrint}>
              Save as PDF / Print
            </button>
          </div>
        </>
      )}
    </div>
  )
}

function AssumptionsEditor({
  inputs,
  vertical,
  onChange,
}: {
  inputs: CalculatorInputs
  vertical: VerticalId
  onChange: (patch: Partial<CalculatorInputs>) => void
}) {
  const defaults = VERTICAL_DEFAULTS[vertical]
  const rows: {
    label: string
    value: number
    key: keyof CalculatorInputs
    source: 'vertical default' | 'user-entered' | 'system constant'
    note: string
    editable: boolean
  }[] = [
    {
      label: 'Weeks per year',
      value: WEEKS_PER_YEAR,
      key: 'locations',
      source: 'system constant',
      note: 'Used for operational value conversion',
      editable: false,
    },
    {
      label: 'Employee hourly cost',
      value: inputs.employeeHourlyCost,
      key: 'employeeHourlyCost',
      source: inputs.employeeHourlyCost === 25 ? 'vertical default' : 'user-entered',
      note: 'Fully loaded labor cost for task-hour savings',
      editable: true,
    },
    {
      label: 'Shrinkage savings %',
      value: inputs.shrinkageSavingsPct,
      key: 'shrinkageSavingsPct',
      source:
        inputs.shrinkageSavingsPct === defaults.shrinkageSavingsPct ? 'vertical default' : 'user-entered',
      note: 'Applied to annual theft/shrinkage losses',
      editable: true,
    },
    {
      label: 'Vandalism savings %',
      value: inputs.vandalismSavingsPct,
      key: 'vandalismSavingsPct',
      source:
        inputs.vandalismSavingsPct === defaults.vandalismSavingsPct ? 'vertical default' : 'user-entered',
      note: 'Applied to annual vandalism losses',
      editable: true,
    },
    {
      label: 'Task hours reduction %',
      value: inputs.taskHoursReductionPct,
      key: 'taskHoursReductionPct',
      source:
        inputs.taskHoursReductionPct === defaults.taskHoursReductionPct ? 'vertical default' : 'user-entered',
      note: 'Manual security hours reduced by system',
      editable: true,
    },
    {
      label: 'False alarm reduction %',
      value: inputs.falseAlarmReductionPct,
      key: 'falseAlarmReductionPct',
      source: 'user-entered',
      note: 'Applied to annual false alarm dispatch costs',
      editable: true,
    },
  ]

  return (
    <table className="assumptions-table">
      <thead>
        <tr>
          <th>Assumption</th>
          <th>Value</th>
          <th>Source</th>
          <th>Note</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={row.label}>
            <td>{row.label}</td>
            <td>
              {row.editable ? (
                <NumberInput
                  value={row.value}
                  min={0}
                  step={row.label.includes('%') ? 1 : 0.5}
                  prefix={row.label.includes('cost') ? '$' : undefined}
                  suffix={row.label.includes('%') ? '%' : undefined}
                  onChange={(v) => onChange({ [row.key]: v } as Partial<CalculatorInputs>)}
                />
              ) : (
                row.value
              )}
            </td>
            <td>{row.source}</td>
            <td>{row.note}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
