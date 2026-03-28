import type { CronModel, CronPreviewItem } from './types'
import { stringifyCronModel } from './model'

const WEEKDAY_LABELS: Record<string, string> = {
  SUN: '周日',
  MON: '周一',
  TUE: '周二',
  WED: '周三',
  THU: '周四',
  FRI: '周五',
  SAT: '周六',
}

function pad(values?: number[]) {
  const value = values?.[0]
  if (value === undefined || Number.isNaN(value)) {
    return '*'
  }
  return String(value).padStart(2, '0')
}

export function summarizeCronModel(model: CronModel) {
  const timeText = `${pad(model.hour.mode === 'assign' ? model.hour.values : undefined)}:${pad(model.minute.mode === 'assign' ? model.minute.values : undefined)}:${pad(model.second.mode === 'assign' ? model.second.values : undefined)}`

  if (model.week.mode === 'assign') {
    const label = model.week.values.map(item => WEEKDAY_LABELS[item] ?? item).join('、')
    return `每周 ${label} ${timeText}`
  }

  if (model.day.mode === 'assign') {
    return `每月 ${model.day.values.join('、')} 日 ${timeText}`
  }

  if (model.month.mode === 'assign') {
    return `每年 ${model.month.values.join('、')} 月 ${model.day.mode === 'no-assign' ? '指定日期' : timeText}`
  }

  if (model.hour.mode === 'every' && model.minute.mode === 'assign' && model.minute.values[0] === 0) {
    return '每小时运行一次'
  }

  return `Quartz: ${stringifyCronModel(model)}`
}

export function buildCronPreview(model: CronModel, count: number) {
  const summary = summarizeCronModel(model)

  return Array.from({ length: Math.max(1, count) }, (_, index) => ({
    label: index === 0 ? summary : `${summary} #${index + 1}`,
    hint: `预览 ${index + 1}`,
  })) satisfies CronPreviewItem[]
}
