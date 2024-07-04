import { XStack, SizableText, SizableTextProps, Draggable } from '@t4/ui'
import React from 'react'

export function EquationAction({ children, ...innerProps }: SizableTextProps) {
  return (
    <Draggable onDrag={console.log}>
      <XStack group='action' paddingHorizontal='$6' paddingVertical='$4' ai='center'>
        {React.Children.map(children, (c) => {
          return React.cloneElement(c, innerProps)
        })}
      </XStack>
    </Draggable>
  )
}
