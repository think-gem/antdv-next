import { describe, expect, it } from 'vitest'
import {
  applyCronMutualExclusion,
  parseCronExpressionToModel,
  stringifyCronModel,
} from '../model'

describe('CronPicker model', () => {
  it('parses a valid Quartz expression into a structured model', () => {
    const result = parseCronExpressionToModel('0 15 10 ? * MON,WED *')

    expect(result.valid).toBe(true)
    expect(result.expression).toBe('0 15 10 ? * MON,WED *')
    expect(result.model).toMatchObject({
      second: { mode: 'assign', values: [0] },
      minute: { mode: 'assign', values: [15] },
      hour: { mode: 'assign', values: [10] },
      day: { mode: 'no-assign' },
      month: { mode: 'every' },
      week: { mode: 'assign', values: ['MON', 'WED'] },
      year: { mode: 'every' },
    })
  })

  it('stringifies a model back to a normalized Quartz expression', () => {
    const parsed = parseCronExpressionToModel('0 0/10 8-18 ? * MON-FRI *')

    expect(parsed.valid).toBe(true)
    expect(stringifyCronModel(parsed.model!)).toBe('0 0/10 8-18 ? * MON-FRI *')
  })

  it('clears week when day becomes active', () => {
    const parsed = parseCronExpressionToModel('0 0 8 ? * MON *')

    expect(parsed.valid).toBe(true)

    const nextModel = applyCronMutualExclusion({
      ...parsed.model!,
      day: { mode: 'assign', values: [1, 15] },
    }, 'day')

    expect(nextModel.day).toMatchObject({
      mode: 'assign',
      values: [1, 15],
    })
    expect(nextModel.week).toMatchObject({
      mode: 'no-assign',
    })
    expect(stringifyCronModel(nextModel)).toBe('0 0 8 1,15 * ? *')
  })

  it('clears day when week becomes active', () => {
    const parsed = parseCronExpressionToModel('0 30 9 1 * ? *')

    expect(parsed.valid).toBe(true)

    const nextModel = applyCronMutualExclusion({
      ...parsed.model!,
      week: { mode: 'assign', values: ['MON', 'FRI'] },
    }, 'week')

    expect(nextModel.day).toMatchObject({
      mode: 'no-assign',
    })
    expect(nextModel.week).toMatchObject({
      mode: 'assign',
      values: ['MON', 'FRI'],
    })
    expect(stringifyCronModel(nextModel)).toBe('0 30 9 ? * MON,FRI *')
  })
})
