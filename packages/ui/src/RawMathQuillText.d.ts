import { SizableTextProps } from '@t4/ui'
import React from 'react'
import { StaticMathFieldProps } from 'react-mathquill'

export type RawMathQuillTextProps = Omit<SizableTextProps, 'children'> & {
  unselectable?: boolean
  children: string | (string | null | undefined)[]
  _additionalRawChildren?: React.ReactNode
} & Pick<StaticMathFieldProps, 'mathquillDidMount'>

export const RawMathQuillText: React.FunctionComponent<RawMathQuillTextProps>
