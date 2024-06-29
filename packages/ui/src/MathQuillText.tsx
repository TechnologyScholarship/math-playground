'use client'
import { SizableText, SizableTextProps } from '@t4/ui'
import dynamic from 'next/dynamic'

import React from 'react'

const StaticMathField = dynamic(
  () => import('react-mathquill').then((mod) => mod.StaticMathField),
  { ssr: false }
)

export const MathQuillText: React.FunctionComponent<SizableTextProps & { unselectable?: boolean }> =
  (props) => {
    React.useEffect(() => {
      import('react-mathquill').then((mq) => mq.addStyles())
    }, [])
    return (
      <StaticMathField
        style={
          props.unselectable
            ? {
                cursor: 'inherit',
              }
            : undefined
        }
        onMouseDownCapture={props.unselectable ? (e) => e.stopPropagation() : undefined}
      >
        {props.children}
      </StaticMathField>
    )
  }
