import { Button, Circle, View } from '@t4/ui'
import { ChevronUp, ChevronDown } from '@tamagui/lucide-icons'
import React from 'react'
import { MathQuillInput } from './MathQuillInput'
import { ScrollOver } from './ScrollOver'
import { Platform } from 'react-native'
import { XStack, YStack } from 'tamagui'

export function MathTermInput(props) {
  const [expression, setExpression] = React.useState<string>(props.children)
  return (
    <ScrollOver
      onMouseWheel={(e) => {
        const value = parseFloat(expression.trim() || '0')
        if (!Number.isNaN(value)) {
          const offset =
            Math.ceil(Math.abs(e.deltaY / (e.deltaMode === 0 ? 100 : 1))) * Math.sign(e.deltaY)
          setExpression(
            (expression.trim() || '0').replace(
              /^[+-]?[0-9_]+(\.[0-9]+)?/g,
              (value - offset).toString()
            )
          )
        }
      }}
    >
      <YStack rowGap='$1' jc='center' ai='center' className='math-term'>
        {Platform.OS === 'web' ? (
          <style
            dangerouslySetInnerHTML={{
              __html: `
            .math-term {
              container-type: normal;
            }
            .math-term button {
              opacity: 0;
              transition: opacity 0.3s ease-out;
            }
            .math-term:hover button {
              opacity: 1;
            }
            .draggable-dragging .math-term button {
              visibility: hidden;
            }
          `,
            }}
          />
        ) : null}
        <XStack width='100%' height='100%' position='absolute' ai='center' jc='center' zIndex={1}>
          <Circle aspectRatio={1} height={0}>
            <Circle
              animation='bouncy'
              aspectRatio={1}
              height='50%'
              backgroundColor='$backgroundTransparent'
              hoverStyle={{
                height: '100%',
                backgroundColor: '$backgroundHover',
              }}
            />
          </Circle>
        </XStack>
        <Button
          size='$1'
          $pointerCoarse={{ size: '$2' }}
          icon={ChevronUp}
          chromeless
          hitSlop={{ top: 10, left: 5, right: 5 }}
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
          size='$1'
          $pointerCoarse={{ size: '$2' }}
          icon={ChevronDown}
          chromeless
          hitSlop={{ bottom: 10, left: 5, right: 5 }}
        />
      </YStack>
    </ScrollOver>
  )
}
