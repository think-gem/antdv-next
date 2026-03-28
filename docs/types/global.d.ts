export {}

declare module 'vue' {
  export interface GlobalComponents {
    ACronPicker: typeof import('@antdv-next/pro')['CronPicker']
    AScrollbar: typeof import('@antdv-next/pro')['Scrollbar']
  }
}
