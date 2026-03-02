import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { defineComponent } from 'vue'
import Modal from '..'
import ConfigProvider from '../../config-provider'
import zhCN from '../../locale/zh_CN'
import { mount, waitFakeTimer } from '/@tests/utils'

describe('modal static', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(async () => {
    Modal.destroyAll()
    await waitFakeTimer(1, 5)
    vi.useRealTimers()
    document.body.innerHTML = ''
  })

  it('modal.info should not show cancel button by default', async () => {
    Modal.info({
      title: 'This is a notification message',
      content: 'some messages',
    })

    await waitFakeTimer(1, 5)

    expect(document.querySelectorAll('.ant-modal-confirm-btns .ant-btn')).toHaveLength(1)
  })

  it('modal.confirm should show cancel button by default', async () => {
    Modal.confirm({
      title: 'This is a confirm message',
      content: 'some messages',
    })

    await waitFakeTimer(1, 5)

    expect(document.querySelectorAll('.ant-modal-confirm-btns .ant-btn')).toHaveLength(2)
  })

  it('modal.confirm should use nearest ConfigProvider locale in SFC', async () => {
    const Trigger = defineComponent(() => {
      Modal.confirm({
        title: '标题',
        content: '内容',
      })
      return () => null
    })

    const Demo = defineComponent(() => {
      return () => (
        <ConfigProvider locale={zhCN}>
          <Trigger />
        </ConfigProvider>
      )
    })

    const wrapper = mount(Demo, {
      attachTo: document.body,
    })

    await waitFakeTimer(1, 5)

    const buttonTexts = Array.from(document.querySelectorAll('.ant-modal-confirm-btns .ant-btn'))
      .map(button => button.textContent?.replace(/\s+/g, '')?.trim())
    expect(buttonTexts).toEqual(['取消', '确定'])

    wrapper.unmount()
  })
})
