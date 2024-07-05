import React from 'react'
import { DraggableProps } from './Draggable'
import { View, DragEvent } from '@t4/ui';

export function asIntermediate(e: React.DragEvent<HTMLDivElement>): DragEvent {
  return {
    x: e.pageX,
    y: e.pageY,
    ...e
  };
}

export function Draggable(props: DraggableProps) {
  return (
    <View group='dragging'>
      <div
        draggable
        style={{ userSelect: 'none', cursor: 'grab' }}
        onDrag={props.onDrag ? e => props.onDrag?.(asIntermediate(e)) : undefined}
        onDragStart={(e) => {
          /* for any web-specific styling */
          (e.target as HTMLDivElement).classList.add('draggable-dragging');
          props.onDragStart?.(asIntermediate(e))
        }}
        onDragEnd={(e) => {
          (e.target as HTMLDivElement).classList.remove('draggable-dragging');
          props.onDragEnd?.(asIntermediate(e))
        }}
      >
        {props.children}
      </div>
    </View>
  )
}
