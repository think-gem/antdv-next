import type { SlotsType } from 'vue'
import type { CronDaySegment, CronNumericMode, CronNumericSegment } from '../../types'
import { defineComponent } from 'vue'
import ModeRadio from './mode-radio'
import MultiNumberInput from './multi-number-input'
import RangeField from './range-field'
import StepField from './step-field'

export interface NumericSegmentModeOption {
  label: string
  value: CronNumericMode | 'no-assign'
}

export interface NumericSegmentProps {
  value: CronNumericSegment | CronDaySegment
  min: number
  max: number
  options: NumericSegmentModeOption[]
}

export interface NumericSegmentEmits {
  'update:value': (value: CronNumericSegment | CronDaySegment) => void
  [key: string]: (...args: any[]) => void
}

export interface NumericSegmentSlots {}

export default defineComponent<
  NumericSegmentProps,
  NumericSegmentEmits,
  string,
  SlotsType<NumericSegmentSlots>
>((props, { emit }) => {
  const updateMode = (mode: string) => {
    if (mode === 'no-assign') {
      emit('update:value', { mode: 'no-assign' })
      return
    }

    if (mode === 'every') {
      emit('update:value', { mode: 'every' })
      return
    }

    if (mode === 'range') {
      emit('update:value', { mode: 'range', start: props.min, end: props.max })
      return
    }

    if (mode === 'step') {
      emit('update:value', { mode: 'step', start: props.min, step: 1 })
      return
    }

    emit('update:value', { mode: 'assign', values: [] })
  }

  return () => (
    <div class="ant-cron-picker-segment">
      <ModeRadio
        value={props.value.mode}
        options={props.options}
        onUpdate:value={updateMode}
      />
      {props.value.mode === 'assign' && (
        <MultiNumberInput
          value={props.value.values}
          placeholder="输入逗号分隔值"
          onUpdate:value={values => emit('update:value', { mode: 'assign', values })}
        />
      )}
      {props.value.mode === 'range' && (
        <RangeField
          value={{ start: props.value.start, end: props.value.end }}
          min={props.min}
          max={props.max}
          onUpdate:value={value => emit('update:value', {
            mode: 'range',
            start: value.start ?? props.min,
            end: value.end ?? props.max,
          })}
        />
      )}
      {props.value.mode === 'step' && (
        <StepField
          value={{ start: props.value.start, step: props.value.step }}
          min={props.min}
          max={props.max}
          onUpdate:value={value => emit('update:value', {
            mode: 'step',
            start: value.start ?? props.min,
            step: value.step ?? 1,
          })}
        />
      )}
    </div>
  )
}, {
  name: 'CronNumericSegment',
  inheritAttrs: false,
})
