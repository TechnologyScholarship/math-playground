import { Button, ButtonProps, SizableText, SizableTextProps, View, ViewProps } from '@t4/ui';
import React from 'react'
import { MathQuillText } from './MathQuillText'
import { Undo2 } from '@tamagui/lucide-icons'

export interface EquationRowProps extends ViewProps {
  color?: SizableTextProps['color'];
  fontSize?: SizableTextProps['size']
  onRemove?: ButtonProps['onPress']
}

// export class EquationRow extends View {

// }
export const EquationRow: React.FunctionComponent<EquationRowProps> = (props) => {
  const [lhs, rhs]: [string, string] =
    typeof props.children === 'string'
      ? props.children.split('=')
      : props.children.length < 2
      ? props.children[0].split('=')
      : props.children
  return (
    <View {...props as ViewProps}>
      <MathQuillText size={props.fontSize} color={props.color}>{lhs.trim()}</MathQuillText>
      <MathQuillText size={props.fontSize} color={props.color}>=</MathQuillText>
      <MathQuillText size={props.fontSize} color={props.color}>{rhs.trim()}</MathQuillText>
      {props.onRemove ? <Button size='$2' icon={Undo2} onPress={props.onRemove} /> : null}
    </View>
  )
}
