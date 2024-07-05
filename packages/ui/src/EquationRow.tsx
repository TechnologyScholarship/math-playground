import { Button, ButtonProps, MathQuillText, MathQuillTextProps } from '@t4/ui';
import React from 'react';
import { Undo2 } from '@tamagui/lucide-icons'
import { } from './MathQuillText';

export type EquationRowProps = {
  children: string | [string, string]
  color?: MathQuillTextProps['color'];
  fontSize?: MathQuillTextProps['size']
  onRemove?: ButtonProps['onPress']
}

export const EquationRow: React.FunctionComponent<EquationRowProps> = (props) => {
  const [lhs, rhs]: [string, string] =
    typeof props.children === 'string'
      ? (props.children.split('=') as [string, string])
      : props.children
  return (
    <>
      <MathQuillText size={props.fontSize} color={props.color}>
        {lhs.trim()}
      </MathQuillText>
      <MathQuillText size={props.fontSize} color={props.color}>
        =
      </MathQuillText>
      <MathQuillText size={props.fontSize} color={props.color}>
        {rhs.trim()}
      </MathQuillText>
      {props.onRemove ? <Button size='$2' icon={Undo2} onPress={props.onRemove} /> : null}
    </>
  )
}
