'use client'
import dynamic from 'next/dynamic'

import { Text, useTheme, MathQuillInputProps } from '@t4/ui'
import React from 'react'
import { MATHQUILL_MAX_DEPTH } from './constants'

const EditableMathField = dynamic(
  () => import('react-mathquill').then((mod) => mod.EditableMathField),
  { ssr: false }
)

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
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `
        .mq-editable-field.mq-focused {
          background-color: ${theme.backgroundFocus.get()};
        }
        .mq-editable-field .mq-cursor {
          border-left-color: currentColor !important;
        }
        .math-editable-field-container:has(.mq-focused) {
          border-color: ${theme.borderColorFocus.get()};
        }
      `,
        }}
      />
      <Text
        borderStyle='solid'
        borderWidth={1}
        borderColor='$borderColor'
        hoverStyle={{
          borderColor: '$borderColorHover',
        }}
        focusStyle={{
          borderColor: '$borderColorFocus',
        }}
        className='math-editable-field-container'
        {...textProps}
      >
        <EditableMathField
          style={{
            paddingInline: '4px',
            border: 'none',
          }}
          config={{
            spaceBehavesLikeTab: true,
            restrictMismatchedBrackets: true,
            supSubsRequireOperand: true,
            charsThatBreakOutOfSupSub: '+-=<>',
            autoSubscriptNumerals: true,
            autoCommands: 'pi infinity theta sqrt sum int',
            maxDepth: MATHQUILL_MAX_DEPTH,
            ...config,
          }}
          latex={latex || textProps.children}
          onChange={onChange}
          mathquillDidMount={mathquillDidMount}
        />
      </Text>
    </>
  )
}
