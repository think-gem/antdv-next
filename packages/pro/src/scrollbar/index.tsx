import { defineComponent } from 'vue'

export const Scrollbar = defineComponent(
  () => {
    return () => {
      return <div>scrollbar</div>
    }
  },
  {
    name: 'AScrollbar',
  },
)
