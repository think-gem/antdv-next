import { describe, expect, it } from 'vitest'
import * as Pro from '../src/index'

describe('@antdv-next/pro', () => {
  it('exposes an empty entry module by default', () => {
    expect(Object.keys(Pro)).toEqual([])
  })
})
