---
category: Pro Components
title: CronPicker
description: A Pro-oriented Quartz 7-field scheduler input with editable expression entry and popover-based rule editing.
demo:
  cols: 1
group:
  title: Scheduling
  order: 2
---

## When To Use

- When you need a form field that accepts direct Quartz expression input.
- When you want both quick presets and field-based rule editing instead of a plain text box.
- When product teams need configurable scheduling templates such as hourly, daily, or monthly jobs.
- When users should verify the rule through readable summary text and preview items after editing.

## Examples

<demo-group>
  <demo src="./demo/basic.vue">Basic</demo>
  <demo src="./demo/presets.vue">Presets</demo>
  <demo src="./demo/controlled.vue">Controlled open state</demo>
  <demo src="./demo/no-presets.vue">Without presets</demo>
</demo-group>

## API

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| value | Current Quartz 7-field expression | `string` | - |
| defaultValue | Default Quartz 7-field expression | `string` | `'0 0 * * * ? *'` |
| open | Whether the popup is open | `boolean` | - |
| defaultOpen | Initial popup state | `boolean` | `false` |
| placeholder | Input placeholder | `string` | `'请输入 Quartz 表达式'` |
| disabled | Whether the component is disabled | `boolean` | `false` |
| presets | Left-side quick preset list. Hidden when omitted. | `{ label: string; value: string; description?: string }[]` | - |
| previewCount | Number of preview items in the panel | `number` | `5` |
| getPopupContainer | Popup container getter | `(triggerNode?: HTMLElement) => HTMLElement` | - |

### Events

| Event | Description | Type |
| --- | --- | --- |
| update:value | Triggered when the Quartz expression changes | `(value: string) => void` |
| change | Triggered when the Quartz expression changes | `(value: string) => void` |
| update:open | Triggered when popup open state changes | `(open: boolean) => void` |
| openChange | Triggered when popup open state changes | `(open: boolean) => void` |

## Notes

- The main input parses on `blur` and `Enter`, so typing is not interrupted on every keystroke.
- The first version focuses on common Quartz 7-field editing and preset-driven workflows.
- Presets are fully provided by business code. The component does not inject a fixed preset list.
