import { XStack, XStackProps, Draggable, MathQuillText } from '@t4/ui'
import React from 'react'

export type ActionTerms = string[] & { [key: string]: string }
export type EquationTransformer = (latex: string) => string
export type EquationWithContextTransformer = (latex: string, terms: ActionTerms) => string
export type EquationDropHandler = (transformer: EquationTransformer) => void
export const DragContext = React.createContext<React.RefObject<EquationDropHandler> | null>(null)
export const ActionTermsContext = React.createContext<ActionTerms>([] as any)

export function EquationAction({
  children,
  transformer,
  ...props
}: React.PropsWithChildren<
  XStackProps & {
    transformer: EquationWithContextTransformer
  }
>) {
  const listener = React.useContext(DragContext)
  const state = React.useRef<ActionTerms>([] as any /* just use js weirdness */)
  return (
    <ActionTermsContext.Provider value={state.current}>
      <Draggable
        onDragEnd={(e) => {
          listener?.current?.((expr) => transformer(expr, state.current))
        }}
      >
        <XStack group='action' paddingHorizontal='$6' paddingVertical='$4' ai='center' {...props}>
          <MathQuillText size='$5' unselectable>
            {children}
          </MathQuillText>
        </XStack>
      </Draggable>
    </ActionTermsContext.Provider>
  )
}
