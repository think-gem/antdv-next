import type { SlotsType } from 'vue'
import Input from 'antdv-next/input'
import InputNumber from 'antdv-next/input-number'
import { defineComponent } from 'vue'

export interface MultiNumberInputProps {
  value?: number[]
  placeholder?: string
}

export interface MultiNumberInputEmits {
  'update:value': (value: number[]) => void
  [key: string]: (...args: any[]) => void
}

export interface MultiNumberInputSlots {}

function parseValues(value: string) {
  return value
    .split(',')
    .map(item => item.trim())
    .filter(Boolean)
    .map(item => Number.parseInt(item, 10))
    .filter(item => !Number.isNaN(item))
}

export default defineComponent<
  MultiNumberInputProps,
  MultiNumberInputEmits,
  string,
  SlotsType<MultiNumberInputSlots>
>((props, { emit }) => {
  return () => {
    if ((props.value?.length ?? 0) <= 1) {
      return (
        <InputNumber
          size="small"
          controls={false}
          value={props.value?.[0]}
          onUpdate:value={value => emit('update:value', value === null || value === undefined ? [] : [Number(value)])}
        />
      )
    }

    return (
      <Input
        size="small"
        value={props.value?.join(',') ?? ''}
        placeholder={props.placeholder ?? '输入逗号分隔值'}
        onUpdate:value={value => emit('update:value', parseValues(value))}
      />
    )
  }
}, {
  name: 'CronMultiNumberInput',
  inheritAttrs: false,
})
