import { Dialog, Button, ButtonProps, Adapt, Sheet, XStack, Input, View, isWeb } from '@t4/ui'
import { Share, X, Copy } from '@tamagui/lucide-icons'
import React from 'react'
import { useClipboard } from '@react-native-clipboard/clipboard'
import { useToastController } from '@tamagui/toast';

export function ShareDialog({
  base,
  ...props
}: {
  base: { lhs: string, rhs: string }
} & ButtonProps) {
  const [clip, setClip] = useClipboard()
  const toast = useToastController()
  const url = new URL(global.location?.href ?? 'https://math-playground.pages.dev/')
  url.searchParams.set('lhs', base.lhs)
  url.searchParams.set('rhs', base.rhs)
  return (
    <Dialog modal>
      <Dialog.Trigger asChild>
        <Button icon={<Share />} {...props}>
          Share
        </Button>
      </Dialog.Trigger>

      <Adapt when='sm' platform='touch'>
        <Sheet animation='bouncy' zIndex={200000} modal dismissOnSnapToBottom>
          <Sheet.Frame padding='$4' gap='$4'>
            <Adapt.Contents />
          </Sheet.Frame>
          <Sheet.Overlay animation='lazy' enterStyle={{ opacity: 0 }} exitStyle={{ opacity: 0 }} />
        </Sheet>
      </Adapt>

      <Dialog.Portal>
        <Dialog.Overlay
          key='overlay'
          animation='bouncy'
          opacity={0.5}
          enterStyle={{ opacity: 0 }}
          exitStyle={{ opacity: 0 }}
        />

        <Dialog.Content
          bordered
          elevate
          key='content'
          animateOnly={['transform', 'opacity']}
          animation='bouncy'
          enterStyle={{ x: 0, y: -20, opacity: 0, scale: 0.9 }}
          exitStyle={{ x: 0, y: 10, opacity: 0, scale: 0.95 }}
          gap='$4'
        >
          <Dialog.Title>Share</Dialog.Title>
          <Dialog.Description>
            You can share this initial equation using the following URL:
          </Dialog.Description>
          <View>
            <Input
              value={url.toString()}
              onPress={isWeb ? (e) => (e.target as unknown as HTMLInputElement).select() : undefined}
            />
            <Button icon={<Copy />} position='absolute' right={0} onPress={e => {
              setClip(url.toString())
              toast.show("Copied to clipboard!", {
                duration: 2000,
              })
            }}>
              Copy
            </Button>
          </View>

          <XStack alignSelf='flex-end' columnGap='$2'>
            <Dialog.Close displayWhenAdapted asChild>
              <Button theme='blue' size='$3' aria-label='Close'>
                Ok
              </Button>
            </Dialog.Close>
          </XStack>

          <Dialog.Close asChild>
            <Button position='absolute' top='$3' right='$3' size='$2' icon={<X />} />
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog>
  )
}
