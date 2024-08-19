import {
  Button,
  Circle,
  MathQuillInput,
  MathQuillInputProps,
  TamaguiElement,
  XStack,
  YStack,
} from '@t4/ui'
import { ChevronUp, ChevronDown } from '@tamagui/lucide-icons'
import React from 'react'
import { ScrollOver } from './ScrollOver'
import { Platform } from 'react-native'
import { ActionTermsContext } from './EquationAction'

export const MathTermInput = React.forwardRef<
  TamaguiElement,
  Omit<MathQuillInputProps, 'children' | 'latex'> & {
    children: string
    key?: string | number
  }
>(({ children, key = 0, ...props }, ref) => {
  const ctx = React.useContext(ActionTermsContext)
  const [expression, setExpression] = React.useState<string>(children)
  React.useEffect(() => {
    if (ctx) {
      ctx[key] = expression
    }
  }, [ctx, expression, key])

  const shiftExpression = (delta: number) => {
    const value = parseFloat(expression?.trim() || '0')
    setExpression(
      (expression?.trim() || '0').replace(/^[+-]?[0-9_]+(\.[0-9]+)?/g, (value + delta).toString())
    )
  }

  return (
    <ScrollOver
      onMouseWheel={(e: WheelEvent) => {
        e.stopPropagation()
        const offset =
          Math.ceil(Math.abs(e.deltaY / (e.deltaMode === 0 ? 100 : 1))) * Math.sign(e.deltaY)
        shiftExpression(-offset)
      }}
    >
      {Platform.OS === 'web' ? (
        <style
          dangerouslySetInnerHTML={{
            __html: `
                .draggable-dragging .dragging-display-none {
                  transition: none !important;
                  visibility: hidden;
                }
              `,
          }}
        />
      ) : null}
      <YStack
        ref={ref}
        rowGap='$1'
        jc='center'
        ai='center'
        display='inline-flex'
        verticalAlign='middle' // Not handled properly by tamagui???
        style={{ verticalAlign: 'middle' }}
      >
        <XStack width='100%' height='100%' position='absolute' ai='center' jc='center' zIndex={-1}>
          <Circle
            animation='bouncy'
            aspectRatio={1}
            height='100%'
            backgroundColor='$backgroundTransparent'
            outlineColor='$backgroundTransparent'
            outlineStyle='solid'
            outlineWidth='$size.1'
            $pointerCoarse={{ outlineWidth: '$size.2' }}
            scale={0}
            $group-action-hover={{
              scale: 1,
              backgroundColor: '$backgroundHover',
              outlineColor: '$backgroundHover',
            }}
            $group-dragging-active={{
              display: 'none',
            }}
          />
        </XStack>
        <YStack ai='center' jc='flex-end' pos='relative' width='100%'>
          <Button
            animation='bouncy'
            position='absolute'
            size='$1'
            $pointerCoarse={{ size: '$2' }}
            y='100%'
            opacity={0}
            $group-action-hover={{
              opacity: 1,
              y: 0,
            }}
            $group-dragging-active={{
              display: 'none',
            }}
            className='dragging-display-none'
            chromeless
            hitSlop={{ top: 10, left: 5, right: 5 }}
            icon={ChevronUp}
            onPress={() => shiftExpression(1)}
          />
        </YStack>
        <MathQuillInput
          zIndex={1}
          f={1}
          fb={0}
          {...props}
          onChange={(math) => {
            if (expression !== math.latex()) {
              setExpression(math.latex())
              if (props.onChange) props.onChange(math)
              // mathField?.reflow();
            }
          }}
          latex={expression || ' ' /* apparently non-empty string is more sensible default */}
        />
        <YStack ai='center' jc='flex-start' pos='relative' width='100%'>
          <Button
            animation='bouncy'
            position='absolute'
            size='$1'
            $pointerCoarse={{ size: '$2' }}
            y='-100%'
            opacity={0}
            $group-action-hover={{
              opacity: 1,
              y: 0,
            }}
            $group-dragging-active={{
              display: 'none',
            }}
            className='dragging-display-none'
            chromeless
            hitSlop={{ bottom: 10, left: 5, right: 5 }}
            icon={ChevronDown}
            onPress={() => shiftExpression(-1)}
          />
        </YStack>
      </YStack>
    </ScrollOver>
  )
})
