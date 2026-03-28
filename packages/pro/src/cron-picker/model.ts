import type {
  CronDaySegment,
  CronModel,
  CronModelParseResult,
  CronNumericSegment,
  CronWeekSegment,
} from './types'

const EMPTY_ERROR = 'Quartz 表达式不能为空'
const LENGTH_ERROR = 'Quartz 表达式必须包含 7 段'

function normalizeCronExpression(value?: string) {
  return (value ?? '').trim().replace(/\s+/g, ' ')
}

function parseNumberValue(value: string) {
  return Number.parseInt(value, 10)
}

function parseNumericSegment(value: string): CronNumericSegment {
  if (value === '*') {
    return { mode: 'every' }
  }

  if (value.includes('/')) {
    const [start, step] = value.split('/')
    return {
      mode: 'step',
      start: parseNumberValue(start!),
      step: parseNumberValue(step!),
    }
  }

  if (value.includes('-')) {
    const [start, end] = value.split('-')
    return {
      mode: 'range',
      start: parseNumberValue(start!),
      end: parseNumberValue(end!),
    }
  }

  return {
    mode: 'assign',
    values: value.split(',').map(item => parseNumberValue(item)),
  }
}

function parseDaySegment(value: string): CronDaySegment {
  if (value === '?') {
    return { mode: 'no-assign' }
  }

  return parseNumericSegment(value)
}

function parseWeekSegment(value: string): CronWeekSegment {
  if (value === '?') {
    return { mode: 'no-assign' }
  }

  if (value.includes('-')) {
    const [start, end] = value.split('-')
    return {
      mode: 'range',
      start: start!,
      end: end!,
    }
  }

  return {
    mode: 'assign',
    values: value.split(','),
  }
}

function stringifyNumericSegment(segment: CronNumericSegment) {
  switch (segment.mode) {
    case 'every':
      return '*'
    case 'assign':
      return segment.values.join(',')
    case 'range':
      return `${segment.start}-${segment.end}`
    case 'step':
      return `${segment.start}/${segment.step}`
  }
}

function stringifyDaySegment(segment: CronDaySegment) {
  if (segment.mode === 'no-assign') {
    return '?'
  }

  return stringifyNumericSegment(segment)
}

function stringifyWeekSegment(segment: CronWeekSegment) {
  switch (segment.mode) {
    case 'no-assign':
      return '?'
    case 'assign':
      return segment.values.join(',')
    case 'range':
      return `${segment.start}-${segment.end}`
  }
}

export function parseCronExpressionToModel(value?: string): CronModelParseResult {
  const expression = normalizeCronExpression(value)

  if (!expression) {
    return {
      valid: false,
      expression,
      error: EMPTY_ERROR,
    }
  }

  const parts = expression.split(' ')

  if (parts.length !== 7) {
    return {
      valid: false,
      expression,
      error: LENGTH_ERROR,
    }
  }

  const [second, minute, hour, day, month, week, year] = parts

  return {
    valid: true,
    expression,
    model: {
      second: parseNumericSegment(second!),
      minute: parseNumericSegment(minute!),
      hour: parseNumericSegment(hour!),
      day: parseDaySegment(day!),
      month: parseNumericSegment(month!),
      week: parseWeekSegment(week!),
      year: parseNumericSegment(year!),
    },
  }
}

export function stringifyCronModel(model: CronModel) {
  return [
    stringifyNumericSegment(model.second),
    stringifyNumericSegment(model.minute),
    stringifyNumericSegment(model.hour),
    stringifyDaySegment(model.day),
    stringifyNumericSegment(model.month),
    stringifyWeekSegment(model.week),
    stringifyNumericSegment(model.year),
  ].join(' ')
}

export function applyCronMutualExclusion(model: CronModel, changedSegment?: 'day' | 'week') {
  if (changedSegment === 'day' && model.day.mode !== 'no-assign') {
    return {
      ...model,
      week: { mode: 'no-assign' as const },
    }
  }

  if (changedSegment === 'week' && model.week.mode !== 'no-assign') {
    return {
      ...model,
      day: { mode: 'no-assign' as const },
    }
  }

  return model
}
