import { MathQuillText } from '@t4/ui'
import React from 'react'
import { MathSimplifiableExpression } from './MathSimplifiableExpression'
import { MATHQUILL_NULL_TOKEN, MathQuillTextProps } from './MathQuillText'
import {
  distribute,
  matchingPairParts,
  matchingPairPattern,
  numPattern,
  OpType,
  replacer,
  RxMatch,
  symbolPattern,
  tidy,
  unwrapBracketPair,
} from './latexutil'
import { rx, Rx } from './rx'

const sumNumPattern = rx`(?:[+-]\s*)?(?<![\.\d])\d+(?:\.\d+)?`
const asNumber = (x: string) => parseFloat(x.replace(/^\s*([+-])\s*/, '$1'))
const constSumPattern = rx`(?<!(?:\^|\\times)\s*)(${sumNumPattern})\s*([+-])\s*(${sumNumPattern})(?!\s*(?:\^|\\times))`
const constProductPattern = rx`(?<!\^\s*)(${numPattern})\s*\\times\s*(${numPattern})(?!\s*\^)`

export type MathSimplifyHandlerProps = MathQuillTextProps & {
  latex: string
  replaceHandler(latex: string): void
}

export function MathSimplifyHelper({ latex, replaceHandler, ...props }: MathSimplifyHandlerProps) {
  let parts: {
    srcIdx: number
    element: string | React.ReactElement
  }[] = [{ srcIdx: 0, element: latex }]

  function replace(pattern: RegExp | Rx, replacement: (ctx: RxMatch) => string) {
    parts = parts.flatMap(({ srcIdx, element }) => {
      if (typeof element === 'string') {
        const matches = element.matchAll(pattern instanceof Rx ? pattern.regex() : pattern)
        const result: typeof parts = []
        let idx = 0
        for (const match of matches) {
          result.push({ srcIdx: srcIdx + idx, element: element.substring(idx, match.index) })
          const replaceAt = srcIdx + match.index
          const replaceLength = match[0].length
          const replaceWith = replacer(replacement)(match)
          result.push({
            srcIdx: replaceAt,
            element: (
              <MathSimplifiableExpression
                key={match[0]}
                {...props}
                replaceContent={tidy(replaceWith)}
                replaceHandler={() => {
                  replaceHandler(
                    latex.substring(0, replaceAt) +
                      replaceWith +
                      latex.substring(replaceAt + replaceLength)
                  )
                }}
              >
                {replaceAt > 0 ? MATHQUILL_NULL_TOKEN : null}
                {match[0]}
              </MathSimplifiableExpression>
            ),
          })
          idx = match.index + replaceLength
        }
        result.push({ srcIdx: srcIdx + idx, element: element.substring(idx) })
        return result
      } else {
        return [{ srcIdx, element }]
      }
    })
  }

  replace(
    constSumPattern,
    ([_, a, op, b]) => `+ ${asNumber(a) + asNumber(b) * (op === '-' ? -1 : 1)}`
  )
  replace(constProductPattern, ([_, a, b]) => `${asNumber(a) * asNumber(b)}`)
  replace(
    rx`(${numPattern}?\s*(?:${symbolPattern}\s*)*)\\times\s*(${matchingPairPattern})`,
    ([_, coefficient, term]) => {
      const { begin, end, pair } = matchingPairParts(term)
      return `${begin}\\left(${distribute(
        OpType.PRODUCT,
        coefficient,
        pair.replace(unwrapBracketPair.regexFull(), '$1')
      )}\\right)${end}`
    }
  )
  // replace(differencePattern.regex(), ([_, a, b]) => `${parseFloat(a) - parseFloat(b)}`);

  return <MathQuillText {...props}>{...parts.map((x) => x.element).filter((x) => x)}</MathQuillText>
}
