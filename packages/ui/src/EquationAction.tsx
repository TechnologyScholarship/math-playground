import { XStack, XStackProps, Draggable } from '@t4/ui';
import React from 'react'

export function EquationAction({ children, ...props }: React.PropsWithChildren<XStackProps>) {
  return (
    <Draggable onDrag={console.log}>
      <XStack group='action' paddingHorizontal='$6' paddingVertical='$4' ai='center' {...props}>
        {children}
      </XStack>
    </Draggable>
  )
}
