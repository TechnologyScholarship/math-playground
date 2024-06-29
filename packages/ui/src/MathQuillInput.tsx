'use client'
import dynamic from 'next/dynamic'

import { Text, TextProps } from '@t4/ui'
import { Property } from 'csstype'
import React from 'react'
import { EditableMathFieldProps } from 'react-mathquill'

const EditableMathField = dynamic(
  () => import('react-mathquill').then((mod) => mod.EditableMathField),
  { ssr: false }
)

export interface MathQuillInputProps
  extends Omit<EditableMathFieldProps, keyof Omit<React.HTMLProps<HTMLSpanElement>, 'onChange'>> {}
export const MathQuillInput: React.FunctionComponent<MathQuillInputProps & TextProps> = (props) => {
  React.useEffect(() => {
    import('react-mathquill').then((mq) => mq.addStyles())
    const style = document.createElement('style')
    // Hacky fix for cursor color
    style.innerText =
      '.mq-editable-field .mq-cursor { border-left-color: currentColor !important; }'
    const head = document.getElementsByTagName('head')[0]
    head.appendChild(style)
  }, [])
  return (
    <Text {...(props as TextProps)} unstyled={true}>
      <EditableMathField
        config={{
          spaceBehavesLikeTab: true,
          restrictMismatchedBrackets: true,
          supSubsRequireOperand: true,
          charsThatBreakOutOfSupSub: '+-=<>',
          autoSubscriptNumerals: true,
          autoCommands: 'pi theta sqrt sum int',
          maxDepth: 10,
        }}
        latex={props.latex || props.children}
        {...(props as MathQuillInputProps)}
      />
    </Text>
  )
}
