export interface ComponentToken {
  borderColor: string
  mutedColor: string
  activeBg: string
  activeColor: string
  codeBg: string
  previewBg: string
}

export function prepareComponentToken(token: any): ComponentToken {
  return {
    borderColor: token.colorBorderSecondary,
    mutedColor: token.colorTextDescription,
    activeBg: token.colorPrimaryBg,
    activeColor: token.colorPrimary,
    codeBg: token.colorFillQuaternary,
    previewBg: token.colorFillTertiary,
  }
}
