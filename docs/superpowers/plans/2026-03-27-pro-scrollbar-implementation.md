# Pro Scrollbar Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement the first `@antdv-next/pro` component, `Scrollbar`, with dual-axis support, configurable visibility, dragable thumbs, and a lightweight `ProConfigProvider` that inherits shared runtime behavior from `antdv-next`.

**Architecture:** `pro` will own a small provider layer for `pro`-specific component config while reusing `antdv-next` `ConfigProvider`, config hooks, token hooks, and style hooks. `Scrollbar` will keep native scrolling as the source of truth and render synchronized custom scrollbar overlays for horizontal and vertical axes.

**Tech Stack:** Vue 3 TSX, Vitest, `antdv-next` config-provider/theme runtime, `@antdv-next/cssinjs`

---

### File Structure

**New files**
- `packages/pro/src/config-provider/context.ts`
- `packages/pro/src/config-provider/define.ts`
- `packages/pro/src/config-provider/index.tsx`
- `packages/pro/src/scrollbar/hooks/useScrollbarState.ts`
- `packages/pro/src/scrollbar/hooks/useScrollbarDrag.ts`
- `packages/pro/src/scrollbar/style/token.ts`
- `packages/pro/src/components.ts`

**Modified files**
- `packages/antdv-next/package.json`
- `packages/pro/src/index.ts`
- `packages/pro/src/theme/interface/components.ts`
- `packages/pro/src/scrollbar/index.tsx`
- `packages/pro/src/scrollbar/style/index.ts`
- `packages/pro/src/scrollbar/tests/scrollbar.test.ts`

### Task 1: Expose the shared Antdv runtime needed by `pro`

**Files:**
- Modify: `packages/antdv-next/package.json`

- [ ] **Step 1: Add public subpath exports for the runtime pieces `pro` must consume**

Expose only the minimum stable subpaths needed by `pro`:

- `./config-provider`
- `./config-provider/context`
- `./config-provider/DisabledContext`
- `./config-provider/hooks/useSize`
- `./config-provider/hooks/useCSSVarCls`
- `./theme/internal`

These must point at existing `dist/...` outputs so published `@antdv-next/pro` can import them safely.

- [ ] **Step 2: Verify the export surface is sufficient before touching `pro`**

Run:
```bash
pnpm -F antdv-next build:esm
```

Expected:
- `packages/antdv-next/dist/config-provider/context.js` exists
- `packages/antdv-next/dist/theme/internal.js` exists
- no missing-file error from the export additions

### Task 2: Create the `pro` provider foundation

**Files:**
- Create: `packages/pro/src/config-provider/context.ts`
- Create: `packages/pro/src/config-provider/define.ts`
- Create: `packages/pro/src/config-provider/index.tsx`
- Modify: `packages/pro/src/index.ts`
- Modify: `packages/pro/src/components.ts`

- [ ] **Step 1: Write the failing provider test cases inside the Scrollbar test file**

Add tests that prove:

- `ProConfigProvider` renders children
- `ProConfigProvider` passes shared props through to `antdv-next` `ConfigProvider`
- `ProConfigProvider` can provide `scrollbar` defaults
- component props override provider defaults

Use:
```tsx
<ProConfigProvider scrollbar={{ visibilityY: 'always' }}>
  <Scrollbar />
</ProConfigProvider>
```

- [ ] **Step 2: Run the targeted test file and verify it fails for the right reason**

Run:
```bash
pnpm -F @antdv-next/pro test -- src/scrollbar/tests/scrollbar.test.ts
```

Expected:
- FAIL because `ProConfigProvider` or the scrollbar config lookup is not implemented yet

- [ ] **Step 3: Add provider type definitions**

Create `packages/pro/src/config-provider/define.ts` with:

- `ScrollbarConfig`
- `ProConfigProviderProps`
- `ProConfigProviderSlots`
- `ProConfigProviderEmits`

Keep v1 small:

- shared pass-through props
- `scrollbar?: ScrollbarConfig`

- [ ] **Step 4: Add the `pro` context contract**

Create `packages/pro/src/config-provider/context.ts` with:

- injection key
- `useProConfigProvider`
- `useProConfig`
- `useProComponentConfig('scrollbar')`

Return computed defaults similar to `antdv-next` `useComponentConfig`, but scoped only to `pro`.

- [ ] **Step 5: Implement `ProConfigProvider`**

Create `packages/pro/src/config-provider/index.tsx`:

