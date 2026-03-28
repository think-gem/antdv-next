---
category: Pro Components
title: CronPicker
subtitle: 定时任务输入框
description: 面向 Pro 场景的 Quartz 7 段定时任务表达式输入与弹层编辑组件。
demo:
  cols: 1
group:
  title: Scheduling
  order: 2
---

## 何时使用

- 当你需要一个可直接输入 Quartz 表达式的定时任务表单项时。
- 当你希望同时提供快捷模板和字段化规则编辑，而不是只暴露纯文本输入。
- 当业务侧希望自定义常用调度模板，例如“每小时一次”、“每天一次”、“每月一次”。
- 当你需要在输入表达式后，通过摘要与预览帮助用户确认规则结果时。

## 代码演示

<demo-group>
  <demo src="./demo/basic.vue">基础用法</demo>
  <demo src="./demo/presets.vue">快捷模板</demo>
  <demo src="./demo/controlled.vue">受控打开状态</demo>
  <demo src="./demo/no-presets.vue">无模板模式</demo>
</demo-group>

## API

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| value | 当前 Quartz 7 段表达式 | `string` | - |
| defaultValue | 默认 Quartz 7 段表达式 | `string` | `'0 0 * * * ? *'` |
| open | 是否打开弹层 | `boolean` | - |
| defaultOpen | 默认是否打开弹层 | `boolean` | `false` |
| placeholder | 输入框占位文案 | `string` | `'请输入 Quartz 表达式'` |
| disabled | 是否禁用 | `boolean` | `false` |
| presets | 左侧快捷模板列表；不传时不显示该区域 | `{ label: string; value: string; description?: string }[]` | - |
| previewCount | 右侧预览条目数量 | `number` | `5` |
| getPopupContainer | 弹层挂载容器 | `(triggerNode?: HTMLElement) => HTMLElement` | - |

### 事件

| 事件 | 说明 | 类型 |
| --- | --- | --- |
| update:value | Quartz 表达式更新时触发 | `(value: string) => void` |
| change | Quartz 表达式更新时触发 | `(value: string) => void` |
| update:open | 弹层打开状态变化时触发 | `(open: boolean) => void` |
| openChange | 弹层打开状态变化时触发 | `(open: boolean) => void` |

## 说明

- 主输入框采用 `blur / Enter` 触发解析，避免用户在输入过程中被频繁打断。
- 第一版面板编辑优先覆盖 Quartz 7 段的基础配置与常见模板。
- 快捷模板完全由业务侧传入，组件不会内置固定模板列表。
