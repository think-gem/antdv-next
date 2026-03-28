import type { SlotsType } from 'vue'
import type { CronNumericSegment } from '../../types'
import { defineComponent } from 'vue'
import NumericSegment from '../shared/numeric-segment'

export interface CronSegmentHourProps {
  value: CronNumericSegment
}

export interface CronSegmentHourEmits {
  'update:value': (value: CronNumericSegment) => void
  [key: string]: (...args: any[]) => void
}

export interface CronSegmentHourSlots {}

export default defineComponent<
  CronSegmentHourProps,
  CronSegmentHourEmits,
  string,
  SlotsType<CronSegmentHourSlots>
>((props, { emit }) => {
  return () => (
    <NumericSegment
      value={props.value}
      min={0}
      max={23}
      options={[
        { label: '每时', value: 'every' },
        { label: '指定', value: 'assign' },
        { label: '区间', value: 'range' },
        { label: '步长', value: 'step' },
      ]}
      onUpdate:value={value => emit('update:value', value as CronNumericSegment)}
    />
  )
}, {
  name: 'CronSegmentHour',
  inheritAttrs: false,
})
