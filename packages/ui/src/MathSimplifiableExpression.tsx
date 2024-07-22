import {
  RawMathQuillText,
  RawMathQuillTextProps,
  useMedia,
  View,
  ViewProps,
  XStack,
  isServer,
  useDidFinishSSR,
} from '@t4/ui'
import React from 'react'
import { Tooltip } from './Tooltip'

export function MathSimplifiableExpression({
  children,
  replaceContent,
  replaceHandler,
  ...props
}: RawMathQuillTextProps & {
  replaceContent?: RawMathQuillTextProps['children']
  replaceHandler(): void
}) {
  // const media = useMedia();
  // media.hoverNone = true;
  const didFinishSSR = useDidFinishSSR()
  return (
    <View group='action' display='inline-flex' position='relative' {...(props as ViewProps)}>
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
    </View>
  )
}
