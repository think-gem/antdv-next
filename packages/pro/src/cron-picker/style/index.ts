import type { CSSObject } from '@antdv-next/cssinjs'
import type { FullToken, GenerateStyle } from 'antdv-next/theme/internal'
import { genStyleHooks } from 'antdv-next/theme/internal'
import { prepareComponentToken } from './token'

export type { ComponentToken } from './token'

interface CronPickerToken extends FullToken<'CronPicker'> {
  borderColor: string
  mutedColor: string
  activeBg: string
  activeColor: string
  codeBg: string
  previewBg: string
}

const genCronPickerStyle: GenerateStyle<CronPickerToken, CSSObject> = (token) => {
  const {
    componentCls,
    colorText,
    colorTextHeading,
    colorPrimary,
    borderColor,
    mutedColor,
    activeBg,
    activeColor,
    codeBg,
    previewBg,
    paddingXXS,
    paddingXS,
    paddingSM,
    marginXXS,
    marginXS,
    marginSM,
    fontSizeSM,
  } = token

  return {
    [componentCls]: {
      width: '100%',
      boxSizing: 'border-box',

      [`&-input`]: {
        width: '100%',
      },

      [`&-suffix`]: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: marginXS,
        color: mutedColor,
      },

      [`&-suffix-icon`]: {
        display: 'inline-flex',
        alignItems: 'center',
        color: mutedColor,
        fontSize: token.fontSizeIcon,
      },

      [`&-arrow`]: {
        fontSize: fontSizeSM,
        transition: `transform ${token.motionDurationMid} ${token.motionEaseInOut}`,
      },

      '&-open': {
        [`${componentCls}-arrow`]: {
          transform: 'rotate(180deg)',
        },
      },

      [`&-presets`]: {
        width: 168,
        flexShrink: 0,
        padding: paddingXS,
        borderRight: `1px solid ${borderColor}`,
      },

      [`&-preset-list`]: {
        display: 'grid',
        gap: marginXXS,
      },

      [`&-preset`]: {
        width: '100%',
        display: 'grid',
        gap: marginXXS,
        padding: `${paddingXS}px ${paddingSM}px`,
        border: `1px solid ${borderColor}`,
        borderRadius: token.borderRadiusSM,
        background: token.colorBgContainer,
        color: colorText,
        cursor: 'pointer',
        textAlign: 'left',
        transition: `all ${token.motionDurationMid} ${token.motionEaseInOut}`,

        '&:hover': {
          borderColor: token.colorPrimaryBorder,
          background: token.colorFillAlter,
        },

        '> div:first-child': {
          color: colorTextHeading,
          fontWeight: token.fontWeightStrong,
        },

        '> div:last-child': {
          color: mutedColor,
          fontSize: fontSizeSM,
        },

        '&-active': {
          borderColor: colorPrimary,
          background: activeBg,
          color: activeColor,
        },
      },

      [`&-popup`]: {
        display: 'flex',
        minWidth: 560,
      },

      [`&-panel`]: {
        display: 'grid',
        gap: marginXS,
        flex: 1,
        minWidth: 0,
        padding: paddingSM,
      },

      [`&-header`]: {
        display: 'grid',
        gap: marginXXS,
      },

      [`&-summary`]: {
        color: colorTextHeading,
        fontWeight: token.fontWeightStrong,
        fontSize: token.fontSize,
        lineHeight: token.lineHeight,
      },

      [`&-segment`]: {
        display: 'grid',
        gap: marginXS,

        '.ant-select, .ant-input-number, .ant-input-affix-wrapper, .ant-input': {
          width: '100%',
        },
      },

      [`&-inline-field`]: {
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 1fr) auto minmax(0, 1fr)',
        alignItems: 'center',
        gap: marginXS,
        color: mutedColor,
        fontSize: fontSizeSM,
      },

      [`&-meta`]: {
        color: mutedColor,
        fontSize: fontSizeSM,
      },

      [`&-error`]: {
        color: token.colorError,
        fontSize: fontSizeSM,
      },

      [`&-code`]: {
        padding: `${paddingXXS}px ${paddingXS}px`,
        borderRadius: token.borderRadiusSM,
        background: codeBg,
        color: colorPrimary,
        fontFamily: token.fontFamilyCode,
        fontSize: fontSizeSM,
      },

      [`&-fields`]: {
        display: 'grid',
        gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
        gap: marginSM,
      },

      [`&-field`]: {
        display: 'grid',
        gap: marginXXS,

        'label': {
          color: mutedColor,
          fontSize: fontSizeSM,
        },
      },

      [`&-preview`]: {
        display: 'grid',
        gap: marginXXS,
      },

      [`&-preview-item`]: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: marginSM,
        padding: `${paddingXS}px ${paddingSM}px`,
        borderRadius: token.borderRadiusSM,
        background: previewBg,

        '> div:first-child': {
          color: colorTextHeading,
        },

        '> div:last-child': {
          color: mutedColor,
          fontSize: fontSizeSM,
          textAlign: 'right',
        },
      },

      [`&-actions`]: {
        display: 'flex',
        justifyContent: 'flex-end',
        gap: marginXS,
        marginTop: marginXXS,
      },

      [`${componentCls}-panel .ant-tabs-nav`]: {
        marginBottom: marginXS,
      },

      [`${componentCls}-panel .ant-tabs-tab`]: {
        paddingBlock: paddingXXS,
      },

      [`${componentCls}-panel .ant-tabs-content-holder`]: {
        minHeight: 88,
      },

      '@media (max-width: 767px)': {
        [`${componentCls}-popup`]: {
          minWidth: 0,
          width: 'min(100vw - 32px, 520px)',
          flexDirection: 'column',
        },

        [`${componentCls}-presets`]: {
          width: '100%',
          borderRight: 'none',
          borderBottom: `1px solid ${borderColor}`,
        },

        [`${componentCls}-fields`]: {
          gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
        },
      },
    },
  }
}

export default genStyleHooks('CronPicker', genCronPickerStyle, prepareComponentToken)
