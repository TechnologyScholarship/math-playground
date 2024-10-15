import {
  XStack,
  YStack,
  ScrollView,
  isWeb,
  RawMathQuillText,
  Popover,
  Text,
  Button,
  getVariableValue,
  View,
} from '@t4/ui'
import { DragContext, EquationAction, EquationDropHandler } from '@t4/ui/src/EquationAction'
import { EquationHistoryHost, EquationHistoryStack } from '@t4/ui/src/EquationHistory'
import { MATHQUILL_NULL_TOKEN, MathQuillText, MathQuillTextProps } from '@t4/ui/src/MathQuillText'
import { HorizontalScroller } from '@t4/ui/src/HorizontalScroller'
import { MathTermInput } from '@t4/ui/src/MathTermInput'
import { SelectMath } from '@t4/ui/src/SelectMath'
import React, { useEffect, useRef } from 'react'
import { ChevronRight, Share, X } from '@tamagui/lucide-icons'
import { SolitoImage } from 'solito/image'
import { ThemeToggle } from '@t4/ui/src/ThemeToggle'
import { BaseEquationSelector } from '@t4/ui/src/BaseEquationSelector'
import { createParam } from 'solito'
import { ShareDialog } from '@t4/ui/src/ShareDialog'

function strongerThanExponent(term: string) {
  return /^(\d+|\w|\\\w+|(\\left)?\(.*(\\right)?\))$/.test(term)
}
function strongerThanProduct(term: string) {
  return !/[+-]/g.test(term.replace(/[{([].*[+-].*[})\]]/, ''))
}
function paranthesisUnless(term: string, condition: (term: string) => boolean) {
  return condition(term) ? term : `\\left(${term}\\right)`
}

const { useParams } = createParam<{ lhs?: string; rhs?: string }>()

