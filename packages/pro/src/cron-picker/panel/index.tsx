import type { SlotsType } from 'vue'
import type { CronModel, CronPickerPreset } from '../types'
import { clsx } from '@v-c/util'
import Button from 'antdv-next/button'
import Tabs from 'antdv-next/tabs'
import { computed, defineComponent, shallowRef } from 'vue'
import { applyCronMutualExclusion } from '../model'
import { buildCronPreview, summarizeCronModel } from '../summary'
import CronSegmentDay from './segments/day'
import CronSegmentHour from './segments/hour'
import CronSegmentMinute from './segments/minute'
import CronSegmentMonth from './segments/month'
import CronSegmentSecond from './segments/second'
import CronSegmentWeek from './segments/week'
import CronSegmentYear from './segments/year'

export interface CronPanelProps {
  prefixCls: string
  model: CronModel
  presets?: CronPickerPreset[]
  previewCount?: number
}

export interface CronPanelEmits {
  'update:model': (value: CronModel) => void
  apply: (value: CronModel) => void
  cancel: () => void
  presetSelect: (value: string) => void
  [key: string]: (...args: any[]) => void
}

export interface CronPanelSlots {}

const DEFAULT_PREVIEW_COUNT = 5

export default defineComponent<
  CronPanelProps,
  CronPanelEmits,
  string,
  SlotsType<CronPanelSlots>
>((props, { emit }) => {
  const activeKey = shallowRef('second')

  const previewItems = computed(() => buildCronPreview(props.model, props.previewCount ?? DEFAULT_PREVIEW_COUNT))
  const summary = computed(() => summarizeCronModel(props.model))

  const updateModel = (patch: Partial<CronModel>, changedSegment?: 'day' | 'week') => {
    const nextModel = applyCronMutualExclusion({
      ...props.model,
      ...patch,
    }, changedSegment)
    emit('update:model', nextModel)
  }

  const items = computed(() => [
    {
      key: 'second',
      label: '秒',
      content: <CronSegmentSecond value={props.model.second} onUpdate:value={value => updateModel({ second: value })} />,
    },
    {
      key: 'minute',
      label: '分',
      content: <CronSegmentMinute value={props.model.minute} onUpdate:value={value => updateModel({ minute: value })} />,
    },
    {
      key: 'hour',
      label: '时',
      content: <CronSegmentHour value={props.model.hour} onUpdate:value={value => updateModel({ hour: value })} />,
    },
    {
      key: 'day',
      label: '日',
      content: <CronSegmentDay value={props.model.day} onUpdate:value={value => updateModel({ day: value }, 'day')} />,
    },
    {
      key: 'month',
      label: '月',
      content: <CronSegmentMonth value={props.model.month} onUpdate:value={value => updateModel({ month: value })} />,
    },
    {
      key: 'week',
      label: '周',
      content: <CronSegmentWeek value={props.model.week} onUpdate:value={value => updateModel({ week: value }, 'week')} />,
    },
    {
      key: 'year',
      label: '年',
      content: <CronSegmentYear value={props.model.year} onUpdate:value={value => updateModel({ year: value })} />,
    },
  ])

  return () => (
    <div class={`${props.prefixCls}-popup`}>
      {props.presets && props.presets.length > 0 && (
        <div class={`${props.prefixCls}-presets`}>
          <div class={`${props.prefixCls}-preset-list`}>
            {props.presets.map(preset => (
              <button
                key={preset.value}
                type="button"
                class={clsx(`${props.prefixCls}-preset`)}
                onClick={() => emit('presetSelect', preset.value)}
              >
                <div>{preset.label}</div>
                <div>{preset.description ?? preset.value}</div>
              </button>
            ))}
          </div>
        </div>
      )}
      <div class={`${props.prefixCls}-panel`}>
        <div class={`${props.prefixCls}-header`}>
          <div class={`${props.prefixCls}-summary`}>{summary.value}</div>
        </div>
        <Tabs
          size="small"
          activeKey={activeKey.value}
          onUpdate:activeKey={key => (activeKey.value = key)}
          items={items.value}
        />
        <div class={`${props.prefixCls}-preview`}>
          {previewItems.value.map(item => (
            <div key={`${item.label}-${item.hint}`} class={`${props.prefixCls}-preview-item`}>
              <div>{item.label}</div>
              <div>{item.hint}</div>
            </div>
          ))}
        </div>
        <div class={`${props.prefixCls}-actions`}>
          <Button size="small" data-action="cancel" onClick={() => emit('cancel')}>取消</Button>
          <Button size="small" type="primary" data-action="apply" onClick={() => emit('apply', props.model)}>应用规则</Button>
        </div>
      </div>
    </div>
  )
}, {
  name: 'CronPanel',
  inheritAttrs: false,
})
