import { Dialog, Button, ButtonProps, Adapt, Sheet, XStack } from '@t4/ui'
import { Settings, X } from '@tamagui/lucide-icons'
import React from 'react'
import { MathQuillInput } from './MathQuillInput'
import { RawMathQuillText } from './RawMathQuillText'
import { MathField } from 'react-mathquill'

export function BaseEquationSelector({
  setExpression,
  base,
  ...props
}: {
  setExpression: (eq: { lhs: string; rhs: string }) => void
  base: { lhs: string; rhs: string }
} & ButtonProps) {
  const [leftExpr, setLeftExpr] = React.useState(base.lhs)
  const [rightExpr, setRightExpr] = React.useState(base.rhs)
  const rightField = React.useRef<MathField>()
  return (
    <Dialog modal>
      <Dialog.Trigger asChild>
        <Button icon={<Settings />} {...props}>
          Change Starting Equations
        </Button>
      </Dialog.Trigger>

      <Adapt when='sm' platform='touch'>
        <Sheet animation='bouncy' zIndex={200000} modal dismissOnSnapToBottom>
          <Sheet.Frame padding='$4' gap='$4'>
            <Adapt.Contents />
          </Sheet.Frame>
          <Sheet.Overlay animation='lazy' enterStyle={{ opacity: 0 }} exitStyle={{ opacity: 0 }} />
        </Sheet>
      </Adapt>

      <Dialog.Portal>
        <Dialog.Overlay
          key='overlay'
          animation='bouncy'
          opacity={0.5}
          enterStyle={{ opacity: 0 }}
          exitStyle={{ opacity: 0 }}
        />

        <Dialog.Content
          bordered
          elevate
          key='content'
          animateOnly={['transform', 'opacity']}
          animation='bouncy'
          enterStyle={{ x: 0, y: -20, opacity: 0, scale: 0.9 }}
          exitStyle={{ x: 0, y: 10, opacity: 0, scale: 0.95 }}
          gap='$4'
        >
          <Dialog.Title>Set Initial Equation</Dialog.Title>
          <Dialog.Description>
            Change the initial equation, from which you can work from to find a solution.
          </Dialog.Description>
          <XStack columnGap='$1' jc='center' ai='center'>
            <MathQuillInput
              onChange={(math) => {
                if (math.latex().includes('=')) {
                  const [pre, post] = math.latex().split('=', 2)
                  setLeftExpr(pre)
                  math.latex(pre)
                  rightField.current?.moveToLeftEnd()
                  rightField.current?.write(post)
                  rightField.current?.keystroke('Shift-End')
                  // rightField.current?.select()
                } else if (leftExpr !== math.latex()) {
                  setLeftExpr(math.latex())
                }
              }}
              latex={leftExpr || ' ' /* apparently non-empty string is more sensible default */}
            />
            <RawMathQuillText>=</RawMathQuillText>
            <MathQuillInput
              onChange={(math) => {
                if (rightExpr !== math.latex()) {
                  setRightExpr(math.latex())
                }
              }}
              mathquillDidMount={(math) => {
                rightField.current = math
              }}
              latex={rightExpr || ' ' /* apparently non-empty string is more sensible default */}
            />
          </XStack>

          <XStack alignSelf='flex-end' columnGap='$2'>
            <Dialog.Close displayWhenAdapted asChild>
              <Button size='$3' aria-label='Close'>
                Cancel
              </Button>
            </Dialog.Close>
            <Dialog.Close displayWhenAdapted asChild>
              <Button
                theme='blue'
                size='$3'
                aria-label='Close'
                onPress={(e) => setExpression({ lhs: leftExpr, rhs: rightExpr })}
              >
                Save changes
              </Button>
            </Dialog.Close>
          </XStack>

          <Dialog.Close asChild>
            <Button position='absolute' top='$3' right='$3' size='$2' icon={<X />} />
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog>
  )
}