- define `AProConfigProvider`
- provide `ProConfigContext`
- render `antdv-next` `ConfigProvider` around slots
- pass through the shared props directly
- attach `install`

- [ ] **Step 6: Export the provider from the package entry**

Update:

- `packages/pro/src/components.ts`
- `packages/pro/src/index.ts`

So that `ProConfigProvider` and `Scrollbar` become package exports.

- [ ] **Step 7: Re-run the targeted test file**

Run:
```bash
pnpm -F @antdv-next/pro test -- src/scrollbar/tests/scrollbar.test.ts
```

Expected:
- provider-specific tests now pass
- remaining scrollbar behavior tests still fail

### Task 3: Implement the Scrollbar component shell

**Files:**
- Modify: `packages/pro/src/scrollbar/index.tsx`
- Modify: `packages/pro/src/scrollbar/tests/scrollbar.test.ts`
- Modify: `packages/pro/src/components.ts`
- Modify: `packages/pro/src/index.ts`

- [ ] **Step 1: Expand the test file with shell-level behavior tests**

Add failing tests for:

- slot content renders
- component installs as `AScrollbar`
- `native=true` skips custom overlay
- `visibility`, `visibilityX`, `visibilityY` resolve correctly
- attrs class/style merge with provider and component config

- [ ] **Step 2: Run the test file and verify the new cases fail correctly**

Run:
```bash
pnpm -F @antdv-next/pro test -- src/scrollbar/tests/scrollbar.test.ts
```

Expected:
- FAIL because the component still only renders placeholder markup

- [ ] **Step 3: Replace the placeholder component with the real shell**

Implement `packages/pro/src/scrollbar/index.tsx` using the repo’s standard component pattern:

- `defineComponent<Props, Emits, string, SlotsType<Slots>>`
- `useComponentBaseConfig('scrollbar', props, [], 'scrollbar')`
- `useProComponentConfig('scrollbar')`
- `getAttrStyleAndClass(attrs)`
- `useMergeSemantic(...)`

Render:

- root wrapper
- native scroll container
- default slot
- conditional horizontal track/thumb
- conditional vertical track/thumb

- [ ] **Step 4: Export the component properly**

Attach:

```ts
;(Scrollbar as any).install = (app: App) => {
  app.component(Scrollbar.name, Scrollbar)
}
```

- [ ] **Step 5: Re-run the targeted test file**

Run:
```bash
pnpm -F @antdv-next/pro test -- src/scrollbar/tests/scrollbar.test.ts
```

Expected:
- shell-level tests pass
- overflow and drag tests still fail

### Task 4: Implement scroll metrics and axis visibility

**Files:**
- Create: `packages/pro/src/scrollbar/hooks/useScrollbarState.ts`
- Modify: `packages/pro/src/scrollbar/index.tsx`
- Modify: `packages/pro/src/scrollbar/tests/scrollbar.test.ts`

- [ ] **Step 1: Add failing overflow/visibility tests**

Use stubs for the scroll container element metrics:

- `scrollWidth`
- `clientWidth`
- `scrollLeft`
- `scrollHeight`
- `clientHeight`
- `scrollTop`

Add tests for:

- horizontal track shows when X overflows and strategy allows it
- vertical track shows when Y overflows and strategy allows it
- `hidden` suppresses the axis
- `always` keeps the axis visible in custom mode

- [ ] **Step 2: Run the targeted test file and verify overflow tests fail**

Run:
```bash
pnpm -F @antdv-next/pro test -- src/scrollbar/tests/scrollbar.test.ts
```

Expected:
- FAIL because the component does not yet compute axis metrics

- [ ] **Step 3: Implement scroll state derivation**

Create `useScrollbarState.ts` to compute:

- `canScrollX`
- `canScrollY`
- `thumbWidth`
- `thumbHeight`
- `thumbOffsetX`
- `thumbOffsetY`
- resolved per-axis visibility mode

The source of truth must remain the native scroll container.

- [ ] **Step 4: Wire the computed state into the component render**

Update `packages/pro/src/scrollbar/index.tsx` to:

- keep a container ref
- recalculate metrics on mount and scroll
- render axis overlays from computed state

- [ ] **Step 5: Re-run the targeted test file**

Run:
```bash
pnpm -F @antdv-next/pro test -- src/scrollbar/tests/scrollbar.test.ts
```

Expected:
- overflow and visibility tests pass
- drag tests still fail

### Task 5: Implement thumb dragging

