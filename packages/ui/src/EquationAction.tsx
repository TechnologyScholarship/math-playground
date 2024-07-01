import { XStack, SizableText, SizableTextProps, Draggable } from '@t4/ui'

export function EquationAction(props: SizableTextProps) {
  return (
    <Draggable onDrag={console.log}>
      <SizableText {...props}>
        <XStack group='action' paddingHorizontal='$6' ai='center'>
          {props.children}
        </XStack>
      </SizableText>
    </Draggable>
  )
}
