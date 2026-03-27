# Pro Scrollbar Design

## Goal

Build the first `@antdv-next/pro` component as `Scrollbar`, while establishing a reusable inheritance pattern for `pro` components:

- `pro` owns its own lightweight `ProConfigProvider`
- `ProConfigProvider` wraps and reuses `antdv-next` `ConfigProvider`
- `pro` components directly reuse `antdv-next` theme, token, style hooks, and base config hooks

The first version of `Scrollbar` must support:

- horizontal and vertical scrollbars
- per-axis visibility strategies: `auto`, `always`, `hidden`
- dragging scrollbar thumbs to scroll content

## Constraints

1. `pro` stays a separate package and a separate Vue plugin.
2. `pro` should reuse `antdv-next` theme/style runtime instead of creating a parallel token system.
3. `pro` should not try to register its component config into the existing `antdv-next` `ConfigProvider` component key space.
4. `ProConfigProvider` only exposes a focused subset of common config plus `pro`-specific config.
5. The first provider design is only required to support `Scrollbar`.

## Why Not Reuse `antdv-next` ConfigProvider Directly

`antdv-next` already provides the runtime pieces we want:

- `useComponentBaseConfig`
- `useBaseConfig`
- `useConfig`
- `useDisabledContext`
- `useSize`
- `useToken`
- `genStyleHooks`

However, its `ConfigProvider` component config contract is fixed to known component keys. That makes it a poor place to add `pro`-specific keys like `scrollbar` without expanding the upstream provider contract.

So the correct boundary is:

- common runtime stays shared with `antdv-next`
- `pro` component config is owned by `pro`

## Architecture

### 1. ProConfigProvider

`ProConfigProvider` will wrap `antdv-next` `ConfigProvider`.

It accepts a limited set of common props that can be passed through unchanged:

- `prefixCls`
- `iconPrefixCls`
- `direction`
- `theme`
- `componentSize`
- `componentDisabled`
- `getPopupContainer`
- `getTargetContainer`
- `csp`
- `renderEmpty`
- `virtual`
- `popupMatchSelectWidth`
- `popupOverflow`

It also accepts `pro`-specific config:

- `scrollbar`

Internally it does two things:

1. renders `antdv-next` `ConfigProvider` with the pass-through common props
2. provides a `ProConfigContext` containing the `pro`-specific component config

This gives `Scrollbar` access to both:

- shared Antdv runtime config
- local Pro component config

### 2. ProConfigContext

`ProConfigContext` is a focused provider owned by `pro`.

Initial shape:

- `scrollbar?: ScrollbarConfig`

Follow-up `pro` components can extend this context later without changing the upstream `antdv-next` provider contract.

### 3. Scrollbar Component

`Scrollbar` is implemented as:

- one root wrapper
- one scrollable native content container
- optional vertical scrollbar overlay
- optional horizontal scrollbar overlay

The actual content still scrolls through the native scroll container.
The custom scrollbar UI is a synchronized overlay that reflects and controls native scroll position.

This keeps browser scrolling behavior, accessibility baseline, wheel/trackpad support, and content layout predictable while still allowing custom tokenized visuals and drag interactions.

## Scrollbar Public API

### Props

First version should stay intentionally small:

- `prefixCls?: string`
- `rootClass?: string`
- `visibility?: 'auto' | 'always' | 'hidden'`
- `visibilityX?: 'auto' | 'always' | 'hidden'`
- `visibilityY?: 'auto' | 'always' | 'hidden'`
- `native?: boolean`
- `classes?: ScrollbarClassNamesType`
- `styles?: ScrollbarStylesType`

Behavior rules:

- `visibility` is the base default for both axes
- `visibilityX` overrides horizontal strategy
- `visibilityY` overrides vertical strategy
- `native=true` means skip custom overlay UI and use native scrolling only

### Slots

- `default`

### Emits

First version does not need custom emits.
Native scroll state is internal.

## ConfigProvider API For Scrollbar

`ProConfigProvider` should support:

- `scrollbar?: ScrollbarConfig`

`ScrollbarConfig` should only contain the options we want as provider defaults in v1:

- `visibility?: 'auto' | 'always' | 'hidden'`
- `visibilityX?: 'auto' | 'always' | 'hidden'`
- `visibilityY?: 'auto' | 'always' | 'hidden'`
- `native?: boolean`
- `class?: string`
- `style?: CSSProperties`
- `classes?: ScrollbarClassNames`
- `styles?: ScrollbarStyles`

