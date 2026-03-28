import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { nextTick } from 'vue'
import { parseCronExpressionToModel } from '../model'

describe('CronPicker', () => {
  it('exports CronPicker from package entry', async () => {
    const mod = await import('../../index')
    expect(mod.CronPicker).toBeDefined()
  })

  it('renders the component root and registers themed styles', async () => {
    const { CronPicker } = await import('../../index')
    const wrapper = mount(CronPicker, {
      props: {
        defaultValue: '0 30 9 ? * MON-FRI *',
      },
    })

    await nextTick()

    expect(wrapper.find('.ant-cron-picker').exists()).toBe(true)

    const styleText = Array.from(document.head.querySelectorAll('style'))
      .map(node => node.textContent ?? '')
      .join('\n')

    expect(styleText).toContain('.ant-cron-picker')
  })

  it('shows presets in popup when configured', async () => {
    const { CronPicker } = await import('../../index')
    mount(CronPicker, {
      props: {
        open: true,
        presets: [
          { label: '每小时运行一次', value: '0 0 * * * ? *' },
          { label: '每天运行一次', value: '0 30 9 ? * * *' },
        ],
      },
      attachTo: document.body,
    })

    await nextTick()

    expect(document.body.textContent).toContain('每小时运行一次')
    expect(document.body.textContent).toContain('每天运行一次')
  })

  it('hides preset rail when presets are absent', async () => {
    const { CronPicker } = await import('../../index')
    const wrapper = mount(CronPicker, {
      props: {
        open: true,
      },
      attachTo: document.body,
    })

    await nextTick()

    expect(wrapper.find('.ant-cron-picker-presets').exists()).toBe(false)
  })

  it('parses expression on blur and emits update:value', async () => {
    const { CronPicker } = await import('../../index')
    const wrapper = mount(CronPicker, {
      props: {
        defaultValue: '0 0 * * * ? *',
        open: true,
      },
      attachTo: document.body,
    })

    const input = wrapper.find('.ant-cron-picker input')

    await input.setValue('0 15 10 ? * MON *')
    await input.trigger('blur')

    expect(wrapper.emitted('update:value')?.slice(-1)[0]).toEqual(['0 15 10 ? * MON *'])
    expect(document.body.textContent).toContain('每周')
  })

  it('parses expression on Enter and emits update:value', async () => {
    const { CronPicker } = await import('../../index')
    const wrapper = mount(CronPicker)
    const input = wrapper.find('.ant-cron-picker input')

    await input.setValue('0 0 8 1 * ? *')
    await input.trigger('keydown', { key: 'Enter' })

    expect(wrapper.emitted('update:value')?.slice(-1)[0]).toEqual(['0 0 8 1 * ? *'])
  })

  it('applies preset value when preset is clicked', async () => {
    const { CronPicker } = await import('../../index')
    document.body.innerHTML = ''
    const wrapper = mount(CronPicker, {
      props: {
        open: true,
        presets: [
          { label: '每月运行一次', value: '0 0 8 1 * ? *' },
        ],
      },
      attachTo: document.body,
    })

    await nextTick()

    const preset = Array.from(document.body.querySelectorAll('.ant-cron-picker-preset'))
      .find(node => node.textContent?.includes('每月运行一次')) as HTMLElement | undefined

    expect(preset).toBeDefined()
    preset?.click()
    await nextTick()

    const expressionInput = wrapper.find('.ant-cron-picker input').element as HTMLInputElement

    expect(expressionInput.value).toBe('0 0 8 1 * ? *')
  })

  it('applies the panel model back to the trigger expression', async () => {
    const { CronPicker } = await import('../../index')
    document.body.innerHTML = ''
    const wrapper = mount(CronPicker, {
      props: {
        open: true,
        defaultValue: '0 0 8 1 * ? *',
      },
      attachTo: document.body,
    })

    await nextTick()

    const panel = wrapper.findComponent({ name: 'CronPanel' })
    expect(panel.exists()).toBe(true)

    const parsed = parseCronExpressionToModel('0 45 8 1 * ? *')
    expect(parsed.valid).toBe(true)

    panel.vm.$emit('apply', parsed.model)
    await nextTick()

    expect(wrapper.emitted('update:value')?.slice(-1)[0]).toEqual(['0 45 8 1 * ? *'])
  })

  it('shows validation feedback when expression is invalid after blur', async () => {
    const { CronPicker } = await import('../../index')
    const wrapper = mount(CronPicker, {
      props: {
        open: true,
      },
      attachTo: document.body,
    })
    const input = wrapper.find('.ant-cron-picker input')

    await input.setValue('invalid cron')
    await input.trigger('blur')

    expect(wrapper.find('.ant-input-status-error').exists()).toBe(true)
    expect(wrapper.emitted('update:value')).toBeUndefined()
  })
})
