import { XStack, SizableText, SizableTextProps, Draggable } from '@t4/ui'

export function EquationAction(props: SizableTextProps) {
  return (
    <Draggable onDrag={console.log}>
      <SizableText {...props}>
        <XStack ai='center'>{props.children}</XStack>
      </SizableText>
    </Draggable>
  )
}
