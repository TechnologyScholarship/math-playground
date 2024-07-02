'use client'
import { SizableText, SizableTextProps } from '@t4/ui'
import { MathQuillInput, MathQuillInputProps } from '@t4/ui/src/MathQuillInput'
import dynamic from 'next/dynamic'

import React, { ReactElement, useRef } from 'react'
import { MathField } from 'react-mathquill'

const StaticMathField = dynamic(
  () => import('react-mathquill').then((mod) => mod.StaticMathField),
  { ssr: false }
)

type MathQuillInputField = ReactElement

export const MathQuillText: React.FunctionComponent<
  SizableTextProps & { children: string | (string | MathQuillInputField)[]; unselectable?: boolean }
> = (props) => {
  React.useEffect(() => {
    import('react-mathquill').then((mq) => mq.addStyles())
  }, [])
  const embedded: React.MutableRefObject<MathQuillInputField[]> = useRef([])
  const [latex, setLatex] = React.useState('')
  // biome-ignore lint/correctness/useExhaustiveDependencies: latex write-only
  React.useEffect(() => {
    let l = ''
    embedded.current = []
    const children: (MathQuillInputField | string)[] =
      typeof props.children === 'string' ? [props.children] : props.children
    for (const e of children) {
      if (typeof e === 'string') {
        l += e
      } else {
        const embedProps: MathQuillInputProps = e.props
        l += `\\MathQuillMathField{${embedProps.latex || embedProps.children}}`
        embedded.current.push(e)
      }
    }
    setLatex(l)
  }, [props.children])
  return (
    <SizableText unstyled {...props}>
      <StaticMathField
        style={
          props.unselectable
            ? {
                cursor: 'inherit',
              }
            : undefined
        }
        onMouseDownCapture={props.unselectable ? (e) => e.stopPropagation() : undefined}
        mathquillDidMount={(math) => {
          // react-mathquill doesnt yet support innerFields
          const innerFields: MathField[] = (math as any).innerFields
          for (let i = 0; i < innerFields.length; i++) {
            const field = innerFields[i]
            const embed = embedded.current[i]
            const embedProps: MathQuillInputProps = embed.props
            if (embedProps.config || embedProps.onChange)
              field.config({
                ...embedProps.config,
                handlers: {
                  ...embedProps.config?.handlers,
                  edit(mathField) {
                    if (embedProps.config?.handlers?.edit)
                      embedProps.config.handlers.edit(mathField)
                    if (embedProps.onChange) embedProps.onChange(mathField)
                  },
                },
              })
            if (embedProps.mathquillDidMount) embedProps.mathquillDidMount(field)
          }
        }}
      >
        {latex}
      </StaticMathField>
    </SizableText>
  )
}
