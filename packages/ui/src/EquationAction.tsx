import { XStack, XStackProps, Draggable } from '@t4/ui'
import React from 'react'

export type EquationTransformer = (latex: string) => string
export type EquationDropHandler = (transformer: EquationTransformer) => void

export function EquationAction({
  children,
  listener,
  transformer,
  ...props
}: React.PropsWithChildren<
  XStackProps & {
    listener: ReturnType<typeof React.useRef<EquationDropHandler | undefined>>
    transformer: EquationTransformer
  }
>) {
  return (
    <Draggable
      onDragEnd={(e) => {
        listener.current?.(transformer)
      }}
    >
      <XStack group='action' paddingHorizontal='$6' paddingVertical='$4' ai='center' {...props}>
        {children}
      </XStack>
    </Draggable>
  )
}
