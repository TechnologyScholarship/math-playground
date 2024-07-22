type RxList = (Rx | Rx[])[]
export class Rx {
  _regexFull?: RegExp
  _regex?: RegExp
  src: string
  constructor(src: string) {
    this.src = src
  }
  test(str: string): boolean {
    return this.regex().test(str)
  }
  testFull(str: string): boolean {
    return this.regexFull().test(str)
  }
  regex(): RegExp {
    if (!this._regex) this._regex = new RegExp(this.src, 'g')
    return this._regex
  }
  regexFull(): RegExp {
    if (!this._regexFull) this._regexFull = new RegExp(`^${this.src}$`, 'g')
    return this._regexFull
  }
  group(name?: string) {
    return new Rx(name ? `(?<${name}>${this.src})` : `(${this.src})`)
  }
  repeat(min = 1, max = -1) {
    let modifier = ''
    if (min === 1 && max === 1) modifier = ''
    else if (min === 0 && max === -1) modifier = '*'
    else if (min === 1 && max === -1) modifier = '+'
    else if (min === 0 && max === 1) modifier = '?'
    else if (min === max) modifier = `{${min}}`
    else if (max === -1) modifier = `{${min},}`
    else modifier = `{${min},${max}}`
    return new Rx(`(?:${this.src})${modifier}`)
  }
  optional() {
    return this.repeat(0, 1)
  }
  optionalRepeat() {
    return this.repeat(0)
  }
  repeatExactly(times: number) {
    return this.repeat(times, times)
  }
  repeatAtleast(times: number) {
    return this.repeat(times)
  }
  [Symbol.replace](value: string, replacement) {
    return value.replaceAll(this.regex(), replacement)
  }
  [Symbol.match](value: string) {
    return value.match(this.regex())
  }
  [Symbol.matchAll](value: string) {
    return value.matchAll(this.regex())
  }
  static union(...options: RxList) {
    return options.flat().reduce((a, b) => rx`${a}|${b}`)
  }
  static variants<T>(mapper: (value: T) => Rx, ...variants: T[]) {
    return Rx.union(...variants.map(mapper))
  }
  static concat(...patterns: RxList) {
    return patterns.flat().reduce((a, b) => rx`${a}${b}`)
  }
}

export function rx(
  template: { raw: readonly string[] | ArrayLike<string> },
  ...substitutions: (Rx | string)[]
): Rx {
  return new Rx(
    String.raw(
      template,
      ...substitutions.map((rx) => `(?:${typeof rx === 'string' ? rx : rx.src})`)
    )
  )
}

export class Slice implements Iterable<number> {
  start: number
  end: number
  constructor(start, end) {
    this.start = start
    this.end = end
  }
  [Symbol.isConcatSpreadable] = true;
  *[Symbol.iterator]() {
    for (let i = this.start; i < this.end; i++) {
      yield i
    }
  }
  [Symbol.replace](
    value: string,
    replace:
      | string
      | ((match: string, index: number, length: number, groups: NonNullable<null>) => string)
  ) {
    return (
      value.substring(0, this.start) +
      value
        .substring(this.start, this.end)
        .replaceAll(/^(?:.|\s)*$/g, typeof replace === 'string' ? () => replace : replace) +
      value.substring(this.end)
    )
  }
  [Symbol.split](value: string) {
    return [value.substring(0, this.start), value.substring(this.end)]
  }
  [Symbol.match](value: string): RegExpMatchArray {
    return [value.substring(this.start, this.end)]
  }
}
