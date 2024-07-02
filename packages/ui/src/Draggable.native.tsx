import * as NativeDraggable from 'react-native-draggable'
import { DraggableProps } from './Draggable'
import React from 'react'
import { View } from '@t4/ui'

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
                  ;(props.onDragStart || ((e) => {}))(e)
                } else if (props.onDrag) props.onDrag(e)
              }
            : props.onDrag
        }
        onDragRelease={
          props.onDragStart
            ? (e) => {
                dragging.current = false
                if (props.onDragEnd) props.onDragEnd(e)
              }
            : props.onDragEnd
        }
      >
        {props.children}
      </NativeDraggable.default>
    </View>
  )
}
