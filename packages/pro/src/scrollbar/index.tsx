import type { ComponentBaseProps } from 'antdv-next/config-provider/context'
import type { App, CSSProperties, SlotsType } from 'vue'
import type { SemanticClassNamesType, SemanticStylesType } from '../_util/semantic'
import type { ScrollbarConfig, ScrollbarVisibility } from '../config-provider'
import { clsx } from '@v-c/util'
import { useBaseConfig } from 'antdv-next/config-provider/context'
import useCSSVarCls from 'antdv-next/config-provider/hooks/useCSSVarCls'
import { computed, defineComponent, shallowRef } from 'vue'
import { useMergeSemantic } from '../_util/semantic'
import { useProComponentConfig } from '../config-provider'
import { useScrollbarDrag } from './hooks/useScrollbarDrag'
import { useScrollbarState } from './hooks/useScrollbarState'
import useStyle from './style'

export type ScrollbarSemanticName = keyof ScrollbarSemanticClassNames & keyof ScrollbarSemanticStyles

export interface ScrollbarSemanticClassNames {
  root?: string
  container?: string
  track?: string
  trackX?: string
  trackY?: string
  thumb?: string
  thumbX?: string
  thumbY?: string
}

export interface ScrollbarSemanticStyles {
  root?: CSSProperties
  container?: CSSProperties
  track?: CSSProperties
  trackX?: CSSProperties
  trackY?: CSSProperties
  thumb?: CSSProperties
  thumbX?: CSSProperties
  thumbY?: CSSProperties
}

export type ScrollbarClassNamesType = SemanticClassNamesType<ScrollbarProps, ScrollbarSemanticClassNames>
export type ScrollbarStylesType = SemanticStylesType<ScrollbarProps, ScrollbarSemanticStyles>

export interface ScrollbarProps extends ComponentBaseProps {
  rootClass?: string
  visibility?: ScrollbarVisibility
  visibilityX?: ScrollbarVisibility
  visibilityY?: ScrollbarVisibility
  native?: boolean
  classes?: ScrollbarClassNamesType
  styles?: ScrollbarStylesType
}

export interface ScrollbarEmits {
  [key: string]: (...args: any[]) => void
}

export interface ScrollbarSlots {
  default?: () => any
}

const DEFAULT_VISIBILITY: ScrollbarVisibility = 'auto'

function omitClassAndStyle(attrs: Record<string, any>) {
  const nextAttrs = { ...attrs }
  delete nextAttrs.class
  delete nextAttrs.style
  return nextAttrs
}

const Scrollbar = defineComponent<
  ScrollbarProps,
  ScrollbarEmits,
  string,
  SlotsType<ScrollbarSlots>
