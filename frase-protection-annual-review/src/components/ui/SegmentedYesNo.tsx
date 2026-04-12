type BaseProps = {
  label: string
}

type VariantProps =
  | {
      variant: 'yes-no-partial'
      value: '' | 'yes' | 'no' | 'partial'
      onChange: (v: '' | 'yes' | 'no' | 'partial') => void
    }
  | {
      variant: 'yes-no-unknown'
      value: '' | 'yes' | 'no' | 'unknown'
      onChange: (v: '' | 'yes' | 'no' | 'unknown') => void
    }

type Props = BaseProps & VariantProps

export function SegmentedYesNo(props: Props) {
  const { label } = props
  const opts =
    props.variant === 'yes-no-partial'
      ? ([
          ['yes', 'Yes'],
          ['no', 'No'],
          ['partial', 'Partial'],
        ] as const)
      : ([
          ['yes', 'Yes'],
          ['no', 'No'],
          ['unknown', 'Unsure'],
        ] as const)

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium text-white/90">{label}</p>
      <div className="flex flex-wrap gap-2">
        {opts.map(([key, text]) => (
          <button
            key={key}
            type="button"
            aria-pressed={props.value === key}
            onClick={() => {
              if (props.variant === 'yes-no-partial') {
                const v = key as '' | 'yes' | 'no' | 'partial'
                props.onChange(props.value === v ? '' : v)
              } else {
                const v = key as '' | 'yes' | 'no' | 'unknown'
                props.onChange(props.value === v ? '' : v)
              }
            }}
            className={`min-h-[44px] rounded-full px-4 py-2 text-sm font-medium transition ${
              props.value === key
                ? 'bg-frase-blue text-white shadow-lg shadow-frase-blue/25'
                : 'bg-white/10 text-white/80 hover:bg-white/15'
            }`}
          >
            {text}
          </button>
        ))}
      </div>
    </div>
  )
}
