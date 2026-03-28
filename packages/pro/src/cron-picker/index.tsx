import type { ThemeConfig } from 'antdv-next/config-provider/context'
import type { App, CSSProperties, SlotsType } from 'vue'
import type { CronModel, CronPickerPreset as CronPickerPresetType } from './types'
import { ClockCircleOutlined, DownOutlined } from '@antdv-next/icons'
import { clsx } from '@v-c/util'
import { useBaseConfig } from 'antdv-next/config-provider/context'
import useCSSVarCls from 'antdv-next/config-provider/hooks/useCSSVarCls'
import Input from 'antdv-next/input'
import Popover from 'antdv-next/popover'
import { computed, defineComponent, shallowRef, watch } from 'vue'
import { useProComponentConfig } from '../config-provider'
import { parseCronExpressionToModel, stringifyCronModel } from './model'
import CronPanel from './panel'
import useStyle from './style'

export type CronPickerPreset = CronPickerPresetType

export interface CronPickerProps {
  prefixCls?: string
  rootClass?: string
  value?: string
  defaultValue?: string
  open?: boolean
  defaultOpen?: boolean
  placeholder?: string
  disabled?: boolean
  presets?: CronPickerPreset[]
  previewCount?: number
  getPopupContainer?: (triggerNode?: HTMLElement) => HTMLElement
  theme?: ThemeConfig
  style?: CSSProperties
}

export interface CronPickerEmits {
  'update:value': (value: string) => void
  change: (value: string) => void
  'update:open': (open: boolean) => void
  openChange: (open: boolean) => void
  [key: string]: (...args: any[]) => void
}

export interface CronPickerSlots {
  default?: () => any
}

const DEFAULT_EXPRESSION = '0 0 * * * ? *'
const DEFAULT_PREVIEW_COUNT = 5

function getFallbackModel() {
  return parseCronExpressionToModel(DEFAULT_EXPRESSION).model!
}

const CronPicker = defineComponent<
  CronPickerProps,
  CronPickerEmits,
  string,
  SlotsType<CronPickerSlots>
>((props, { attrs, emit }) => {
  const { prefixCls } = useBaseConfig('cron-picker', props)
  const proConfig = useProComponentConfig('cronPicker')
  const rootCls = useCSSVarCls(prefixCls)
  const [hashId, cssVarCls] = useStyle(prefixCls, rootCls)

  const mergedPreviewCount = computed(() => props.previewCount ?? proConfig.value.previewCount ?? DEFAULT_PREVIEW_COUNT)
  const mergedPresets = computed(() => props.presets ?? proConfig.value.presets ?? [])

  const innerOpen = shallowRef(props.open ?? props.defaultOpen ?? false)
  const expression = shallowRef(props.value ?? props.defaultValue ?? DEFAULT_EXPRESSION)
  const inputValue = shallowRef(expression.value)
  const errorMessage = shallowRef('')
  const panelModel = shallowRef<CronModel>(getFallbackModel())

  const syncFromExpression = (nextExpression?: string) => {
    const parsed = parseCronExpressionToModel(nextExpression)

    if (parsed.valid && parsed.model) {
      expression.value = parsed.expression
      inputValue.value = parsed.expression
      panelModel.value = parsed.model
      errorMessage.value = ''
      return true
    }

    if (nextExpression !== undefined) {
      inputValue.value = nextExpression
      errorMessage.value = parsed.error ?? 'Quartz 表达式无效'
    }

    return false
  }

  syncFromExpression(expression.value)

  watch(
    () => props.open,
    (value) => {
      if (value !== undefined) {
        innerOpen.value = value
      }
    },
    { immediate: true },
  )

  watch(
    () => props.value,
    (value) => {
      if (value !== undefined) {
        syncFromExpression(value)
      }
    },
    { immediate: true },
  )

  const mergedClassName = computed(() => clsx(
    prefixCls.value,
    {
      [`${prefixCls.value}-open`]: innerOpen.value,
    },
    hashId.value,
    cssVarCls.value,
    rootCls.value,
    proConfig.value.class,
    props.rootClass,
    attrs.class,
  ))

  const mergedStyle = computed(() => [proConfig.value.style, props.style, attrs.style])

  const emitValue = (nextExpression: string) => {
    emit('update:value', nextExpression)
    emit('change', nextExpression)
  }

  const triggerOpenChange = (nextOpen: boolean) => {
    if (props.open === undefined) {
      innerOpen.value = nextOpen
    }
    emit('update:open', nextOpen)
    emit('openChange', nextOpen)
  }

  const applyExpression = (nextExpression: string) => {
    const parsed = parseCronExpressionToModel(nextExpression)

    if (!parsed.valid || !parsed.model) {
      errorMessage.value = parsed.error ?? 'Quartz 表达式无效'
      inputValue.value = nextExpression
      return false
    }

    expression.value = parsed.expression
    inputValue.value = parsed.expression
    panelModel.value = parsed.model
    errorMessage.value = ''
    emitValue(parsed.expression)
    return true
  }

  const applyPanelModel = (nextModel: CronModel) => {
    panelModel.value = nextModel
    const nextExpression = stringifyCronModel(nextModel)
    expression.value = nextExpression
    inputValue.value = nextExpression
    errorMessage.value = ''
    emitValue(nextExpression)
    triggerOpenChange(false)
  }

  const popupContent = () => (
    <CronPanel
      prefixCls={prefixCls.value}
      model={panelModel.value}
      presets={mergedPresets.value}
      previewCount={mergedPreviewCount.value}
      onUpdate:model={value => (panelModel.value = value)}
      onPresetSelect={value => applyExpression(value)}
      onApply={value => applyPanelModel(value)}
      onCancel={() => triggerOpenChange(false)}
    />
  )

  return () => (
    <Popover
      open={innerOpen.value}
      trigger="click"
      placement="bottom"
      content={popupContent}
      onOpenChange={triggerOpenChange}
      getPopupContainer={props.getPopupContainer}
    >
      <div class={mergedClassName.value} style={mergedStyle.value}>
        <Input
          class={`${prefixCls.value}-input`}
          value={inputValue.value}
          placeholder={props.placeholder ?? '请输入 Quartz 表达式'}
          disabled={props.disabled}
          status={errorMessage.value ? 'error' : undefined}
          onUpdate:value={value => (inputValue.value = value)}
          onBlur={() => applyExpression(inputValue.value)}
          onKeydown={(event: KeyboardEvent) => {
            if (event.key === 'Enter') {
              event.preventDefault()
              applyExpression(inputValue.value)
            }
          }}
          suffix={(
            <span class={`${prefixCls.value}-suffix`}>
              <span class={`${prefixCls.value}-suffix-icon`}>
                <ClockCircleOutlined />
              </span>
              <span class={`${prefixCls.value}-suffix-icon ${prefixCls.value}-arrow`}>
                <DownOutlined />
              </span>
            </span>
          )}
        />
      </div>
    </Popover>
  )
}, {
  name: 'ACronPicker',
  inheritAttrs: false,
})

;(CronPicker as any).install = (app: App) => {
  app.component(CronPicker.name, CronPicker)
}

export default CronPicker
