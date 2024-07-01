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
        <EquationAction fontSize='$5'>
          <MathQuillText unselectable>+1</MathQuillText>
        </EquationAction>
        <EquationAction whiteSpace='nowrap' fontSize='$5'>
          <MathQuillText unselectable>\times</MathQuillText>
          <MathTermInput>5</MathTermInput>
        </EquationAction>
        <EquationAction fontSize='$5'>
          <MathQuillText unselectable>\div1</MathQuillText>
        </EquationAction>
        <EquationAction fontSize='$5'>
          <MathQuillText unselectable>+2</MathQuillText>
        </EquationAction>
        <EquationAction fontSize='$5'>
          <MathQuillText unselectable>\times2</MathQuillText>
        </EquationAction>
        <EquationAction fontSize='$5'>
          <MathQuillText unselectable>\div2</MathQuillText>
        </EquationAction>
      </XStack>
    </YStack>
  );
}