At component level:

- component props override provider config
- provider config overrides internal defaults

## Runtime Integration With Antdv

`Scrollbar` should directly reuse `antdv-next` runtime helpers:

- `useComponentBaseConfig` for shared prefix and common config behavior
- `useToken` for token access
- `genStyleHooks` for style generation
- `useDisabledContext` and `useSize` only if later needed

This means the component will match the current Antdv theme, hashId, css var mode, and direction behavior automatically.

## Styling Strategy

`Scrollbar` styles should live in `packages/pro/src/scrollbar/style`.

The style entry should use `genStyleHooks` and a `Scrollbar` component token namespace.

Initial style coverage:

- root wrapper
- scroll container
- track
- thumb
- horizontal track/thumb
- vertical track/thumb
- dragging state
- hidden state

The token model should stay minimal for v1. Start with only the values needed to ship the component:

- track background
- thumb background
- thumb hover background
- thumb active background
- thickness
- border radius
- track inset spacing

## Interaction Model

### Native Scroll Sync

The content container owns the real scroll position.

The overlays derive:

- whether each axis is scrollable
- thumb size ratio
- thumb offset

from:

- `scrollWidth`, `clientWidth`, `scrollLeft`
- `scrollHeight`, `clientHeight`, `scrollTop`

### Visibility

For each axis:

- `hidden`: never render custom track/thumb
- `always`: render whenever custom mode is active
- `auto`: render only when content overflows on that axis

### Dragging

Dragging a thumb should:

1. capture pointer down on the thumb
2. track pointer movement on the document/window
3. convert drag delta into scroll delta using content-to-track ratio
4. update the native scroll container
5. clear dragging state on pointer up

Dragging must be per-axis and independent.

### Native Mode

When `native=true`:

- render the scroll container only
- skip custom tracks/thumbs and drag logic

This gives an escape hatch if consumers want pure native browser behavior.

## Testing Strategy

The first implementation should be test-first and cover behavior, not just snapshots.

Required tests:

1. renders slot content
2. installs as `AScrollbar`
3. uses provider defaults from `ProConfigProvider`
4. component props override provider defaults
5. horizontal custom scrollbar appears when horizontal overflow exists and strategy allows it
6. vertical custom scrollbar appears when vertical overflow exists and strategy allows it
7. `hidden` suppresses scrollbar UI
8. `always` keeps scrollbar UI rendered in custom mode
9. thumb drag updates `scrollTop`
10. thumb drag updates `scrollLeft`
11. `native=true` disables custom overlay UI
12. attrs `class` and `style` merge correctly with provider/component config

Because jsdom does not compute layout naturally, tests will need to stub scroll metrics on the container element.

## File Structure

Expected initial file layout:

- `packages/pro/src/config-provider/index.tsx`
- `packages/pro/src/config-provider/context.ts`
- `packages/pro/src/config-provider/define.ts`
- `packages/pro/src/scrollbar/index.tsx`
- `packages/pro/src/scrollbar/style/index.ts`
- `packages/pro/src/scrollbar/style/token.ts`
- `packages/pro/src/scrollbar/tests/scrollbar.test.ts`
- `packages/pro/src/components.ts`
- `packages/pro/src/index.ts`

Optional helper files if the component grows:

- `packages/pro/src/scrollbar/hooks/useScrollbarState.ts`
- `packages/pro/src/scrollbar/hooks/useScrollbarDrag.ts`

## Rollout Order

1. establish `pro` provider/context contract for `scrollbar`
2. expose `ProConfigProvider` and `Scrollbar` from package entry
3. add failing tests for provider inheritance and basic rendering
4. implement minimal custom overlay rendering
5. add failing drag tests
6. implement drag synchronization
7. add tokenized styles with `genStyleHooks`
8. verify `typecheck`, `test`, and `build`

## Non-Goals For V1

Do not include these in the first implementation:

- momentum or inertial drag behavior
- scrollbar corner resize handles
- keyboard arrow/page/home/end control API
- imperative public methods
- auto-hide animation polish
- RTL-specific special behavior beyond inherited direction compatibility
- provider support for any component except `scrollbar`

## Recommendation

Proceed with `Scrollbar` as the first `pro` component and use it to establish the shared pattern:

- `pro` owns component-level config context
- `antdv-next` continues to own shared theme/style/runtime context

This is the lowest-risk way to keep both packages aligned without forcing `pro` into `antdv-next`'s fixed `ConfigProvider` component contract.
