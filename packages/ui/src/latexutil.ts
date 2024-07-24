import { rx, Rx, Slice } from './rx'

const sumOp = rx`[+-]|\\pm`
const multOp = rx`\\times`
const weakerThanMultOp = Rx.union(sumOp, multOp)
export const symbolPattern = rx`[a-zA-Z](?:_\w+)?|\\(?:pi|theta)`
export const numPattern = rx`-?(?<![\.\d])\d+(?:\.\d+)?`
export const lParen = rx`(?:\\left)?\(`
export const rParen = rx`(?:\\right)?\)`
export const unwrapBracketPair = rx`${lParen}(.*)${rParen}`
export const matchingPairPattern = Rx.variants(
  ({ l, r }) => rx`${l}.*${r}`,
  { l: lParen, r: rParen },
  { l: '\\{', r: '\\}' },
  { l: '\\[', r: '\\]' }
)
const frac = (a: Rx, b: Rx) =>
  Rx.union(
    rx`\\frac\{${a.group('a')}\}\{${b.group('b')}\}`,
    rx`(?<!\^\s*)${a.group('a')}\s*\\div\s*${b.group('b')}(?!\s*\^)`,
    rx`${lParen}\s*${a.group('a')}\s*\\div\s*${b.group('b')}\s*${rParen}`
  )
// export const productPattern = rxUnion(
//   rx`(?<!\^\s*)(?<term>${matchingPairPattern}|${symbolPattern})\s*\\times\s*(?<coefficient>${numPattern})(?!\s*\^)`,
//   rx`(?<!\^\s*)(?<coefficient>${numPattern})\s*\\times\s*(?<term>${matchingPairPattern}|${symbolPattern})(?!\s*\^)`
// )

const LEFT_BRACKET_PREFIX = '\\left'
const RIGHT_BRACKET_PREFIX = '\\right'
function widestMatching(input: string, startIdx = 0): Slice {
  const stack: { chr: '(' | '{' | '['; idx: number }[] = []
  let openIdx = startIdx
  let closeIdx: number | undefined = undefined
  for (let idx = startIdx; idx < input.length; idx++) {
    const chr = input[idx]
    if (chr === '(' || chr === '{' || chr === '[') {
      stack.unshift({
        chr,
        idx: input.substring(0, idx).endsWith(LEFT_BRACKET_PREFIX)
          ? idx - LEFT_BRACKET_PREFIX.length
          : idx,
      })
    } else if (chr === ')' || chr === '}' || chr === ']') {
      while ({ '(': ')', '{': '}', '[': ']' }[stack[0].chr] !== chr && stack) {
        stack.shift() // Remove mismatching brackets??
      }
      if (!stack.length) {
        return new Slice(openIdx, (closeIdx ?? idx) + 1)
      }
      // biome-ignore lint/style/noNonNullAssertion: length check above
      openIdx = stack.shift()!.idx
      if (!stack.length) {
        return new Slice(openIdx, idx + 1)
      }
      closeIdx = idx
    }
  }
  return new Slice(openIdx, (closeIdx ?? input.length - 1) + 1)
}
export function matchingPairParts(input: string) {
  const bounds = widestMatching(input)
  const [begin, end] = input.split(bounds)
  // biome-ignore lint/style/noNonNullAssertion: slice always matches
  const pair = input.match(bounds)![0]
  return { begin, end, pair }
}

export type RxMatch = string[] & { [key: string]: string } & { index: number }
export function replacer<T extends RxMatch>(replacer: (match: T) => string) {
  return (...args: [string, ...any[]] | [RegExpExecArray | RegExpMatchArray]) => {
    if (typeof args[0] === 'object') {
      const result = args[0]
      for (const [k, v] of Object.entries(result.groups ?? {})) result[k] = v
      return replacer(result as unknown as T)
    }
    const groups = typeof args[args.length - 1] === 'object' ? args.pop() : {}
    const matchLength = args.pop()
    const index = args.pop()
    const result = [...args] as string[]
    const objResult = { ...groups, index, matchLength }
    for (const [k, v] of Object.entries(objResult)) result[k] = v
    return replacer(result as typeof result & typeof objResult)
  }
}

export enum OpType {
  SUM = 0,
  PRODUCT = 1,
  EXPONENT = 2,
}
export function distribute(op: OpType, distributeTerm: string, over: string) {
  switch (op) {
    case OpType.PRODUCT: {
      let parenTerms: Set<number> = new Set()
      {
        let i = 0
        while (over.includes('(', i)) {
          const bounds = widestMatching(over, i)
          i = bounds.end
          parenTerms = parenTerms.union(new Set(bounds))
        }
      }
      const termBoundaries = over.matchAll(sumOp.regex())
      let result = ''
      let i = 0
      while (true) {
        const { value: boundary, done } = termBoundaries.next()
        if (done) break
        if (parenTerms.has(boundary.index)) continue
        result += `${distributeTerm} \\times ${over.substring(i, boundary.index)}`
        result += boundary[0]
        i = boundary.index + boundary.length
      }
      result += `${distributeTerm} \\times ${over.substring(i)}`
      if (result.endsWith(RIGHT_BRACKET_PREFIX))
        result = result.substring(0, result.length - RIGHT_BRACKET_PREFIX.length)
      return result
    }
  }
}

export function tidy(latex: string) {
  let result = latex.trim()
  result = result.replace(
    rx`(?<=^|${weakerThanMultOp}\s*)(${numPattern}?${symbolPattern}*${matchingPairPattern})\s*\\times\s*(${numPattern}?${symbolPattern}*)`,
    replacer(([_, group, term]) => `${term} \\times ${group}`)
  )
  // result = result.replaceAll(
  //   productPattern.regex(),
  //   replacer(({ term, coefficient }) => term.replace(widestMatching(term), `${coefficient}$0`))
  // )
  // Roots
  result = result.replace(
    rx`(?<base>${matchingPairPattern}|${numPattern}|${symbolPattern})\s*\^\s*${frac(
      rx`0*1(?:\.0+)?`,
      rx`[^}]*`
    )}`,
    replacer(({ base, b }) => {
      const { begin, end, pair } = matchingPairParts(base)
      return `${begin}\\sqrt${parseFloat(b) === 2 ? '' : `[${b}]`}{${pair}}${end}`
    })
  )
  // Redundant brackets
  result = result.replace(
    rx`(?<=^|${sumOp}\s*)${lParen}[^+-]${rParen}(?=$|\s*${sumOp})`,
    replacer(({ base, b }) => {
      const { begin, end, pair } = matchingPairParts(base)
      return `${begin}\\sqrt${parseFloat(b) === 2 ? '' : `[${b}]`}{${pair}}${end}`
    })
  )
  // Double operators
  result = result.replaceAll(/([+-])\s*\1/g, '+')
  result = result.replaceAll(/[+-]\s*[+-]/g, '-')
  // Leading +
  result = result.replaceAll(/(^|[[{(])\s*\+/g, '$1')
  // +/- 0
  result = result.replaceAll(/(?:[+-]|^)\s*0+(?:\.0+)?(\s*[+-]|$)/g, '$1')
  return result
}
