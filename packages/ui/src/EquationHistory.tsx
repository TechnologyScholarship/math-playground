"use client";
import { AnimatePresence, styled } from '@t4/ui';
import React from 'react'
import { EquationStack } from './EquationStack'
import { EquationRow } from './EquationRow'

const CustomEquationRow = styled(EquationRow, {
  animation: 'bouncy',
  enterStyle: {
    y: '-100%'
  },
  exitStyle: {
    y: '-100%',
    opacity: 0,
    marginBottom: '-100%'
  },

  variants: {
    // 1 = right, 0 = nowhere, -1 = left
    exiting: {
      true: {
        y: '100%',
      }
    },
  } as const,
});

export function EquationHistory() {
  const [key, setKey] = React.useState(6);

  function stackReducer<T>(
    array: T[],
    action: { type: 'push' | 'modify'; item: T; } | { type: 'pop'; }
  ): T[] {
    switch (action.type) {
      case 'push': 
        return [action.item, ...array];
      case 'pop':
        return array.slice(1) || [];
      case 'modify':
        return [action.item, ...(array.slice(1) || [])];
    }
  }

  const [history, updateHistory] = React.useReducer(stackReducer<{ key: number, item: [string, string]; }>, [
    { key: 0, item: ['x', '14'] },
    { key: 1, item: ['x + 1', '\\sqrt{2}'] },
    { key: 2, item: ['\\frac{(x + 1)^2}{2}', '1'] },
    { key: 3, item: ['(x + 1)^2', '2'] },
    { key: 4, item: ['(x + 1)^2 - 2', '0'] },
    { key: 5, item: ['x^2 + 2x - 1', '0'] },
  ])
  // const [current, setCurrent] = React.useState<[string, string]>(['x', '14']);
  // const [currentKey, setCurrentKey] = React.useState<number | null>(null);
  return (
    <EquationStack>
      <AnimatePresence>
        {
          // <EquationRow
          //   size='$7'
          //   onPress={e => {
          //     updateHistory({
          //       type: 'push',
          //       item: { key, item: current },
          //     });
          //     setKey(key + 1);
          //     setCurrentKey(null);
          //   }}
          //   // onMouseUp={e => updateHistory({ type: 'pop' })}
          //   // onPress={(e) => {
          //   //   /* needed for onMouse<Dir> to work *apparently* */
          //   // }}
          //   onRemove={
          //     history?.length
          //       ? (e) => {
          //         e.stopPropagation();
          //         setCurrent(history[0].item);
          //         setCurrentKey(history[0].key);
          //         updateHistory({ type: 'pop' });
          //       }
          //       : undefined
          //   }
          //   key={currentKey == null ? key : currentKey}
          // >
          //   {current}
          // </EquationRow>
        }
        {...(history ?? []).map((eq, i) => ( // TODO: element keys
          <EquationRow
            key={eq.key}
            color={i !== 0 ? '$placeholderColor' : undefined}
            onRemove={
              i === 0 && history?.length > 1
                ? (e) => {
                  e.stopPropagation();
                  updateHistory({ type: 'pop' });
                }
                : undefined
            }
            onPress={i === 0 ? e => {
              updateHistory({
                type: 'push',
                item: { key, item: history[0].item },
              });
              setKey(key + 1);
            } : undefined}
          >
            {eq.item}
          </EquationRow>
        ))}
      </AnimatePresence>
    </EquationStack>
  )
}
