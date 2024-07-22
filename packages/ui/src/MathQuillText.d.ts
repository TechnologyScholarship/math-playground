import { SizableTextProps } from '@t4/ui'

export const MATHQUILL_NULL_TOKEN: string

export type MathQuillTextProps = Omit<SizableTextProps, 'children'> &
  React.PropsWithChildren<{
    unselectable?: boolean
  }>
export const MathQuillText: React.FunctionComponent<MathQuillTextProps>
