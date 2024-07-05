export const MATHQUILL_NULL_TOKEN: string

export type MathQuillTextProps = Omit<SizableTextProps, 'children'> &
  React.PropsWithChildren<{
    unselectable?: boolean
  }>
export const MathQuillText: React.FunctionComponent<MathQuillTextProps>
