import { XStack, YStack, ScrollView, isWeb, RawMathQuillText, Popover, Text, Button, getVariableValue, View } from '@t4/ui'
import { DragContext, EquationAction, EquationDropHandler } from '@t4/ui/src/EquationAction'
import { EquationHistoryHost, EquationHistoryStack } from '@t4/ui/src/EquationHistory'
import { MATHQUILL_NULL_TOKEN, MathQuillText, MathQuillTextProps } from '@t4/ui/src/MathQuillText'
import { HorizontalScroller } from '@t4/ui/src/HorizontalScroller'
import { MathTermInput } from '@t4/ui/src/MathTermInput'
import { SelectMath } from '@t4/ui/src/SelectMath'
import React, { useEffect, useRef } from 'react'
import { ChevronRight, X } from '@tamagui/lucide-icons';
import { SolitoImage } from 'solito/image';

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
  const [tutorialOpen, setTutorialOpen] = React.useState(true);
  const [tutorialOpen2, setTutorialOpen2] = React.useState(false);

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
        {tutorialOpen || tutorialOpen2 ? <View
          backgroundColor='#00000080'
          backdropFilter='blur(10px)'
          width='100%'
          height='100%'
          position='absolute'
          left={0}
          top={0}
          zIndex={1}
        /> : null}
        <EquationHistoryHost zIndex={tutorialOpen2 ? 2 : undefined} dropHandler={dropListener}>
          <Popover open={tutorialOpen2} onOpenChange={setTutorialOpen2} placement='right'>
            <Popover.Arrow />
            <Popover.Content padding='$3' maxWidth='30vw' borderColor='$borderColor' borderStyle='solid' borderWidth='$1'>
              <SolitoImage
                width={getVariableValue('$20', 'size')}
                height={getVariableValue('$15', 'size')}
                src='/tutorial.apng'
                alt='Tutorial image showing how operations can be dropped onto the equation' />
              <Text>Drop the operations onto the equation in order to rearrange and solve the equation.</Text>
              <Popover.Close position='absolute' top='$2' right='$2'>
                <Button size='$1' icon={<X />} />
              </Popover.Close>
              <XStack marginTop='$2' width='100%' justifyContent='flex-end' columnGap='$1'>
                <Popover.Close>
                  <Button
                    size='$2'
                    iconAfter={<ChevronRight />}
                    backgroundColor='$blue6'
                    hoverStyle={{ backgroundColor: '$blue7' }}
                    pressStyle={{ backgroundColor: '$blue8' }}
                  >Next</Button>
                </Popover.Close>
              </XStack>
            </Popover.Content>
            <Popover.Anchor zIndex={2}>
              <EquationHistoryStack/>
            </Popover.Anchor>
          </Popover>
        </EquationHistoryHost>
        <Popover open={tutorialOpen} onOpenChange={setTutorialOpen} stayInFrame placement='top' allowFlip>
          <Popover.Arrow/>
          <Popover.Content padding='$3' maxWidth='30vw' borderColor='$borderColor' borderStyle='solid' borderWidth='$1'>
            <SolitoImage
              width={getVariableValue('$20', 'size')}
              height={getVariableValue('$15', 'size')}
              src='/dragging.apng'
              alt='Tutorial image showing how operations can be dragged'/>
            <Text>Drag the operations to use them.</Text>
            <Popover.Close position='absolute' top='$2' right='$2'>
              <Button size='$1' icon={<X/>}/>
            </Popover.Close>
            <XStack marginTop='$2' width='100%' justifyContent='flex-end' columnGap='$1'>
              <Popover.Close>
                <Button size='$2'>Skip</Button>
              </Popover.Close>
              <Popover.Close>
                <Button
                  onPress={e => setTutorialOpen2(true)}
                  size='$2'
                  iconAfter={<ChevronRight />}
                  backgroundColor='$blue6'
                  hoverStyle={{ backgroundColor: '$blue7' }}
                  pressStyle={{ backgroundColor: '$blue8' }}
                >Next</Button>
              </Popover.Close>
            </XStack>
          </Popover.Content>
          <Popover.Anchor zIndex={tutorialOpen ? 2 : undefined}>
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
          </Popover.Anchor>
        </Popover>
      </DragContext.Provider>
    </YStack>
  )
}
