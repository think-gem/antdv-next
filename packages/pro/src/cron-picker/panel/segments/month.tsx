import type { SlotsType } from 'vue'
import type { CronNumericSegment } from '../../types'
import Select from 'antdv-next/select'
import { defineComponent } from 'vue'
import ModeRadio from '../shared/mode-radio'
import RangeField from '../shared/range-field'
import StepField from '../shared/step-field'

export interface CronSegmentMonthProps {
  value: CronNumericSegment
}

export interface CronSegmentMonthEmits {
  'update:value': (value: CronNumericSegment) => void
  [key: string]: (...args: any[]) => void
}

export interface CronSegmentMonthSlots {}

const monthOptions = Array.from({ length: 12 }, (_, index) => ({
  label: `${index + 1}月`,
  value: index + 1,
}))

export default defineComponent<
  CronSegmentMonthProps,
  CronSegmentMonthEmits,
  string,
  SlotsType<CronSegmentMonthSlots>
>((props, { emit }) => {
  const updateMode = (mode: string) => {
    if (mode === 'every') {
      emit('update:value', { mode: 'every' })
      return
    }

    if (mode === 'range') {
      emit('update:value', { mode: 'range', start: 1, end: 12 })
      return
    }

    if (mode === 'step') {
      emit('update:value', { mode: 'step', start: 1, step: 1 })
      return
    }

    emit('update:value', { mode: 'assign', values: [1] })
  }

  return () => (
    <div class="ant-cron-picker-segment">
      <ModeRadio
        value={props.value.mode}
        options={[
          { label: '每月', value: 'every' },
          { label: '指定', value: 'assign' },
          { label: '区间', value: 'range' },
          { label: '步长', value: 'step' },
        ]}
        onUpdate:value={updateMode}
      />
      {props.value.mode === 'assign' && (
        <Select
          mode="multiple"
          size="small"
          value={props.value.values}
          options={monthOptions}
          onUpdate:value={value => emit('update:value', { mode: 'assign', values: (value as number[]) ?? [] })}
        />
      )}
      {props.value.mode === 'range' && (
        <RangeField
          value={{ start: props.value.start, end: props.value.end }}
          min={1}
          max={12}
          onUpdate:value={value => emit('update:value', {
            mode: 'range',
            start: value.start ?? 1,
            end: value.end ?? 12,
          })}
        />
      )}
      {props.value.mode === 'step' && (
        <StepField
          value={{ start: props.value.start, step: props.value.step }}
          min={1}
          max={12}
          onUpdate:value={value => emit('update:value', {
            mode: 'step',
            start: value.start ?? 1,
            step: value.step ?? 1,
          })}
        />
      )}
    </div>
  )
}, {
  name: 'CronSegmentMonth',
  inheritAttrs: false,
})
