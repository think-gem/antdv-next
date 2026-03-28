import type { SlotsType } from 'vue'
import type { CronNumericSegment } from '../../types'
import { defineComponent } from 'vue'
import NumericSegment from '../shared/numeric-segment'

export interface CronSegmentMinuteProps {
  value: CronNumericSegment
}

export interface CronSegmentMinuteEmits {
  'update:value': (value: CronNumericSegment) => void
  [key: string]: (...args: any[]) => void
}

export interface CronSegmentMinuteSlots {}

export default defineComponent<
  CronSegmentMinuteProps,
  CronSegmentMinuteEmits,
  string,
  SlotsType<CronSegmentMinuteSlots>
>((props, { emit }) => {
  return () => (
    <NumericSegment
      value={props.value}
      min={0}
      max={59}
      options={[
        { label: '每分', value: 'every' },
        { label: '指定', value: 'assign' },
        { label: '区间', value: 'range' },
        { label: '步长', value: 'step' },
      ]}
      onUpdate:value={value => emit('update:value', value as CronNumericSegment)}
    />
  )
}, {
  name: 'CronSegmentMinute',
  inheritAttrs: false,
})
