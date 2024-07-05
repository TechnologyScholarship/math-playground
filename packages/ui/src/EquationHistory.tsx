import { AnimatePresence, styled, View } from '@t4/ui'
import React from 'react'
import { EquationStack } from './EquationStack'
import { EquationRow } from './EquationRow'

export function EquationHistory() {
  const [key, setKey] = React.useState(6)

  function stackReducer<T>(
    array: T[],
    action: { type: 'push' | 'modify'; item: T } | { type: 'pop' }
  ): T[] {
    switch (action.type) {
      case 'push':
        return [action.item, ...array]
      case 'pop':
        return array.slice(1) || []
      case 'modify':
        return [action.item, ...(array.slice(1) || [])]
    }
  }

  const [history, updateHistory] = React.useReducer(
    stackReducer<{ key: number; item: [string, string] }>,
    [
      { key: 0, item: ['x', '14'] },
      { key: 1, item: ['x + 1', '\\sqrt{2}'] },
      { key: 2, item: ['\\frac{(x + 1)^2}{2}', '1'] },
      { key: 3, item: ['(x + 1)^2', '2'] },
      { key: 4, item: ['(x + 1)^2 - 2', '0'] },
      { key: 5, item: ['x^2 + 2x - 1', '0'] },
    ]
  )

  return (
    <EquationStack>
      <AnimatePresence initial={false}>
        {...(history ?? []).map((eq, i) => (
          <View
            key={eq.key}
            animation='bouncy'
            enterStyle={{
              y: '-100%',
            }}
            exitStyle={{
              y: '-100%',
              opacity: 0,
            }}
            onPress={
              i === 0
                ? (e) => {
                    updateHistory({
                      type: 'push',
                      item: { key, item: history[0].item },
                    })
                    setKey(key + 1)
                  }
                : undefined
            }
          >
            <EquationRow
              fontSize='$7'
              color={i !== 0 ? '$placeholderColor' : undefined}
              onRemove={
                i === 0 && history?.length > 1
                  ? (e) => {
                      e.stopPropagation()
                      updateHistory({ type: 'pop' })
                    }
                  : undefined
              }
            >
              {eq.item}
            </EquationRow>
          </View>
        ))}
      </AnimatePresence>
    </EquationStack>
  )
}
