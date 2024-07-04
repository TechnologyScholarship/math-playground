'use client'
import dynamic from 'next/dynamic'

import { Text, TextProps, useTheme } from '@t4/ui'
import React from 'react'
import { EditableMathFieldProps } from 'react-mathquill'

const EditableMathField = dynamic(
  () => import('react-mathquill').then((mod) => mod.EditableMathField),
  { ssr: false }
)

export type MathQuillInputProps = Omit<
  EditableMathFieldProps,
  keyof Omit<React.HTMLProps<HTMLSpanElement>, 'onChange'>
> &
  TextProps

export const MathQuillInput: React.FunctionComponent<MathQuillInputProps> = ({
  onChange,
  latex,
  config,
  mathquillDidMount,
  ...textProps
}) => {
  const theme = useTheme()
  React.useEffect(() => {
    import('react-mathquill').then((mq) => mq.addStyles())
  }, [])
  return (
    <Text {...textProps}>
      <style
        dangerouslySetInnerHTML={{
          __html: `
        .mq-editable-field.mq-focused {
          background-color: ${theme.backgroundFocus.get()};
        }
        .mq-editable-field .mq-cursor {
          border-left-color: currentColor !important;
        }
      `,
        }}
      />
      <EditableMathField
        style={{
          paddingInline: '4px',
        }}
        config={{
          spaceBehavesLikeTab: true,
          restrictMismatchedBrackets: true,
          supSubsRequireOperand: true,
          charsThatBreakOutOfSupSub: '+-=<>',
          autoSubscriptNumerals: true,
          autoCommands: 'pi infinity theta sqrt sum int',
          maxDepth: 10,
          ...config,
        }}
        latex={latex || textProps.children}
        onChange={onChange}
        mathquillDidMount={mathquillDidMount}
      />
    </Text>
  )
}
