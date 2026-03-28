export type CronNumericMode = 'every' | 'assign' | 'range' | 'step'
export type CronDayMode = CronNumericMode | 'no-assign'
export type CronWeekMode = 'assign' | 'range' | 'no-assign'

export interface CronPickerPreset {
  label: string
  value: string
  description?: string
}

export interface CronEverySegment {
  mode: 'every'
}

export interface CronAssignSegment<T> {
  mode: 'assign'
  values: T[]
}

export interface CronRangeSegment<T> {
  mode: 'range'
  start: T
  end: T
}

export interface CronStepSegment<T> {
  mode: 'step'
  start: T
  step: number
}

export interface CronNoAssignSegment {
  mode: 'no-assign'
}

export type CronNumericSegment = CronEverySegment | CronAssignSegment<number> | CronRangeSegment<number> | CronStepSegment<number>
export type CronDaySegment = CronNumericSegment | CronNoAssignSegment
export type CronWeekSegment = CronAssignSegment<string> | CronRangeSegment<string> | CronNoAssignSegment

export interface CronModel {
  second: CronNumericSegment
  minute: CronNumericSegment
  hour: CronNumericSegment
  day: CronDaySegment
  month: CronNumericSegment
  week: CronWeekSegment
  year: CronNumericSegment
}

export interface CronModelParseResult {
  valid: boolean
  expression: string
  model?: CronModel
  error?: string
}

export interface CronPreviewItem {
  label: string
  hint: string
}