export function HomeScreen() {
  const dropListener = useRef<EquationDropHandler>(() => {})
  const [tutorialOpen, setTutorialOpen] = React.useState(true)
  const [tutorialOpen2, setTutorialOpen2] = React.useState(false)
  const { params, setParams } = useParams()
  const nParams = { lhs: params.lhs || '4x + 3', rhs: params.rhs || 'x + 12' }

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
      <XStack padding='$2' paddingBottom={0} ai='stretch'>
        <XStack fb={0} flexGrow={1} jc='flex-start' ai='center' columnGap='$2'>
          <ShareDialog size='$2' base={nParams} />
          <BaseEquationSelector
            size='$2'
            base={nParams}
            setExpression={(state) => setParams(state, { webBehavior: 'replace' })}
          />
        </XStack>
        <XStack fb={0} flexGrow={1} jc='center' ai='center'>
          <RawMathQuillText>{'M_a t(h)\\cdot \\frac{P(la = y)}{g(r)ound}'}</RawMathQuillText>
        </XStack>
        <XStack fb={0} flexGrow={1} jc='flex-end' ai='center'>
          <ThemeToggle size='$2' />
        </XStack>
      </XStack>
      <DragContext.Provider value={dropListener}>
        {tutorialOpen || tutorialOpen2 ? (
          <View
            backgroundColor='#00000080'
            backdropFilter='blur(10px)'
            width='100%'
            height='100%'
            position='absolute'
            left={0}
            top={0}
            zIndex={1}
          />
        ) : null}
        <EquationHistoryHost
          base={nParams}
          zIndex={tutorialOpen2 ? 2 : undefined}
          dropHandler={dropListener}
        >
          <Popover open={tutorialOpen2} onOpenChange={setTutorialOpen2} placement='right'>
            <Popover.Adapt when='sm' platform='touch'>
              <Popover.Sheet modal dismissOnSnapToBottom>
                <Popover.Sheet.Frame padding='$4'>
                  <Popover.Adapt.Contents />
                </Popover.Sheet.Frame>
                <Popover.Sheet.Overlay
                  animation='lazy'
                  enterStyle={{ opacity: 0 }}
                  exitStyle={{ opacity: 0 }}
                />
              </Popover.Sheet>
            </Popover.Adapt>
            <Popover.Content
              elevate
              shadowColor='$shadowColor'
              shadowOffset={{ width: 5, height: 5 }}
              shadowRadius={8}
              shadowOpacity={0.8}
              padding='$3'
              maxWidth='30vw'
              borderColor='$borderColor'
              borderStyle='solid'
              borderWidth='$1'
            >
              <Popover.Arrow borderColor='$borderColor' borderStyle='solid' borderWidth='$1' />
              <SolitoImage
                width={getVariableValue('$20', 'size')}
                height={getVariableValue('$15', 'size')}
                src='/tutorial.apng'
                alt='Tutorial image showing how operations can be dropped onto the equation'
              />
              <Text>
                Drop the operations onto the equation in order to rearrange and solve the equation.
              </Text>
              <Popover.Close asChild>
                <Button size='$1' position='absolute' top='$2' right='$2' icon={<X />} />
              </Popover.Close>
              <XStack marginTop='$2' width='100%' justifyContent='flex-end' columnGap='$1'>
                <Popover.Close asChild>
                  <Button size='$2' iconAfter={<ChevronRight />} theme='blue'>
                    Done
                  </Button>
                </Popover.Close>
              </XStack>
            </Popover.Content>
            <Popover.Anchor zIndex={2}>
              <View onFocus={(e) => e.stopPropagation()}>
                <EquationHistoryStack />
              </View>
            </Popover.Anchor>
          </Popover>
        </EquationHistoryHost>
        <Popover
          open={tutorialOpen}
          onOpenChange={setTutorialOpen}
          stayInFrame
          placement='top'
          allowFlip
        >
          <Popover.Adapt when='sm' platform='touch'>
            <Popover.Sheet modal dismissOnSnapToBottom>
              <Popover.Sheet.Frame padding='$4'>
                <Popover.Adapt.Contents />
              </Popover.Sheet.Frame>
              <Popover.Sheet.Overlay
                animation='lazy'
                enterStyle={{ opacity: 0 }}
                exitStyle={{ opacity: 0 }}
              />
            </Popover.Sheet>
          </Popover.Adapt>
          <Popover.Content
            elevate
            shadowColor='$shadowColor'
            shadowOffset={{ width: 5, height: 5 }}
            shadowRadius={8}
            shadowOpacity={0.8}
            padding='$3'
            maxWidth='30vw'
            borderColor='$borderColor'
            borderStyle='solid'
            borderWidth='$1'
          >
            <Popover.Arrow borderColor='$borderColor' borderStyle='solid' borderWidth='$1' />
            <SolitoImage
              width={getVariableValue('$20', 'size')}
              height={getVariableValue('$15', 'size')}
              src='/dragging.apng'
              alt='Tutorial image showing how operations can be dragged'
            />
            <Text>Drag the operations to use them.</Text>
            <Popover.Close asChild>
              <Button size='$1' position='absolute' top='$2' right='$2' icon={<X />} />
            </Popover.Close>
            <XStack marginTop='$2' width='100%' justifyContent='flex-end' columnGap='$1'>
              <Popover.Close asChild>
                <Button size='$2'>Skip</Button>
              </Popover.Close>
              <Popover.Close asChild>
                <Button
                  onPress={(e) => setTutorialOpen2(true)}
                  size='$2'
                  iconAfter={<ChevronRight />}
                  theme='blue'
                >
                  Next
                </Button>
              </Popover.Close>
            </XStack>
          </Popover.Content>
          <Popover.Anchor zIndex={tutorialOpen ? 2 : undefined}>
            <View onFocus={(e) => e.stopPropagation()}>
              <HorizontalScroller f={0} flexShrink={0} maxWidth='100%' marginHorizontal='auto'>
                <XStack ai='center' paddingVertical='$2'>
                  <EquationAction transformer={(l, [x]) => `${l} + ${x}`}>
                    {MATHQUILL_NULL_TOKEN} + <MathTermInput>1</MathTermInput>
                  </EquationAction>
                  <EquationAction transformer={(l, [x]) => `${l} - ${x}`}>
                    {MATHQUILL_NULL_TOKEN} - <MathTermInput>1</MathTermInput>
                  </EquationAction>
                  <EquationAction
                    transformer={(l, [x]) =>
                      `${paranthesisUnless(l, strongerThanProduct)} \\times ${x}`
                    }
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
                  <EquationAction
                    transformer={(l, { functions }) => `${functions}\\left(${l}\\right)`}
                  >
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
            </View>
          </Popover.Anchor>
        </Popover>
      </DragContext.Provider>
    </YStack>
  )
}
