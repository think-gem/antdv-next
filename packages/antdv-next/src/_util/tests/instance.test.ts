import { describe, expect, it, vi } from 'vitest'
import { defineComponent, h, provide } from 'vue'
import { getVueInstance } from '../instance'

import { mount } from '/@tests/utils'

const { globalConfigMock } = vi.hoisted(() => ({
  globalConfigMock: vi.fn(() => ({ appContext: null })),
}))

vi.mock('../../config-provider', () => ({
  globalConfig: globalConfigMock,
}))

describe('_util instance', () => {
  it('should use current instance provides in component setup', () => {
    const token = Symbol('instance-token')
    let capturedContext: ReturnType<typeof getVueInstance> | null = null

    const Child = defineComponent(() => {
      capturedContext = getVueInstance()
      return () => null
    })

    const Demo = defineComponent(() => {
      provide(token, 'from-provider')
      return () => h(Child)
    })

    const wrapper = mount(Demo)

    expect(capturedContext).not.toBeNull()
    expect(capturedContext?.provides[token]).toBe('from-provider')
    expect(globalConfigMock).not.toHaveBeenCalled()

    wrapper.unmount()
  })

  it('should fallback to global appContext when current instance is missing', () => {
    const appContext = { provides: { fromGlobal: true } }
    globalConfigMock.mockReturnValueOnce({ appContext })

    expect(getVueInstance()).toBe(appContext)
    expect(globalConfigMock).toHaveBeenCalledTimes(1)
  })
})
