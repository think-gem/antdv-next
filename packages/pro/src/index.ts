import type { App, Plugin } from 'vue'
import * as components from './components'
import './theme/augment'

export * from './components'
export { default as ProConfigProvider } from './config-provider'
export type {
  CronPickerConfig,
  ProConfigProviderProps,
  ScrollbarConfig,
  ScrollbarVisibility,
} from './config-provider'
export type { CronPickerEmits, CronPickerPreset, CronPickerProps, CronPickerSlots } from './cron-picker'

export default {
  install(app: App) {
    Object.keys(components).forEach((key) => {
      const component = (components as any)[key]
      if (component && 'install' in component) {
        app.use(component)
      }
    })
  },
} as Plugin
