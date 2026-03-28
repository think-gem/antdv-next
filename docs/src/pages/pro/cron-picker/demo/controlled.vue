<script setup lang="ts">
import { ref } from 'vue'

const value = ref('0 0 8 1 * ? *')
const open = ref(false)
</script>

<template>
  <a-flex vertical gap="middle">
    <a-flex gap="small" align="center">
      <a-button type="primary" @click="open = true">
        打开面板
      </a-button>
      <a-button @click="open = false">
        关闭面板
      </a-button>
      <a-tag :color="open ? 'success' : 'default'">
        {{ open ? '面板已打开' : '面板已关闭' }}
      </a-tag>
    </a-flex>

    <a-cron-picker
      v-model:value="value"
      v-model:open="open"
      style="width: 100%; max-width: 720px;"
    />

    <a-card size="small" title="受控状态">
      <a-descriptions :column="1" size="small">
        <a-descriptions-item label="表达式">
          <code>{{ value }}</code>
        </a-descriptions-item>
        <a-descriptions-item label="面板状态">
          {{ open ? 'open' : 'closed' }}
        </a-descriptions-item>
      </a-descriptions>
    </a-card>
  </a-flex>
</template>
