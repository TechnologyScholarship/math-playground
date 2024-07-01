import { Button, Circle, View } from '@t4/ui'
import { ChevronUp, ChevronDown } from '@tamagui/lucide-icons'
import React from 'react'
import { MathQuillInput } from './MathQuillInput'
import { ScrollOver } from './ScrollOver'
import { Platform } from 'react-native'
import { getToken, XStack, YStack } from 'tamagui'

export function MathTermInput(props) {
  const [expression, setExpression] = React.useState<string>(props.children)
  const shiftExpression = delta => {
    const value = parseFloat(expression.trim() || '0');
    setExpression(
      (expression.trim() || '0').replace(
        /^[+-]?[0-9_]+(\.[0-9]+)?/g,
        (value + delta).toString()
      )
    );
  };
  return (
    <ScrollOver
      onMouseWheel={(e) => {
        const offset =
          Math.ceil(Math.abs(e.deltaY / (e.deltaMode === 0 ? 100 : 1))) * Math.sign(e.deltaY)
        shiftExpression(-offset)
      }}
    >
      <YStack rowGap='$1' jc='center' ai='center'>
        {Platform.OS === 'web' ? (
          <style
            dangerouslySetInnerHTML={{
              __html: `
                .draggable-dragging .dragging-display-none {
                  transition: none !important;
                  visibility: hidden;
                }`,
            }}
          />
        ) : null}
        <XStack width='100%' height='100%' position='absolute' ai='center' jc='center' zIndex={-1}>
          <Circle
            animation='bouncy'
            aspectRatio={1}
            height='100%'
            backgroundColor='$backgroundTransparent'
            scale={0}
            $group-action-hover={{
              scale: 1,
              backgroundColor: '$backgroundHover',
            }}
            $group-dragging-active={{
              display: 'none'
            }}
          />
        </XStack>
        <Button
          animation='bouncy'
          size='$1'
          $pointerCoarse={{ size: '$2' }}
          y='100%'
          opacity={0}
          $group-action-hover={{
            opacity: 1,
            y: 0,
          }}
          $group-dragging-active={{
            display: 'none'
          }}
          className='dragging-display-none'
          chromeless
          hitSlop={{ top: 10, left: 5, right: 5 }}
          icon={ChevronUp}
          onPress={() => shiftExpression(1)}
        />
        <MathQuillInput
          f={1}
          fb={0}
          onChange={(math) => {
            setExpression(math.latex())
          }}
          latex={expression}
          {...props}
        />
        <Button
          animation='bouncy'
          size='$1'
          $pointerCoarse={{ size: '$2' }}
          y='-100%'
          opacity={0}
          $group-action-hover={{
            opacity: 1,
            y: 0,
          }}
          $group-dragging-active={{
            display: 'none'
          }}
          className='dragging-display-none'
          chromeless
          hitSlop={{ bottom: 10, left: 5, right: 5 }}
          icon={ChevronDown}
          onPress={() => shiftExpression(-1)}
        />
      </YStack>
    </ScrollOver>
  )
}
