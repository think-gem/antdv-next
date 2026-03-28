import type { SlotsType } from 'vue'
import type { CronDaySegment } from '../../types'
import { defineComponent } from 'vue'
import NumericSegment from '../shared/numeric-segment'

export interface CronSegmentDayProps {
  value: CronDaySegment
}

export interface CronSegmentDayEmits {
  'update:value': (value: CronDaySegment) => void
  [key: string]: (...args: any[]) => void
}

export interface CronSegmentDaySlots {}

export default defineComponent<
  CronSegmentDayProps,
  CronSegmentDayEmits,
  string,
  SlotsType<CronSegmentDaySlots>
>((props, { emit }) => {
  return () => (
    <NumericSegment
      value={props.value}
      min={1}
      max={31}
      options={[
        { label: '每日', value: 'every' },
        { label: '指定', value: 'assign' },
        { label: '区间', value: 'range' },
        { label: '步长', value: 'step' },
        { label: '不指定', value: 'no-assign' },
      ]}
      onUpdate:value={value => emit('update:value', value as CronDaySegment)}
    />
  )
}, {
  name: 'CronSegmentDay',
  inheritAttrs: false,
})
