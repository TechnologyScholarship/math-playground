import * as NativeDraggable from 'react-native-draggable'
import { GestureResponderEvent } from 'react-native'
import { DraggableProps } from './Draggable'
import React from 'react'
import { View, DragEvent } from '@t4/ui'

export function asIntermediate(e: GestureResponderEvent): DragEvent {
  return {
    x: e.nativeEvent.pageX,
    y: e.nativeEvent.pageY,
    ...e,
  }
}
export function Draggable(props: DraggableProps) {
  const dragging = React.useRef(false) // Spoof implementation of onDragStart
  return (
    <View group='dragging'>
      <NativeDraggable.default // TODO: remap event handler types
        onDrag={
          props.onDragStart
            ? (e) => {
                if (!dragging.current) {
                  dragging.current = true
                  props.onDragStart?.(asIntermediate(e))
                } else props.onDrag?.(asIntermediate(e))
              }
            : (e) => props.onDrag?.(asIntermediate(e))
        }
        onDragRelease={
          props.onDragStart
            ? (e) => {
                dragging.current = false
                props.onDragEnd?.(asIntermediate(e))
              }
            : (e) => props.onDragEnd?.(asIntermediate(e))
        }
      >
        {props.children}
      </NativeDraggable.default>
    </View>
  )
}
