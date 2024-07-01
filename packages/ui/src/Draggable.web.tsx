import React from 'react'
import { DraggableProps } from './Draggable'
import { View } from '@t4/ui';

export function Draggable(props: DraggableProps) {
  return (
    <View group='dragging'>
      <div
        draggable
        style={{ userSelect: 'none', cursor: 'grab' }}
        onDrag={props.onDrag}
        onDragStart={(e) => {
        /* for any web-specific styling */
          ; (e.target as HTMLDivElement).classList.add('draggable-dragging');
          if (props.onDragStart) props.onDragStart(e);
        }}
        onDragEnd={(e) => {
          ; (e.target as HTMLDivElement).classList.remove('draggable-dragging');
          if (props.onDragEnd) props.onDragEnd(e);
        }}
      >
        {props.children}
      </div>
    </View>
  )
}
