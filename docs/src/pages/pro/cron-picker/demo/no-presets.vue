<script setup lang="ts">
import { ref } from 'vue'

const value = ref('0 15 10 ? * MON *')
</script>

<template>
  <a-flex vertical gap="middle">
    <a-alert type="warning" show-icon>
      <template #message>
        无快捷模板模式
      </template>
      <template #description>
        当不传 <code>presets</code> 时，左侧快捷选择区域不会显示，面板直接聚焦到表达式与字段编辑。
      </template>
    </a-alert>

    <a-cron-picker
      v-model:value="value"
      style="width: 100%; max-width: 720px;"
    />
  </a-flex>
</template>
