export const CRON_SEGMENT_KEYS = [
  'second',
  'minute',
  'hour',
  'dayOfMonth',
  'month',
  'dayOfWeek',
  'year',
] as const

export type CronSegmentKey = (typeof CRON_SEGMENT_KEYS)[number]

export interface CronSegments {
  second: string
  minute: string
  hour: string
  dayOfMonth: string
  month: string
  dayOfWeek: string
  year: string
}

export interface CronParseResult {
  valid: boolean
  expression: string
  segments?: CronSegments
  error?: string
}

export interface CronPreviewItem {
  label: string
  hint: string
}

const DEFAULT_SEGMENTS: CronSegments = {
  second: '0',
  minute: '0',
  hour: '*',
  dayOfMonth: '*',
  month: '*',
  dayOfWeek: '?',
  year: '*',
}

const WEEKDAY_LABELS: Record<string, string> = {
  SUN: '周日',
  MON: '周一',
  TUE: '周二',
  WED: '周三',
  THU: '周四',
  FRI: '周五',
  SAT: '周六',
}

export function normalizeCronExpression(value?: string) {
  return (value ?? '').trim().replace(/\s+/g, ' ')
}

export function createDefaultCronSegments(): CronSegments {
  return { ...DEFAULT_SEGMENTS }
}

export function joinCronSegments(segments: CronSegments) {
  return CRON_SEGMENT_KEYS.map(key => segments[key]).join(' ')
}

export function parseCronExpression(value?: string): CronParseResult {
  const expression = normalizeCronExpression(value)
  if (!expression) {
    return {
      valid: false,
      expression,
      error: 'Quartz 表达式不能为空',
    }
  }

  const parts = expression.split(' ')
  if (parts.length !== 7) {
    return {
      valid: false,
      expression,
      error: 'Quartz 表达式必须包含 7 段',
    }
  }

  const segments = CRON_SEGMENT_KEYS.reduce((acc, key, index) => {
    acc[key] = parts[index]!
    return acc
  }, {} as CronSegments)

  return {
    valid: true,
    expression,
    segments,
  }
}

export function summarizeCronSegments(segments: CronSegments) {
  const timeText = `${segments.hour.padStart(2, '0')}:${segments.minute.padStart(2, '0')}:${segments.second.padStart(2, '0')}`

  if (segments.dayOfWeek !== '*' && segments.dayOfWeek !== '?') {
    const label = segments.dayOfWeek
      .split(',')
      .map(item => WEEKDAY_LABELS[item] ?? item)
      .join('、')
    return `每周 ${label} ${timeText}`
  }

  if (segments.dayOfMonth !== '*' && segments.dayOfMonth !== '?') {
    return `每月 ${segments.dayOfMonth} 日 ${timeText}`
  }

  if (segments.month !== '*' && segments.month !== '?') {
    return `每年 ${segments.month} 月 ${segments.dayOfMonth === '?' ? '指定日期' : `${segments.dayOfMonth} 日`} ${timeText}`
  }

  if (segments.hour === '*' && segments.minute === '0' && segments.second === '0') {
    return '每小时运行一次'
  }

  if (segments.dayOfMonth === '*' || segments.dayOfMonth === '?') {
    return `每天 ${timeText} 运行`
  }

  return `Quartz: ${joinCronSegments(segments)}`
}

export function buildCronPreview(segments: CronSegments, count: number) {
  const summary = summarizeCronSegments(segments)
  return Array.from({ length: Math.max(count, 1) }, (_, index) => ({
    label: `${summary}${index === 0 ? '' : ` #${index + 1}`}`,
    hint: `预览 ${index + 1}`,
  })) satisfies CronPreviewItem[]
}

export function updateCronSegment(segments: CronSegments, key: CronSegmentKey, value?: string | number | null): CronSegments {
  return {
    ...segments,
    [key]: value === null || value === undefined || value === '' ? '*' : String(value),
  }
}
