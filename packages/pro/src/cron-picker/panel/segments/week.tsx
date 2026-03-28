import type { SlotsType } from 'vue'
import type { CronWeekSegment } from '../../types'
import Select from 'antdv-next/select'
import { defineComponent } from 'vue'
import ModeRadio from '../shared/mode-radio'

export interface CronSegmentWeekProps {
  value: CronWeekSegment
}

export interface CronSegmentWeekEmits {
  'update:value': (value: CronWeekSegment) => void
  [key: string]: (...args: any[]) => void
}

export interface CronSegmentWeekSlots {}

const weekOptions = [
  { label: '周日', value: 'SUN' },
  { label: '周一', value: 'MON' },
  { label: '周二', value: 'TUE' },
  { label: '周三', value: 'WED' },
  { label: '周四', value: 'THU' },
  { label: '周五', value: 'FRI' },
  { label: '周六', value: 'SAT' },
]

export default defineComponent<
  CronSegmentWeekProps,
  CronSegmentWeekEmits,
  string,
  SlotsType<CronSegmentWeekSlots>
>((props, { emit }) => {
  const updateMode = (mode: string) => {
    if (mode === 'no-assign') {
      emit('update:value', { mode: 'no-assign' })
      return
    }

    if (mode === 'range') {
      emit('update:value', { mode: 'range', start: 'MON', end: 'FRI' })
      return
    }

    emit('update:value', { mode: 'assign', values: ['MON'] })
  }

  return () => (
    <div class="ant-cron-picker-segment">
      <ModeRadio
        value={props.value.mode}
        options={[
          { label: '不指定', value: 'no-assign' },
          { label: '指定', value: 'assign' },
          { label: '区间', value: 'range' },
        ]}
        onUpdate:value={updateMode}
      />
      {props.value.mode === 'assign' && (
        <Select
          mode="multiple"
          size="small"
          value={props.value.values}
          options={weekOptions}
          onUpdate:value={value => emit('update:value', { mode: 'assign', values: (value as string[]) ?? [] })}
        />
      )}
      {props.value.mode === 'range' && (() => {
        const rangeValue = props.value
        return (
          <div class="ant-cron-picker-inline-field">
            <Select
              size="small"
              value={rangeValue.start}
              options={weekOptions}
              onUpdate:value={value => emit('update:value', { mode: 'range', start: String(value), end: rangeValue.end })}
            />
            <span>到</span>
            <Select
              size="small"
              value={rangeValue.end}
              options={weekOptions}
              onUpdate:value={value => emit('update:value', { mode: 'range', start: rangeValue.start, end: String(value) })}
            />
          </div>
        )
      })()}
    </div>
  )
}, {
  name: 'CronSegmentWeek',
  inheritAttrs: false,
})
