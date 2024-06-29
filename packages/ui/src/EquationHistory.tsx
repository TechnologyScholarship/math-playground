import { Paragraph, YStack } from '@t4/ui'
import React from 'react'
import { EquationStack } from './EquationStack'
import { EquationRow } from './EquationRow'

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

export function EquationHistory() {
  const [history, updateHistory] = React.useReducer(stackReducer<[string, string]>, [
    ['x + 1', '\\sqrt{2}'],
    ['\\frac{(x + 1)^2}{2}', '1'],
    ['(x + 1)^2', '2'],
    ['(x + 1)^2 - 2', '0'],
    ['x^2 + 2x - 1', '0'],
  ])
  const [current, setCurrent] = React.useState<[string, string]>(['x', '14'])
  return (
    <EquationStack>
      <EquationRow
        size='$7'
        // onMouseDown={e => updateHistory({ type: 'push', item: current })}
        // onMouseUp={e => updateHistory({ type: 'pop' })}
        onPress={(e) => {
          /* needed for onMouse<Dir> to work *apparently* */
        }}
        onRemove={
          history?.length
            ? (e) => {
                setCurrent(history[0])
                updateHistory({ type: 'pop' })
              }
            : undefined
        }
      >
        {current}
      </EquationRow>
      {...(history ?? []).map((eq) => (
        <EquationRow color='$placeholderColor' size='$7'>
          {eq}
        </EquationRow>
      ))}
    </EquationStack>
  )
}
