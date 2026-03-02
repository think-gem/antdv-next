import { getCurrentInstance } from 'vue'
import { globalConfig } from '../config-provider'

export function getVueInstance() {
  const instance = getCurrentInstance()
  if (instance) {
    return {
      ...instance.appContext,
      provides: (instance as any).provides,
    }
  }

  const global = globalConfig()
  return global.appContext ?? null
}
