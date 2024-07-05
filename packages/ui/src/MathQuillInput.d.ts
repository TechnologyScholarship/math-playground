import { TextProps } from '@t4/ui'
import { EditableMathFieldProps } from 'react-mathquill'

export type MathQuillInputProps = Omit<
  EditableMathFieldProps,
  keyof Omit<React.HTMLProps<HTMLSpanElement>, 'onChange'>
> &
  TextProps

export const MathQuillInput: React.FunctionComponent<MathQuillInputProps>
