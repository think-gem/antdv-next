import type { SlotsType } from 'vue'
import Segmented from 'antdv-next/segmented'
import { defineComponent } from 'vue'

export interface ModeRadioOption {
  label: string
  value: string
}

export interface ModeRadioProps {
  value: string
  options: ModeRadioOption[]
}

export interface ModeRadioEmits {
  'update:value': (value: string) => void
  [key: string]: (...args: any[]) => void
}

export interface ModeRadioSlots {}

export default defineComponent<
  ModeRadioProps,
  ModeRadioEmits,
  string,
  SlotsType<ModeRadioSlots>
>((props, { emit }) => {
  return () => (
    <Segmented
      size="small"
      value={props.value}
      options={props.options}
      onUpdate:value={value => emit('update:value', String(value))}
    />
  )
}, {
  name: 'CronModeRadio',
  inheritAttrs: false,
})
