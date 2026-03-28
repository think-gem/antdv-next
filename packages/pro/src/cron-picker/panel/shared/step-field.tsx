import type { SlotsType } from 'vue'
import InputNumber from 'antdv-next/input-number'
import { defineComponent } from 'vue'

export interface StepFieldValue {
  start?: number
  step?: number
}

export interface StepFieldProps {
  value?: StepFieldValue
  min?: number
  max?: number
}

export interface StepFieldEmits {
  'update:value': (value: StepFieldValue) => void
  [key: string]: (...args: any[]) => void
}

export interface StepFieldSlots {}

export default defineComponent<
  StepFieldProps,
  StepFieldEmits,
  string,
  SlotsType<StepFieldSlots>
>((props, { emit }) => {
  const update = (patch: StepFieldValue) => {
    emit('update:value', {
      start: props.value?.start,
      step: props.value?.step,
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
      <span>每</span>
      <InputNumber
        size="small"
        min={1}
        max={props.max}
        controls={false}
        value={props.value?.step}
        onUpdate:value={value => update({ step: value === null ? undefined : Number(value) })}
      />
    </div>
  )
}, {
  name: 'CronStepField',
  inheritAttrs: false,
})
