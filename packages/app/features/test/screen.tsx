import { XStack, YStack, ScrollView } from '@t4/ui'
import { EquationAction } from '@t4/ui/src/EquationAction'
import { EquationHistory } from '@t4/ui/src/EquationHistory'
import { MathQuillInput } from '@t4/ui/src/MathQuillInput'
import { MATHQUILL_NULL_TOKEN, MathQuillText } from '@t4/ui/src/MathQuillText'
import { MathTermInput } from '@t4/ui/src/MathTermInput'
import React from 'react'

export function TestScreen() {
  return (
    <YStack f={1} maxHeight='100dvh' overflow='hidden'>
      <ScrollView
        f={1}
        padding='$5'
        margin='$2'
        marginBottom={0}
        borderRadius='$5'
        boc='$borderColor'
        borderWidth='$1'
        jc='space-around'
      >
        <EquationHistory />
      </ScrollView>
      <XStack
        // flexWrap="wrap"
        // rowGap='$2'
        // columnGap='$8'
        ai='center'
        // jc='space-around'
        marginHorizontal='auto'
        // paddingHorizontal='$10'
        paddingVertical='$2'
        maxWidth='100%'
        overflowInline='auto'
        // maxHeight="10vh"
      >
        <EquationAction whiteSpace='nowrap' size='$5'>
          <MathQuillText unselectable paddingRight='$2'>
            {MATHQUILL_NULL_TOKEN} + <MathTermInput>1</MathTermInput>
          </MathQuillText>
        </EquationAction>
        <EquationAction whiteSpace='nowrap' size='$5'>
          <MathQuillText unselectable paddingRight='$2'>
            {MATHQUILL_NULL_TOKEN} - <MathTermInput>1</MathTermInput>
          </MathQuillText>
        </EquationAction>
        <EquationAction whiteSpace='nowrap' size='$5'>
          <MathQuillText unselectable>
            {MATHQUILL_NULL_TOKEN} \times <MathTermInput>2</MathTermInput>
          </MathQuillText>
        </EquationAction>
        <EquationAction whiteSpace='nowrap' size='$5'>
          <MathQuillText unselectable>
            {MATHQUILL_NULL_TOKEN} \div <MathTermInput>2</MathTermInput>
          </MathQuillText>
        </EquationAction>
        <EquationAction whiteSpace='nowrap' size='$5'>
          <MathQuillText unselectable>
            (\ellipsis)^<MathTermInput>2</MathTermInput>
          </MathQuillText>
        </EquationAction>
      </XStack>
    </YStack>
  )
}
