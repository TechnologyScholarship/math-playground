import { XStack, YStack, ScrollView } from '@t4/ui';
import { EquationAction } from '@t4/ui/src/EquationAction';
import { EquationHistory } from '@t4/ui/src/EquationHistory';
import { MATHQUILL_NULL_TOKEN, MathQuillText } from '@t4/ui/src/MathQuillText';
import { MathTermInput } from '@t4/ui/src/MathTermInput';
import React from 'react'

export function HomeScreen() {
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
        ai='center'
        marginHorizontal='auto'
        paddingVertical='$2'
        maxWidth='100%'
        overflowInline='auto'
      >
        <EquationAction>
          <MathQuillText size='$5' unselectable paddingRight='$2'>
            {MATHQUILL_NULL_TOKEN} + <MathTermInput>1</MathTermInput>
          </MathQuillText>
        </EquationAction>
        <EquationAction>
          <MathQuillText size='$5' unselectable paddingRight='$2'>
            {MATHQUILL_NULL_TOKEN} - <MathTermInput>1</MathTermInput>
          </MathQuillText>
        </EquationAction>
        <EquationAction>
          <MathQuillText size='$5' unselectable>
            {MATHQUILL_NULL_TOKEN} \times <MathTermInput>2</MathTermInput>
          </MathQuillText>
        </EquationAction>
        <EquationAction>
          <MathQuillText size='$5' unselectable>
            {MATHQUILL_NULL_TOKEN} \div <MathTermInput>2</MathTermInput>
          </MathQuillText>
        </EquationAction>
        <EquationAction>
          <MathQuillText size='$5' unselectable>
            (\ellipsis)^<MathTermInput>2</MathTermInput>
          </MathQuillText>
        </EquationAction>
        <EquationAction>
          <MathQuillText size='$5' unselectable>
            \sqrt[<MathTermInput>2</MathTermInput>]{'{\\ellipsis}'}
          </MathQuillText>
        </EquationAction>
      </XStack>
    </YStack>
  )
}
