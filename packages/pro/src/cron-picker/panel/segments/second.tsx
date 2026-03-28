import type { SlotsType } from 'vue'
import type { CronNumericSegment } from '../../types'
import { defineComponent } from 'vue'
import NumericSegment from '../shared/numeric-segment'

export interface CronSegmentSecondProps {
  value: CronNumericSegment
}

export interface CronSegmentSecondEmits {
  'update:value': (value: CronNumericSegment) => void
  [key: string]: (...args: any[]) => void
}

export interface CronSegmentSecondSlots {}

export default defineComponent<
  CronSegmentSecondProps,
  CronSegmentSecondEmits,
  string,
  SlotsType<CronSegmentSecondSlots>
>((props, { emit }) => {
  return () => (
    <NumericSegment
      value={props.value}
      min={0}
      max={59}
      options={[
        { label: '每秒', value: 'every' },
        { label: '指定', value: 'assign' },
        { label: '区间', value: 'range' },
        { label: '步长', value: 'step' },
      ]}
      onUpdate:value={value => emit('update:value', value as CronNumericSegment)}
    />
  )
}, {
  name: 'CronSegmentSecond',
  inheritAttrs: false,
})
