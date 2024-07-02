import { View, Text, Square, Circle, XStack, YStack, ScrollView, ScrollOver } from '@t4/ui';
import { EquationAction } from '@t4/ui/src/EquationAction';
import { EquationHistory } from '@t4/ui/src/EquationHistory';
import { MathQuillInput } from '@t4/ui/src/MathQuillInput';
import { MathQuillText } from '@t4/ui/src/MathQuillText';
import { MathTermInput } from '@t4/ui/src/MathTermInput';
import React from 'react'

export function TestScreen() {
  // {/* <MathQuillInput color='green' /> */}
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
          <MathQuillText unselectable paddingRight='$2'>+</MathQuillText>
          <MathTermInput>1</MathTermInput>
        </EquationAction>
        <EquationAction whiteSpace='nowrap' size='$5'>
          <MathQuillText unselectable paddingRight='$2'>-</MathQuillText>
          <MathTermInput>1</MathTermInput>
        </EquationAction>
        <EquationAction whiteSpace='nowrap' size='$5'>
          <MathQuillText unselectable>\times</MathQuillText>
          <MathTermInput>2</MathTermInput>
        </EquationAction>
        <EquationAction whiteSpace='nowrap' size='$5'>
          <MathQuillText unselectable>\div</MathQuillText>
          <MathTermInput>2</MathTermInput>
        </EquationAction>
        <EquationAction whiteSpace='nowrap' size='$5'>
          <MathQuillText>
            (\ellipsis)^<MathQuillInput>2</MathQuillInput>
          </MathQuillText>
        </EquationAction>
      </XStack>
    </YStack>
  );
}