>(
  (props, { slots, attrs }) => {
    const { prefixCls, direction } = useBaseConfig('scrollbar', props)
    const proConfig = useProComponentConfig('scrollbar')
    const containerRef = shallowRef<HTMLElement>()
    const rootCls = useCSSVarCls(prefixCls)
    const [hashId, cssVarCls] = useStyle(prefixCls, rootCls)

    const mergedVisibility = computed<ScrollbarVisibility>(() => {
      return props.visibility ?? proConfig.value.visibility ?? DEFAULT_VISIBILITY
    })

    const mergedVisibilityX = computed<ScrollbarVisibility>(() => {
      return props.visibilityX ?? proConfig.value.visibilityX ?? mergedVisibility.value
    })

    const mergedVisibilityY = computed<ScrollbarVisibility>(() => {
      return props.visibilityY ?? proConfig.value.visibilityY ?? mergedVisibility.value
    })

    const mergedNative = computed(() => {
      return props.native ?? proConfig.value.native ?? false
    })

    const mergedConfig = computed<ScrollbarConfig>(() => {
      return {
        ...proConfig.value,
        visibility: mergedVisibility.value,
        visibilityX: mergedVisibilityX.value,
        visibilityY: mergedVisibilityY.value,
        native: mergedNative.value,
      }
    })

    const [mergedClassNames, mergedStyles] = useMergeSemantic<
      ScrollbarSemanticClassNames,
      ScrollbarSemanticStyles,
      ScrollbarProps
    >(
      computed(() => [proConfig.value.classes as ScrollbarClassNamesType | undefined, props.classes]),
      computed(() => [proConfig.value.styles as ScrollbarStylesType | undefined, props.styles]),
      computed(() => ({
        props: {
          ...props,
          visibility: mergedVisibility.value,
          visibilityX: mergedVisibilityX.value,
          visibilityY: mergedVisibilityY.value,
          native: mergedNative.value,
        },
      })),
    )

    const mergedClassName = computed(() => {
      return clsx(
        prefixCls.value,
        hashId.value,
        cssVarCls.value,
        rootCls.value,
        {
          [`${prefixCls.value}-rtl`]: direction.value === 'rtl',
          [`${prefixCls.value}-native`]: mergedNative.value,
        },
        proConfig.value.class,
        props.rootClass,
        mergedClassNames.value.root,
        (attrs as any).class,
      )
    })

    const mergedStyle = computed(() => {
      return [
        mergedStyles.value.root,
        proConfig.value.style,
        (attrs as any).style,
      ]
    })

    const scrollbarState = useScrollbarState(
      containerRef,
      computed(() => mergedConfig.value.visibilityX),
      computed(() => mergedConfig.value.visibilityY),
    )
    const scrollbarDrag = useScrollbarDrag(
      containerRef,
      scrollbarState.metrics,
      scrollbarState.thumbSizeX,
      scrollbarState.thumbSizeY,
      scrollbarState.sync,
    )

    return () => (
      <div
        class={mergedClassName.value}
        style={mergedStyle.value}
        data-visibility={mergedVisibility.value}
        data-visibility-x={mergedVisibilityX.value}
        data-visibility-y={mergedVisibilityY.value}
        data-native={mergedNative.value ? '' : undefined}
        {...omitClassAndStyle(attrs as Record<string, any>)}
      >
        <div
          ref={containerRef}
          class={clsx(`${prefixCls.value}-container`, mergedClassNames.value.container)}
          style={mergedStyles.value.container}
          onScroll={scrollbarState.sync}
        >
          {slots.default?.()}
        </div>
        {!mergedNative.value && scrollbarState.showTrackY.value && (
          <div
            class={clsx(
              `${prefixCls.value}-track`,
              `${prefixCls.value}-track-y`,
              mergedClassNames.value.track,
              mergedClassNames.value.trackY,
            )}
            style={[mergedStyles.value.track, mergedStyles.value.trackY]}
          >
            <div
              class={clsx(
                `${prefixCls.value}-thumb`,
                `${prefixCls.value}-thumb-y`,
                mergedClassNames.value.thumb,
                mergedClassNames.value.thumbY,
              )}
              style={[
                mergedStyles.value.thumb,
                mergedStyles.value.thumbY,
                {
                  height: `${scrollbarState.thumbSizeY.value}px`,
                  transform: `translateY(${scrollbarState.thumbOffsetY.value}px)`,
                },
              ]}
              onMousedown={scrollbarDrag.onThumbMouseDownY}
            />
          </div>
        )}
        {!mergedNative.value && scrollbarState.showTrackX.value && (
          <div
            class={clsx(
              `${prefixCls.value}-track`,
              `${prefixCls.value}-track-x`,
              mergedClassNames.value.track,
              mergedClassNames.value.trackX,
            )}
            style={[mergedStyles.value.track, mergedStyles.value.trackX]}
          >
            <div
              class={clsx(
                `${prefixCls.value}-thumb`,
                `${prefixCls.value}-thumb-x`,
                mergedClassNames.value.thumb,
                mergedClassNames.value.thumbX,
              )}
              style={[
                mergedStyles.value.thumb,
                mergedStyles.value.thumbX,
                {
                  width: `${scrollbarState.thumbSizeX.value}px`,
                  transform: `translateX(${scrollbarState.thumbOffsetX.value}px)`,
                },
              ]}
              onMousedown={scrollbarDrag.onThumbMouseDownX}
            />
          </div>
        )}
      </div>
    )
  },
  {
    name: 'AScrollbar',
    inheritAttrs: false,
  },
)

;(Scrollbar as any).install = (app: App) => {
  app.component(Scrollbar.name, Scrollbar)
}

export type { ScrollbarConfig, ScrollbarVisibility }
export default Scrollbar
export { Scrollbar }
