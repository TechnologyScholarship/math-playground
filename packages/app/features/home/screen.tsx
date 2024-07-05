import { XStack, YStack, ScrollView, isWeb, isServer, useDidFinishSSR } from '@t4/ui';
import { EquationAction, EquationDropHandler } from '@t4/ui/src/EquationAction';
import { EquationHistory } from '@t4/ui/src/EquationHistory';
import { MATHQUILL_NULL_TOKEN, MathQuillText, MathQuillTextProps } from '@t4/ui/src/MathQuillText';
import { MathTermInput } from '@t4/ui/src/MathTermInput';
import React, { Children, useEffect, useRef, useState } from 'react';

const ExpressionTermsContext = React.createContext<{ [key: string]: string; }>({});

export function HomeScreen() {
  const finishedSSR = useDidFinishSSR();
  const dropListener = useRef<EquationDropHandler | undefined>(undefined);

  function Action(props: { transformer: (latex: string, terms: { [key: string]: string; }) => string, children: MathQuillTextProps['children']; }) {
    const states = useRef<{ [key: string]: string; }>({});
    return (
      <ExpressionTermsContext.Provider value={states.current}>
        <EquationAction
          listener={dropListener}
          transformer={l => {
            return props.transformer(l, states.current);
          }}
        >
          <MathQuillText size='$5' unselectable>
            {props.children}
          </MathQuillText>
        </EquationAction>
      </ExpressionTermsContext.Provider>
    );
  }

  const Term = (props: { id?: string, children: string | (() => string); }) => {
    const ctx = React.useContext(ExpressionTermsContext);
    const state = React.useState<string>(props.children);
    useEffect(() => {
      ctx[props.id || 'x'] = state[0];
    }, [ctx, state, props.id]);
    return <MathTermInput expressionState={state} />;
  };

  return (
    <YStack f={1} maxHeight='100dvh' overflow='hidden' {...(isWeb ? { onDragOver: _ => { dropListener.current = undefined; } } : {})}>
      <ScrollView
        f={1}
        padding='$5'
        margin='$2'
        marginBottom={0}
        borderRadius='$5'
        boc='$borderColor'
        borderWidth='$1'
        jc='space-around'
      >
        <EquationHistory dropHandler={dropListener} />
      </ScrollView>
      <XStack
        ai='center'
        marginHorizontal='auto'
        paddingVertical='$2'
        maxWidth='100%'
        overflowInline='auto'
      >
        <Action transformer={(l, { x }) => `${l} + ${x}`}>
          {MATHQUILL_NULL_TOKEN} + <Term>1</Term>
        </Action>
        <Action transformer={(l, { x }) => `${l} - ${x}`}>
          {MATHQUILL_NULL_TOKEN} - <Term>1</Term>
        </Action>
        <Action transformer={(l, { x }) => `(${l}) \\times ${x}`}>
          {MATHQUILL_NULL_TOKEN} \times <Term>2</Term>
        </Action>
        <Action transformer={(l, { x }) => `\\frac{${l}}{${x}}`}>
          {MATHQUILL_NULL_TOKEN} \div <Term>2</Term>
        </Action>
        <Action transformer={(l, { x }) => `(${l})^{${x}}`}>
          (\ellipsis)^<Term>2</Term>
        </Action>
        <Action transformer={(l, { x }) => `\\sqrt[${x}]{${l}}`}>
          \sqrt[<Term>2</Term>]{'{\\ellipsis}'}
        </Action>
      </XStack>
    </YStack>
  )
}
