'use client'
import { SizableText, SizableTextProps } from '@t4/ui'
import dynamic from 'next/dynamic'

import React from 'react'
import { RawMathQuillTextProps } from './RawMathQuillText'
import { MathField } from 'react-mathquill'

const StaticMathField = dynamic(
  () => import('react-mathquill').then((mod) => mod.StaticMathField),
  { ssr: false }
)

export const RawMathQuillText: React.FunctionComponent<RawMathQuillTextProps> = (props) => {
  const { unselectable, children, _additionalRawChildren, mathquillDidMount, ...textProps } = props
  const [errored, setErrored] = React.useState(false)
  const childrenString =
    typeof children === 'string' ? children : children.map((x) => x ?? '').join('')
  const [mathField, setMathField] = React.useState<MathField>()

  React.useEffect(() => {
    import('react-mathquill').then((mq) => mq.addStyles())
  }, [])

  React.useLayoutEffect(() => {
    mathField?.reflow?.()
  }, [mathField])

  return (
    <SizableText unstyled color={errored ? 'red' : undefined} {...textProps}>
      <style
        dangerouslySetInnerHTML={{
          __html: `
      .mq-root-block, .mq-math-mode {
        overflow: visible !important;
      }
      .mq-paren {
        line-height: 1;
      }
      .mq-cursor {
        ${'' /* Prevents cursor causing reflow */}
        position: absolute;
      }
      `,
        }}
      />
      {errored ? (
        childrenString
      ) : (
        <StaticMathField
          style={
            unselectable
              ? {
                  cursor: 'inherit',
                }
              : undefined
          }
          mathquillDidMount={(math) => {
            setTimeout(() => {
              setMathField(math)
              // TODO: less jank plz
              if (math.el().querySelector(':scope .mq-selectable')?.textContent === '$$')
                setErrored(true)
              if (unselectable) {
                // Replace mq-root-block class with style-identical replica
                const root = math.el().querySelector(':scope .mq-root-block')
                root?.classList?.remove('mq-root-block')
                root?.classList?.add('mq-unselectable-root-block')
                // Remove MathQuill's mouse handlers
                ;(global as any).jQuery?.(math.el())?.off()
              }
              mathquillDidMount?.(math)
            }, 0)
          }}
        >
          {childrenString}
        </StaticMathField>
      )}
      {_additionalRawChildren ? _additionalRawChildren : null}
    </SizableText>
  )
}
