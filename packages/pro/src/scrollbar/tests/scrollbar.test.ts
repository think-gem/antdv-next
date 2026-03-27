import { mount } from '@vue/test-utils'
import { useBaseConfig } from 'antdv-next/config-provider/context'
import { describe, expect, it, vi } from 'vitest'
import { defineComponent, h, nextTick } from 'vue'
import { useProComponentConfig } from '../../config-provider'
import { ProConfigProvider, Scrollbar } from '../../index'

const PrefixProbe = defineComponent(() => {
  const { prefixCls } = useBaseConfig('scrollbar')
  return () => h('div', { class: 'prefix-probe' }, prefixCls.value)
})

const ProScrollbarProbe = defineComponent(() => {
  const config = useProComponentConfig('scrollbar')
  return () => h('div', { class: 'pro-scrollbar-probe' }, config.value.class ?? 'empty')
})

function mockScrollMetrics(element: Element, metrics: Partial<Record<'clientWidth' | 'clientHeight' | 'scrollWidth' | 'scrollHeight' | 'scrollLeft' | 'scrollTop', number>>) {
  Object.entries(metrics).forEach(([key, value]) => {
    Object.defineProperty(element, key, {
      configurable: true,
      writable: true,
      value,
    })
  })
}

describe('Scrollbar', () => {
  it('exports Scrollbar from package entry', async () => {
    const mod = await import('../../index')
    expect(mod.Scrollbar).toBeDefined()
  })

  it('exports ProConfigProvider from package entry', async () => {
    const mod = await import('../../index')
    expect(mod.ProConfigProvider).toBeDefined()
  })

  it('passes shared config through ProConfigProvider', () => {
    const wrapper = mount(ProConfigProvider, {
      props: {
        prefixCls: 'custom',
      },
      slots: {
        default: () => h(PrefixProbe),
      },
    })

    expect(wrapper.find('.prefix-probe').text()).toBe('custom-scrollbar')
  })

  it('provides pro scrollbar defaults from ProConfigProvider', () => {
    const wrapper = mount(ProConfigProvider, {
      props: {
        scrollbar: {
          class: 'from-provider',
        },
      },
      slots: {
        default: () => h(ProScrollbarProbe),
      },
    })

    expect(wrapper.find('.pro-scrollbar-probe').text()).toBe('from-provider')
  })

  it('renders slot content in Scrollbar', () => {
    const wrapper = mount(Scrollbar, {
      slots: {
        default: () => h('div', { class: 'scroll-content' }, 'content'),
      },
    })

    expect(wrapper.find('.scroll-content').exists()).toBe(true)
  })

  it('uses the shared prefixCls and provider class in Scrollbar', () => {
    const wrapper = mount(ProConfigProvider, {
      props: {
        prefixCls: 'custom',
        scrollbar: {
          class: 'from-provider',
        },
      },
      slots: {
        default: () => h(Scrollbar),
      },
    })

    expect(wrapper.find('.custom-scrollbar').exists()).toBe(true)
    expect(wrapper.find('.from-provider').exists()).toBe(true)
  })

  it('supports semantic classes and styles as objects', async () => {
    const wrapper = mount(Scrollbar, {
      props: {
        visibilityX: 'always',
        visibilityY: 'always',
        classes: {
          root: 'scrollbar-root',
          container: 'scrollbar-container',
          track: 'scrollbar-track',
          trackY: 'scrollbar-track-y',
          trackX: 'scrollbar-track-x',
          thumb: 'scrollbar-thumb',
          thumbY: 'scrollbar-thumb-y',
          thumbX: 'scrollbar-thumb-x',
        },
        styles: {
          root: { padding: '4px' },
          container: { outline: '1px solid red' },
          track: { backgroundColor: 'rgb(1, 2, 3)' },
          thumb: { backgroundColor: 'rgb(4, 5, 6)' },
        },
      },
    })

    await nextTick()

    expect(wrapper.find('.ant-scrollbar').classes()).toContain('scrollbar-root')
    expect(wrapper.find('.ant-scrollbar').attributes('style')).toContain('padding: 4px')
    expect(wrapper.find('.ant-scrollbar-container').classes()).toContain('scrollbar-container')
    expect(wrapper.find('.ant-scrollbar-container').attributes('style')).toContain('outline: 1px solid red')
    expect(wrapper.find('.ant-scrollbar-track-y').classes()).toContain('scrollbar-track')
    expect(wrapper.find('.ant-scrollbar-track-y').classes()).toContain('scrollbar-track-y')
    expect(wrapper.find('.ant-scrollbar-track-y').attributes('style')).toContain('background-color: rgb(1, 2, 3)')
    expect(wrapper.find('.ant-scrollbar-thumb-y').classes()).toContain('scrollbar-thumb')
    expect(wrapper.find('.ant-scrollbar-thumb-y').classes()).toContain('scrollbar-thumb-y')
    expect(wrapper.find('.ant-scrollbar-thumb-y').attributes('style')).toContain('background-color: rgb(4, 5, 6)')
    expect(wrapper.find('.ant-scrollbar-track-x').classes()).toContain('scrollbar-track-x')
    expect(wrapper.find('.ant-scrollbar-thumb-x').classes()).toContain('scrollbar-thumb-x')
  })

  it('supports semantic classes and styles as functions', async () => {
    const classes = vi.fn((info: { props: any }) => ({
      root: info.props.native ? 'native-root' : 'custom-root',
      trackY: info.props.visibilityY === 'always' ? 'always-track-y' : 'auto-track-y',
      thumbY: 'dynamic-thumb-y',
    }))

    const styles = vi.fn((info: { props: any }) => ({
      root: { margin: info.props.native ? '1px' : '2px' },
      thumbY: { backgroundColor: info.props.visibilityY === 'always' ? 'rgb(7, 8, 9)' : 'rgb(9, 8, 7)' },
    }))

    const wrapper = mount(Scrollbar, {
      props: {
        visibilityY: 'always',
        classes,
        styles,
      },
    })

    await nextTick()

    expect(classes).toHaveBeenCalled()
    expect(styles).toHaveBeenCalled()
    expect(wrapper.find('.ant-scrollbar').classes()).toContain('custom-root')
    expect(wrapper.find('.ant-scrollbar').attributes('style')).toContain('margin: 2px')
    expect(wrapper.find('.ant-scrollbar-track-y').classes()).toContain('always-track-y')
    expect(wrapper.find('.ant-scrollbar-thumb-y').classes()).toContain('dynamic-thumb-y')
    expect(wrapper.find('.ant-scrollbar-thumb-y').attributes('style')).toContain('background-color: rgb(7, 8, 9)')

    await wrapper.setProps({
      native: true,
      visibilityY: 'auto',
    })

    expect(wrapper.find('.ant-scrollbar').classes()).toContain('native-root')
  })

  it('merges semantic classes and styles from ProConfigProvider and component props', async () => {
    const wrapper = mount(ProConfigProvider, {
      props: {
        scrollbar: {
          classes: {
            root: 'provider-root',
            trackY: 'provider-track-y',
          },
          styles: {
            root: { border: '1px solid blue' },
            thumbY: { borderRadius: '20px' },
          },
        },
      },
      slots: {
        default: () =>
          h(Scrollbar, {
            visibilityY: 'always',
            classes: {
              root: 'props-root',
              thumbY: 'props-thumb-y',
            },
            styles: {
              root: { padding: '6px' },
              thumbY: { backgroundColor: 'rgb(10, 11, 12)' },
            },
          }),
      },
    })

    await nextTick()

    const root = wrapper.find('.ant-scrollbar')
    const thumbY = wrapper.find('.ant-scrollbar-thumb-y')

    expect(root.classes()).toContain('provider-root')
    expect(root.classes()).toContain('props-root')
    expect(root.attributes('style')).toContain('border: 1px solid blue')
    expect(root.attributes('style')).toContain('padding: 6px')
    expect(wrapper.find('.ant-scrollbar-track-y').classes()).toContain('provider-track-y')
    expect(thumbY.classes()).toContain('props-thumb-y')
    expect(thumbY.attributes('style')).toContain('border-radius: 20px')
    expect(thumbY.attributes('style')).toContain('background-color: rgb(10, 11, 12)')
  })

  it('uses provider visibility defaults when component props are absent', async () => {
    const wrapper = mount(ProConfigProvider, {
      props: {
        scrollbar: {
          visibilityY: 'always',
        },
      },
      slots: {
        default: () => h(Scrollbar),
      },
    })

    await nextTick()

    expect(wrapper.find('.ant-scrollbar').attributes('data-visibility-y')).toBe('always')
    expect(wrapper.find('.ant-scrollbar-track-y').exists()).toBe(true)
  })

  it('adds the css var root class when cssVar mode is enabled', () => {
    const wrapper = mount(ProConfigProvider, {
      props: {
        theme: {
          cssVar: {
            key: 'pro-scrollbar-test',
          },
        },
      },
      slots: {
        default: () => h(Scrollbar),
      },
    })

    expect(wrapper.find('.ant-scrollbar-css-var').exists()).toBe(true)
  })

  it('renders a vertical custom scrollbar when vertical overflow exists', async () => {
    const wrapper = mount(Scrollbar, {
      slots: {
        default: () => h('div', { class: 'scroll-content' }, 'content'),
      },
    })

    const container = wrapper.find('.ant-scrollbar-container')
    mockScrollMetrics(container.element, {
      clientHeight: 100,
      scrollHeight: 240,
      scrollTop: 0,
      clientWidth: 100,
      scrollWidth: 100,
      scrollLeft: 0,
    })

    await container.trigger('scroll')
    await nextTick()

    expect(wrapper.find('.ant-scrollbar-track-y').exists()).toBe(true)
    expect(wrapper.find('.ant-scrollbar-thumb-y').exists()).toBe(true)
  })

  it('renders a horizontal custom scrollbar when horizontal overflow exists', async () => {
    const wrapper = mount(Scrollbar, {
      slots: {
        default: () => h('div', { class: 'scroll-content' }, 'content'),
      },
    })

    const container = wrapper.find('.ant-scrollbar-container')
    mockScrollMetrics(container.element, {
      clientHeight: 100,
      scrollHeight: 100,
      scrollTop: 0,
      clientWidth: 100,
      scrollWidth: 240,
      scrollLeft: 0,
    })

    await container.trigger('scroll')
    await nextTick()

    expect(wrapper.find('.ant-scrollbar-track-x').exists()).toBe(true)
    expect(wrapper.find('.ant-scrollbar-thumb-x').exists()).toBe(true)
  })

  it('hides the custom scrollbar when the axis visibility is hidden', async () => {
    const wrapper = mount(Scrollbar, {
      props: {
        visibilityY: 'hidden',
      },
    })

    const container = wrapper.find('.ant-scrollbar-container')
    mockScrollMetrics(container.element, {
      clientHeight: 100,
      scrollHeight: 240,
      scrollTop: 0,
      clientWidth: 100,
      scrollWidth: 100,
      scrollLeft: 0,
    })

    await container.trigger('scroll')
    await nextTick()

    expect(wrapper.find('.ant-scrollbar-track-y').exists()).toBe(false)
  })

  it('renders the custom scrollbar when the axis visibility is always', async () => {
    const wrapper = mount(Scrollbar, {
      props: {
        visibilityX: 'always',
      },
    })

    await nextTick()

    expect(wrapper.find('.ant-scrollbar-track-x').exists()).toBe(true)
  })

  it('disables custom overlays in native mode', async () => {
    const wrapper = mount(Scrollbar, {
      props: {
        native: true,
        visibilityX: 'always',
        visibilityY: 'always',
      },
    })

    await nextTick()

    expect(wrapper.find('.ant-scrollbar-track-x').exists()).toBe(false)
    expect(wrapper.find('.ant-scrollbar-track-y').exists()).toBe(false)
  })

  it('updates scrollTop when dragging the vertical thumb', async () => {
    const wrapper = mount(Scrollbar)
    const container = wrapper.find('.ant-scrollbar-container')
    let scrollTop = 0

    Object.defineProperty(container.element, 'scrollTop', {
      configurable: true,
      get: () => scrollTop,
      set: value => (scrollTop = Number(value)),
    })

    mockScrollMetrics(container.element, {
      clientHeight: 100,
      scrollHeight: 300,
      clientWidth: 100,
      scrollWidth: 100,
      scrollLeft: 0,
    })

    await container.trigger('scroll')
    await nextTick()

    await wrapper.find('.ant-scrollbar-thumb-y').trigger('mousedown', { clientY: 0 })
    document.dispatchEvent(new MouseEvent('mousemove', { clientY: 20 }))
    document.dispatchEvent(new MouseEvent('mouseup'))

    expect(scrollTop).toBeGreaterThan(0)
  })

  it('updates scrollLeft when dragging the horizontal thumb', async () => {
    const wrapper = mount(Scrollbar)
    const container = wrapper.find('.ant-scrollbar-container')
    let scrollLeft = 0

    Object.defineProperty(container.element, 'scrollLeft', {
      configurable: true,
      get: () => scrollLeft,
      set: value => (scrollLeft = Number(value)),
    })

    mockScrollMetrics(container.element, {
      clientHeight: 100,
      scrollHeight: 100,
      scrollTop: 0,
      clientWidth: 100,
      scrollWidth: 300,
    })

    await container.trigger('scroll')
    await nextTick()

    await wrapper.find('.ant-scrollbar-thumb-x').trigger('mousedown', { clientX: 0 })
    document.dispatchEvent(new MouseEvent('mousemove', { clientX: 20 }))
    document.dispatchEvent(new MouseEvent('mouseup'))

    expect(scrollLeft).toBeGreaterThan(0)
  })
})
