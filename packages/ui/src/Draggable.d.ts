import React from 'react'
import { NativeDraggableProps } from './Draggable.native'

export interface DragEvent {}
export type DraggableProps = React.PropsWithChildren<{
  onDragStart?: (e: DragEvent) => void
  onDrag?: (e: DragEvent) => void
  onDragEnd?: (e: DragEvent) => void
}>
export const Draggable: React.FunctionComponent<DraggableProps>
