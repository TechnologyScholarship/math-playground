import {
  RawMathQuillText,
  RawMathQuillTextProps,
  useMedia,
  Text,
  View,
  TextProps,
  XStack,
  isServer,
  useDidFinishSSR,
  Popover,
  getVariableValue,
  Button,
} from '@t4/ui'
import React from 'react'
import { Tooltip } from './Tooltip'
import { X, Info } from '@tamagui/lucide-icons'
import { EquationHistoryStack } from './EquationHistory'

export function MathSimplifiableExpression({
  children,
  replaceContent,
  replaceHandler,
  infoContent,
  ...props
}: RawMathQuillTextProps & {
  replaceContent?: RawMathQuillTextProps['children']
  replaceHandler(): void
  infoContent?: React.ReactNode
}) {
  // const media = useMedia();
  // media.hoverNone = true;
  const didFinishSSR = useDidFinishSSR()
  return (
    <Text group='action' display='inline-flex' position='relative' {...(props as TextProps)}>
      <XStack
        // {...props as XStackProps}
        width='100%'
        height='100%'
        jc='center'
        ai='center'
        position='absolute'
        pointerEvents='none'
        zIndex={100}
      >
        <View
          animation='bouncy'
          width={0}
          height='$radius.1'
          borderRadius='$radius.1'
          backgroundColor='$red10'
          rotateZ='-10deg'
          $group-action-hover={{
            width: '100%',
          }}
        />
      </XStack>
      {replaceContent || /* Required to include styles */ isServer || !didFinishSSR ? (
        <Tooltip paddingInline='$2' borderRadius='$2'>
          <RawMathQuillText>{replaceContent ?? ''}</RawMathQuillText>
        </Tooltip>
      ) : null}
      <RawMathQuillText
        animation='bouncy'
        borderStyle='dotted'
        borderWidth={0}
        borderBottomColor='$borderColor'
        borderBottomWidth='$1'
        {...props}
        $group-action-hover={{
          color: '$red10',
          ...(props.hoverStyle ?? {}),
        }}
        onPress={/* media.hoverNone ? undefined : */ (e) => replaceHandler()}
      >
        {children}
      </RawMathQuillText>
      {infoContent ? (
        <Popover placement='top-end'>
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
            {infoContent}
            <Popover.Close position='absolute' top='$2' right='$2'>
              <Button size='$1' icon={<X />} />
            </Popover.Close>
            <Popover.Arrow borderColor='$borderColor' borderStyle='solid' borderWidth='$1' />
          </Popover.Content>
          <Popover.Trigger asChild>
            <Button
              animation='bouncy'
              zIndex={1000}
              color='$blue6'
              icon={<Info />}
              position='absolute'
              x={getVariableValue('$0.5', 'size')}
              right='$size.0.5'
              borderRadius='50%'
              size={5}
              backgroundColor='$blue6'
              $group-hoverNone={{
                size: '$1',
                right: 0,
                backgroundColor: '$background',
                borderRadius: '$1',
                top: '$-2',
              }}
              $group-action-hover={{
                size: '$1',
                right: 0,
                backgroundColor: '$background',
                borderRadius: '$1',
                top: '$-2',
              }}
            />
          </Popover.Trigger>
        </Popover>
      ) : null}
      {/* {media.hoverNone ? (
        <Popover
          keepChildrenMounted
          strategy='absolute'
          stayInFrame
          hoverable
          offset={1}
          placement='bottom'
          allowFlip
        >
          <Popover.Trigger>{content}</Popover.Trigger>
          <Popover.Content size='$3'>
            <Popover.ScrollView></Popover.ScrollView>
            <Popover.Arrow />
            <Popover.Close />
            <Button onPress={(e) => replaceHandler()}>
              <RawMathQuillText>3</RawMathQuillText>
            </Button>
          </Popover.Content>
        </Popover>
      ) : (
        <Tooltip strategy='absolute' offset={1} placement='top'>
          <Tooltip.Trigger>{content}</Tooltip.Trigger>
          <Tooltip.Content>
            <RawMathQuillText>3</RawMathQuillText>
            <Tooltip.Arrow />
          </Tooltip.Content>
        </Tooltip>
      )} */}
    </Text>
  )
}
