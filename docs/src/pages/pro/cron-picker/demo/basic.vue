<script setup lang="ts">
import { ref } from 'vue'

const value = ref('0 30 9 ? * MON-FRI *')
</script>

<template>
  <a-flex vertical gap="middle">
    <a-cron-picker
      v-model:value="value"
      style="width: 100%; max-width: 720px;"
    />

    <a-alert type="info" show-icon>
      <template #message>
        当前表达式
      </template>
      <template #description>
        {{ value }}
      </template>
    </a-alert>
  </a-flex>
</template>
