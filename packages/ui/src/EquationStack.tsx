import { XStack, YStack, Text } from '@t4/ui'
import React from 'react'

export function EquationStack(props) {
  return (
    <XStack f={1} jc='center'>
      <YStack fd='column-reverse' width='fit-content' rowGap='$2' ac='center' ai='flex-end'>
        {props.children}
      </YStack>
    </XStack>
  )
}