**Files:**
- Create: `packages/pro/src/scrollbar/hooks/useScrollbarDrag.ts`
- Modify: `packages/pro/src/scrollbar/index.tsx`
- Modify: `packages/pro/src/scrollbar/tests/scrollbar.test.ts`

- [ ] **Step 1: Add failing drag tests**

Add tests for:

- dragging vertical thumb updates `scrollTop`
- dragging horizontal thumb updates `scrollLeft`

The tests should simulate:

- pointer down on thumb
- pointer move on document
- pointer up cleanup

- [ ] **Step 2: Run the targeted test file and verify drag tests fail**

Run:
```bash
pnpm -F @antdv-next/pro test -- src/scrollbar/tests/scrollbar.test.ts
```

Expected:
- FAIL because drag handlers are not implemented

- [ ] **Step 3: Implement per-axis drag logic**

Create `useScrollbarDrag.ts` to:

- capture drag start position
- capture initial scroll offset
- calculate content scroll delta from thumb drag delta
- attach/remove document-level move/up listeners

- [ ] **Step 4: Wire drag handlers to the component**

Update the component so each thumb:

- sets dragging state on pointer down
- updates the native container scroll position
- clears dragging state on pointer up

- [ ] **Step 5: Re-run the targeted test file**

Run:
```bash
pnpm -F @antdv-next/pro test -- src/scrollbar/tests/scrollbar.test.ts
```

Expected:
- drag tests pass

### Task 6: Add tokenized styles

**Files:**
- Create: `packages/pro/src/scrollbar/style/token.ts`
- Modify: `packages/pro/src/theme/interface/components.ts`
- Modify: `packages/pro/src/scrollbar/style/index.ts`
- Modify: `packages/pro/src/scrollbar/index.tsx`

- [ ] **Step 1: Add the failing style expectations**

Add tests that assert:

- custom tracks/thumbs receive `prefixCls`-based classes
- root gets merged `hashId` and `cssVarCls`
- provider/component semantic classes land on the expected slots

- [ ] **Step 2: Run the targeted test file and verify style assertions fail**

Run:
```bash
pnpm -F @antdv-next/pro test -- src/scrollbar/tests/scrollbar.test.ts
```

Expected:
- FAIL because styles are still unimplemented

- [ ] **Step 3: Define the component token shape**

Create `packages/pro/src/scrollbar/style/token.ts` with the minimum v1 token contract:

- track bg
- thumb bg
- thumb hover bg
- thumb active bg
- thickness
- radius
- inset spacing

- [ ] **Step 4: Register the token in the `pro` component token map**

Update `packages/pro/src/theme/interface/components.ts`:

```ts
export interface ComponentTokenMap {
  Scrollbar: import('../../scrollbar/style').ComponentToken
}
```

- [ ] **Step 5: Implement the style hook**

Update `packages/pro/src/scrollbar/style/index.ts` to use:

```ts
import { genStyleHooks, mergeToken } from 'antdv-next/theme/internal'
```

Generate styles for:

- root
- container
- track
- thumb
- x-axis
- y-axis
- dragging
- hidden/native states

- [ ] **Step 6: Use the style hook in the component**

Update `packages/pro/src/scrollbar/index.tsx` to call the new `useStyle(prefixCls, rootCls)` and merge the returned `hashId` and `cssVarCls` into the root classes.

- [ ] **Step 7: Re-run the targeted test file**

Run:
```bash
pnpm -F @antdv-next/pro test -- src/scrollbar/tests/scrollbar.test.ts
```

Expected:
- all targeted scrollbar tests pass

### Task 7: Full package verification

**Files:**
- No new code expected unless verification fails

- [ ] **Step 1: Run package typecheck**

Run:
```bash
pnpm -F @antdv-next/pro typecheck
```

Expected:
- PASS with exit code `0`

- [ ] **Step 2: Run the full `pro` test suite**

Run:
```bash
pnpm -F @antdv-next/pro test
```

Expected:
- PASS with exit code `0`

- [ ] **Step 3: Run the `pro` build**

Run:
```bash
pnpm -F @antdv-next/pro build
```

Expected:
- PASS with exit code `0`
- `packages/pro/dist/index.js` and `packages/pro/dist/index.d.ts` are generated

- [ ] **Step 4: Smoke-check the published entry surface**

Confirm package entry exports include:

- `Scrollbar`
- `ProConfigProvider`

by reviewing:

- `packages/pro/dist/index.js`
- `packages/pro/dist/index.d.ts`
