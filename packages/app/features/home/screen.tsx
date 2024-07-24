import { XStack, YStack, ScrollView, isWeb, RawMathQuillText } from '@t4/ui'
import { DragContext, EquationAction, EquationDropHandler } from '@t4/ui/src/EquationAction'
import { EquationHistory } from '@t4/ui/src/EquationHistory'
import { MATHQUILL_NULL_TOKEN, MathQuillText, MathQuillTextProps } from '@t4/ui/src/MathQuillText'
import { HorizontalScroller } from '@t4/ui/src/HorizontalScroller'
import { MathTermInput } from '@t4/ui/src/MathTermInput'
import { SelectMath } from '@t4/ui/src/SelectMath'
import React, { useEffect, useRef } from 'react'

function strongerThanExponent(term: string) {
  return /^(\d+|\w|\\\w+|(\\left)?\(.*(\\right)?\))$/.test(term)
}
function strongerThanProduct(term: string) {
  return !/[+-]/g.test(term.replace(/[{([].*[+-].*[})\]]/, ''))
}
function paranthesisUnless(term: string, condition: (term: string) => boolean) {
  return condition(term) ? term : `\\left(${term}\\right)`
}

export function HomeScreen() {
  const dropListener = useRef<EquationDropHandler>(() => {})

  return (
    <YStack
      f={1}
      maxHeight='100dvh'
      overflow='hidden'
      {...(isWeb
        ? {
            onDragOver: (_) => {
              dropListener.current = () => {}
            },
          }
        : {})}
    >
      <DragContext.Provider value={dropListener}>
        <EquationHistory dropHandler={dropListener} />
        <HorizontalScroller f={0} flexShrink={0} maxWidth='100%' marginHorizontal='auto'>
          <XStack ai='center' paddingVertical='$2'>
            <EquationAction transformer={(l, [x]) => `${l} + ${x}`}>
              {MATHQUILL_NULL_TOKEN} + <MathTermInput>1</MathTermInput>
            </EquationAction>
            <EquationAction transformer={(l, [x]) => `${l} - ${x}`}>
              {MATHQUILL_NULL_TOKEN} - <MathTermInput>1</MathTermInput>
            </EquationAction>
            <EquationAction
              transformer={(l, [x]) => `${paranthesisUnless(l, strongerThanProduct)} \\times ${x}`}
            >
              {MATHQUILL_NULL_TOKEN} \times <MathTermInput>2</MathTermInput>
            </EquationAction>
            <EquationAction transformer={(l, [x]) => `\\frac{${l}}{${x}}`}>
              {MATHQUILL_NULL_TOKEN} \div <MathTermInput>2</MathTermInput>
            </EquationAction>
            <EquationAction
              transformer={(l, [x]) => `${paranthesisUnless(l, strongerThanExponent)}^{${x}}`}
            >
              (\ellipsis)^<MathTermInput>2</MathTermInput>
            </EquationAction>
            <EquationAction
              transformer={(l, [x]) =>
                parseFloat(x ?? '') === 2 ? `\\sqrt{${l}}` : `\\sqrt[${x}]{${l}}`
              }
            >
              \sqrt[<MathTermInput>2</MathTermInput>]{'{\\ellipsis}'}
            </EquationAction>
            <EquationAction transformer={(l, { functions }) => `${functions}\\left(${l}\\right)`}>
              <SelectMath name='Functions' defaultValue='log'>
                <RawMathQuillText>log</RawMathQuillText>
                <RawMathQuillText>ln</RawMathQuillText>
                <RawMathQuillText>sin</RawMathQuillText>
                <RawMathQuillText>cos</RawMathQuillText>
                <RawMathQuillText>tan</RawMathQuillText>
                <RawMathQuillText>{'sin^{-1}'}</RawMathQuillText>
                <RawMathQuillText>{'cos^{-1}'}</RawMathQuillText>
                <RawMathQuillText>{'tan^{-1}'}</RawMathQuillText>
                <RawMathQuillText>cosec</RawMathQuillText>
                <RawMathQuillText>sec</RawMathQuillText>
                <RawMathQuillText>cot</RawMathQuillText>
                <RawMathQuillText>sinh</RawMathQuillText>
                <RawMathQuillText>cosh</RawMathQuillText>
                <RawMathQuillText>tanh</RawMathQuillText>
                <RawMathQuillText>{'sinh^{-1}'}</RawMathQuillText>
                <RawMathQuillText>{'cosh^{-1}'}</RawMathQuillText>
                <RawMathQuillText>{'tanh^{-1}'}</RawMathQuillText>
              </SelectMath>
              (\ellipsis)
            </EquationAction>
          </XStack>
        </HorizontalScroller>
      </DragContext.Provider>
    </YStack>
  )
}
