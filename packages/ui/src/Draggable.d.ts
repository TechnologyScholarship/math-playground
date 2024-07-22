import { FunctionComponent, PropsWithChildren } from 'react'
import { GestureResponderEvent } from 'react-native'

export type DragEvent = Pick<
  GestureResponderEvent | React.DragEvent<HTMLDivElement>,
  keyof GestureResponderEvent & keyof React.DragEvent<HTMLDivElement>
> & {
  x: number
  y: number
}
export type DraggableProps = PropsWithChildren<{
  onDragStart?: (e: DragEvent) => void
  onDrag?: (e: DragEvent) => void
  onDragEnd?: (e: DragEvent) => void
}>
export const Draggable: FunctionComponent<DraggableProps>
