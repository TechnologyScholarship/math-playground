import { AnimatePresence, ScrollView, View, ViewProps, isWeb } from '@t4/ui'
import React from 'react'
import { EquationStack } from './EquationStack'
import { EquationRow } from './EquationRow'
import { EquationDropHandler, EquationTransformer } from './EquationAction'
import { tidy } from './latexutil'

function stackReducer<T>(
  array: T[],
  action: { type: 'push' | 'modify' | 'set'; item: T } | { type: 'pop' }
): T[] {
  switch (action.type) {
    case 'push':
      return [action.item, ...array]
    case 'pop':
      return array.slice(1) || []
    case 'modify':
      return [action.item, ...(array.slice(1) || [])]
    case 'set':
      return [action.item]
  }
}

type StackReducer = Parameters<typeof stackReducer<{ key: number; item: [string, string] }>>
type StackType = StackReducer[0]
type StackDispatchType = (action: StackReducer[1]) => void

const EquationHistoryContext = React.createContext<{
  key: [number, (value: number) => void]
  history: [StackType, StackDispatchType]
}>({
  key: [
    0,
    () => {
      throw new TypeError('Unexpected context')
    },
  ],
  history: [
    [],
    () => {
      throw new TypeError('Unexpected context')
    },
  ],
})

export function EquationHistoryHost({
  children,
  dropHandler,
  base,
  ...props
}: React.PropsWithChildren<{
  dropHandler: React.MutableRefObject<EquationDropHandler>
  base: { lhs: string; rhs: string }
}> &
  ViewProps) {
  const keyState = React.useState(1)
  const [key, setKey] = keyState

  const historyState = React.useReducer(stackReducer<{ key: number; item: [string, string] }>, [
    { key: 0, item: [base.lhs, base.rhs] },
  ])
  const [history, updateHistory] = historyState

  // biome-ignore lint/correctness/useExhaustiveDependencies: i know what im doing
  React.useEffect(() => {
    updateHistory({ type: 'set', item: { key: key, item: [base.lhs, base.rhs] } })
    setKey(key + 1)
  }, [base])

  const onDragOver = (e: { stopPropagation: () => void }) => {
    e.stopPropagation()
    dropHandler.current = (transformer: EquationTransformer) => {
      updateHistory({
        type: 'push',
        item: { key, item: history[0].item.map(transformer).map(tidy) as [string, string] },
      })
      setKey(key + 1)
    }
  }

  return (
    <View
      f={1}
      onPointerEnter={onDragOver}
      {...(isWeb ? { onDragOver } : {})}
      onPointerLeave={(e) => {
        dropHandler.current = () => {}
      }}
      {...props}
    >
      <EquationHistoryContext.Provider
        value={{
          key: keyState,
          history: historyState,
        }}
      >
        <ScrollView
          padding='$5'
          margin='$2'
          marginBottom={0}
          borderRadius='$5'
          boc='$borderColor'
          borderWidth='$1'
          jc='space-around'
          ai='center'
          f={1}
        >
          {children}
        </ScrollView>
      </EquationHistoryContext.Provider>
    </View>
  )
}

export function EquationHistoryStack() {
  const {
    key: [key, setKey],
    history: [history, updateHistory],
  } = React.useContext(EquationHistoryContext)
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
          >
            <EquationRow
              fontSize='$7'
              color={i !== 0 ? '$placeholderColor' : undefined}
              onRemove={
                i === 0 && history?.length > 1
                  ? (e) => {
                      updateHistory({ type: 'pop' })
                    }
                  : undefined
              }
              simplifyHandler={
                i === 0
                  ? (latex) => {
                      updateHistory({
                        type: 'push',
                        item: { key, item: latex.map(tidy) as [string, string] },
                      })
                      setKey(key + 1)
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
