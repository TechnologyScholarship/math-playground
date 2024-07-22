import { Adapt, Button, Input, Label, Paragraph, Tooltip, View, XStack, YStack } from '@t4/ui'
import { ChevronDown } from '@tamagui/lucide-icons'
import React from 'react'

export function testbedScreen() {
  return (
    <YStack f={1} jc='center' ai='center' space>
      <View>
        {/* <YStack space="$3">
        <XStack space="$3">
          <Label size="$3" htmlFor={'test'}>
            Name
          </Label>
          <Input size="$3" id={'test'} />
        </XStack>
      </YStack> */}
        <Tooltip size='$5' allowFlip placement='bottom'>
          <Tooltip.Trigger asChild>
            <Button icon={ChevronDown} />
          </Tooltip.Trigger>

          {/* <Adapt when='sm' platform='touch'>
            <Tooltip.Sheet modal dismissOnSnapToBottom>
              <Tooltip.Sheet.Frame padding='$4'>
                <Adapt.Contents />
              </Tooltip.Sheet.Frame>
              <Tooltip.Sheet.Overlay
                animation='lazy'
                enterStyle={{ opacity: 0 }}
                exitStyle={{ opacity: 0 }}
              />
            </Tooltip.Sheet>
          </Adapt> */}

          <Tooltip.Content
            borderWidth={1}
            borderColor='$borderColor'
            enterStyle={{ y: -10, opacity: 0 }}
            exitStyle={{ y: -10, opacity: 0 }}
            elevate
            animation={[
              'quick',
              {
                opacity: {
                  overshootClamping: true,
                },
              },
            ]}
          >
            <Tooltip.Arrow borderWidth={1} borderColor='$borderColor' />

            <YStack space='$3'>
              <XStack space='$3'>
                <Label size='$3' htmlFor={'test'}>
                  Name
                </Label>
                <Input size='$3' id={'test'} />
              </XStack>

              {/* <Tooltip.Close asChild>
                <Button
                  size='$3'
                  onPress={() => {
                    // Custom code goes here, does not interfere with popover closure
                  }}
                >
                  Submit
                </Button>
              </Tooltip.Close> */}
            </YStack>
          </Tooltip.Content>
        </Tooltip>
      </View>
    </YStack>
  )
}
