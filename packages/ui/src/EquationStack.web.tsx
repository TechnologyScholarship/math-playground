import React from 'react'
import { YStack, getTokens } from '@t4/ui'
export const EquationStack = (props) => {
  return (
    <YStack className='eq-stack' f={1} rowGap='$2' fd='column-reverse' ac='center'>
      <style
        dangerouslySetInnerHTML={{
          __html: `
        .eq-stack > * > :first-child {
          justify-self: right;
        }
      `,
        }}
      />
      {props.children.map((el) => {
        return React.cloneElement(el, {
          style: {
            display: 'grid',
            gridTemplateColumns: '1fr min-content 1fr ' + getTokens().size[2].variable,
            alignItems: 'baseline',
          },
        })
      })}
    </YStack>
  )
}
