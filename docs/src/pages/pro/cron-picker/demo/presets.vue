<script setup lang="ts">
import { ref } from 'vue'

const value = ref('0 0 * * * ? *')

const presets = [
  {
    label: '每小时运行一次',
    value: '0 0 * * * ? *',
    description: '适合轮询、检查类任务',
  },
  {
    label: '每天 09:30',
    value: '0 30 9 ? * * *',
    description: '适合日报、汇总类任务',
  },
  {
    label: '每周一 10:00',
    value: '0 0 10 ? * MON *',
    description: '适合周报、批处理任务',
  },
  {
    label: '每月 1 号 08:00',
    value: '0 0 8 1 * ? *',
    description: '适合账单、月度归档任务',
  },
]
</script>

<template>
  <a-flex vertical gap="middle">
    <a-cron-picker
      v-model:value="value"
      :presets="presets"
      style="width: 100%; max-width: 760px;"
    />

    <a-flex wrap gap="small">
      <a-tag
        v-for="preset in presets"
        :key="preset.value"
        :color="preset.value === value ? 'processing' : 'default'"
      >
        {{ preset.label }}
      </a-tag>
    </a-flex>
  </a-flex>
</template>
