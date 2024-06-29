import { Button, ButtonProps, SizableText, SizableTextProps } from '@t4/ui'
import React from 'react'
import { MathQuillText } from './MathQuillText'
import { Undo2 } from '@tamagui/lucide-icons'

export interface EquationRowProps extends SizableTextProps {
  onRemove?: ButtonProps['onPress']
}

export const EquationRow: React.FunctionComponent<EquationRowProps> = (props) => {
  const [lhs, rhs]: [string, string] =
    typeof props.children == 'string'
      ? props.children.split('=')
      : props.children.length < 2
      ? props.children[0].split('=')
      : props.children
  return (
    <SizableText {...props}>
      <MathQuillText>{lhs.trim()}</MathQuillText>
      <MathQuillText>=</MathQuillText>
      <MathQuillText>{rhs.trim()}</MathQuillText>
      {props.onRemove ? <Button size='$2' icon={Undo2} onPress={props.onRemove} /> : null}
    </SizableText>
  )
}
