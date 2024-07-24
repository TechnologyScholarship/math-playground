import { View, ViewProps, YStack } from '@t4/ui'
import React from 'react'

export type TooltipProps = {
  position?:
    | Exclude<`${'top' | 'center' | 'bottom'}-${'left' | 'center' | 'right'}`, 'center-center'>
    | ('top' | 'bottom' | 'left' | 'right')
} & Omit<ViewProps, 'position'>

export function Tooltip({ position = 'top-center', children, ...viewProps }: TooltipProps) {
  const hzAlign = position.includes('left')
    ? 'left'
    : position.includes('right')
    ? 'right'
    : 'center'
  const vAlign = position.includes('top')
    ? 'top'
    : position.includes('bottom')
    ? 'bottom'
    : 'center'
  return (
    <YStack
      position='absolute'
      width='100%'
      height='100%'
      zi={1}
      pointerEvents='none'
      ai={
        {
          left: 'flex-start',
          right: 'flex-end',
        }[hzAlign] ?? hzAlign
      }
      jc={
        {
          top: 'flex-start',
          bottom: 'flex-end',
        }[vAlign] ?? vAlign
      }
    >
      <View
        animation='bouncy'
        padding='$1'
        backgroundColor='$backgroundStrong'
        borderRadius='$1'
        {...viewProps}
        opacity={0}
        shadowColor='black'
        shadowOffset={{
          width: 5,
          height: 5
        }}
        shadowOpacity={0.8}
        shadowRadius={10}
        $group-action-hover={{
          opacity: 1,
          x:
            {
              left: '-100%',
              right: '100%',
            }[hzAlign] ?? 0,
          y:
            {
              top: '-100%',
              bottom: '100%',
            }[vAlign] ?? 0,
          ...(viewProps['$group-action-hover'] ?? {}),
        }}
      >
        {children}
      </View>
    </YStack>
  )
}
