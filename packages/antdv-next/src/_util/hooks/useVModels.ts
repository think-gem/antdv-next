/**
 * 双向绑定，多属性支持
 * @param props
 * @param propValue
 */
import { shallowRef, watch } from 'vue'

export interface BaseModelProps {
  modelValue?: any
  'onUpdate:modelValue'?: (value: any) => void
}
interface BaseModelPropsWithRecord extends BaseModelProps {
  [key: string]: any
}

export function useVModels<P extends BaseModelPropsWithRecord = BaseModelPropsWithRecord>(
  props: P,
  propValue: string | readonly string[] = 'value',
  defaultValue?: any | (() => any),
  emit?: any,
) {
  const modelProps = props
  const propKeys = Array.from(new Set(Array.isArray(propValue) ? propValue : [propValue]))
    .filter(key => key && key !== 'modelValue')

  const getDefaultValue = () => {
    return typeof defaultValue === 'function' ? defaultValue() : defaultValue
  }

  const getControlledValue = () => {
    if (modelProps.modelValue !== undefined) {
      return modelProps.modelValue
    }
    for (const key of propKeys) {
      if (modelProps[key] !== undefined) {
        return modelProps[key]
      }
    }
    return undefined
  }

  const mergedValue = shallowRef(getControlledValue() ?? getDefaultValue())
  const syncValue = () => {
    const controlledValue = getControlledValue()
    if (controlledValue !== undefined) {
      mergedValue.value = controlledValue
    }
  }

  watch(
    [() => modelProps.modelValue, ...propKeys.map(key => () => modelProps[key])],
    syncValue,
  )

  const isControlled = () => {
    return getControlledValue() !== undefined
  }

  const setValue = (nextValue: any) => {
    if (!isControlled()) {
      mergedValue.value = nextValue
    }
    modelProps?.['onUpdate:modelValue']?.(nextValue)

    propKeys.forEach((key) => {
      if (emit) {
        emit(`update:${key}`, nextValue)
      }
      else {
        modelProps[`onUpdate:${key}`]?.(nextValue)
      }
    })
  }
  return [mergedValue, setValue] as const
}
