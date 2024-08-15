import React from 'react'
import { YStack, getToken } from '@t4/ui'
export const EquationStack = (props) => {
  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `
            .eq-stack {
              width: max-content;
            }
            .eq-stack > * {
              display: grid !important;
              grid-template-columns: 1fr min-content 1fr ${getToken('$2', 'size', true)};
              align-items: baseline !important;
            }
            .eq-stack > * > :first-child {
              justify-self: right;
            }
          `,
        }}
      />
      <YStack
        position='relative'
        className='eq-stack'
        f={1}
        rowGap='$2'
        fd='column-reverse'
        ac='center'
      >
        {props.children}
      </YStack>
    </>
  )
}
