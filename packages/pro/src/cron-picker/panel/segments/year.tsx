import type { SlotsType } from 'vue'
import type { CronNumericSegment } from '../../types'
import { defineComponent } from 'vue'
import NumericSegment from '../shared/numeric-segment'

export interface CronSegmentYearProps {
  value: CronNumericSegment
}

export interface CronSegmentYearEmits {
  'update:value': (value: CronNumericSegment) => void
  [key: string]: (...args: any[]) => void
}

export interface CronSegmentYearSlots {}

export default defineComponent<
  CronSegmentYearProps,
  CronSegmentYearEmits,
  string,
  SlotsType<CronSegmentYearSlots>
>((props, { emit }) => {
  return () => (
    <NumericSegment
      value={props.value}
      min={new Date().getFullYear()}
      max={2099}
      options={[
        { label: '每年', value: 'every' },
        { label: '指定', value: 'assign' },
        { label: '区间', value: 'range' },
      ]}
      onUpdate:value={value => emit('update:value', value as CronNumericSegment)}
    />
  )
}, {
  name: 'CronSegmentYear',
  inheritAttrs: false,
})
