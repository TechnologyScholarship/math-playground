import { Button, ButtonProps, MathQuillText, MathQuillTextProps } from '@t4/ui'
import React from 'react'
import { Undo2 } from '@tamagui/lucide-icons'
import { MathSimplifyHelper } from './MathSimplifyHelper'

export type EquationRowProps = {
  children: string | [string, string]
  color?: MathQuillTextProps['color']
  fontSize?: MathQuillTextProps['size']
  onRemove?: ButtonProps['onPress']
  simplifyHandler?(latex: [string, string]): void
}

export const EquationRow: React.FunctionComponent<EquationRowProps> = (props) => {
  const [lhs, rhs]: [string, string] =
    typeof props.children === 'string'
      ? (props.children.split('=') as [string, string])
      : props.children
  return (
    <>
      {props.simplifyHandler ? (
        <MathSimplifyHelper
          latex={lhs}
          replaceHandler={(replacement) => props.simplifyHandler?.([replacement, rhs])}
          size={props.fontSize}
          color={props.color}
        />
      ) : (
        <MathQuillText size={props.fontSize} color={props.color}>
          {lhs}
        </MathQuillText>
      )}
      <MathQuillText size={props.fontSize} color={props.color}>
        =
      </MathQuillText>
      {props.simplifyHandler ? (
        <MathSimplifyHelper
          latex={rhs}
          replaceHandler={(replacement) => props.simplifyHandler?.([lhs, replacement])}
          size={props.fontSize}
          color={props.color}
        />
      ) : (
        <MathQuillText size={props.fontSize} color={props.color}>
          {rhs}
        </MathQuillText>
      )}
      {props.onRemove ? <Button size='$2' icon={Undo2} onPress={props.onRemove} /> : null}
    </>
  )
}
