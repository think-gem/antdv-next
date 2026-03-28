import type { SlotsType } from 'vue'
import InputNumber from 'antdv-next/input-number'
import { defineComponent } from 'vue'

export interface RangeFieldValue {
  start?: number
  end?: number
}

export interface RangeFieldProps {
  value?: RangeFieldValue
  min?: number
  max?: number
}

export interface RangeFieldEmits {
  'update:value': (value: RangeFieldValue) => void
  [key: string]: (...args: any[]) => void
}

export interface RangeFieldSlots {}

export default defineComponent<
  RangeFieldProps,
  RangeFieldEmits,
  string,
  SlotsType<RangeFieldSlots>
>((props, { emit }) => {
  const update = (patch: RangeFieldValue) => {
    emit('update:value', {
      start: props.value?.start,
      end: props.value?.end,
      ...patch,
    })
  }

  return () => (
    <div class="ant-cron-picker-inline-field">
      <InputNumber
        size="small"
        min={props.min}
        max={props.max}
        controls={false}
        value={props.value?.start}
        onUpdate:value={value => update({ start: value === null ? undefined : Number(value) })}
      />
      <span>到</span>
      <InputNumber
        size="small"
        min={props.min}
        max={props.max}
        controls={false}
        value={props.value?.end}
        onUpdate:value={value => update({ end: value === null ? undefined : Number(value) })}
      />
    </div>
  )
}, {
  name: 'CronRangeField',
  inheritAttrs: false,
})
