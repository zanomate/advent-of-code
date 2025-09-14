export type BooleanChar = '0' | '1'

export interface Configuration<State> {
  cursor: number
  state: State
}

export interface Action<State, Char = BooleanChar> {
  nextState: State
  write?: Char
  move?: number
}

export type TransitionFn<State, Char> = (state: State, input: Char) => Action<State, Char>

export class Tape<Value> {
  defaultValue: Value
  positive: Value[] = []
  negative: Value[] = []

  constructor(defaultValue: Value) {
    this.defaultValue = defaultValue
    this.negative.push(defaultValue) // negative[0] will never be used
  }

  extend(index: number) {
    if (index >= 0) {
      while (index >= this.positive.length) this.positive.push(this.defaultValue)
    } else {
      while (Math.abs(index) >= this.negative.length) this.negative.push(this.defaultValue)
    }
  }

  get values(): Value[] {
    return [...this.negative.slice(1).reverse(), ...this.positive]
  }

  get(index: number) {
    this.extend(index)
    if (index >= 0) return this.positive[index]
    return this.negative[Math.abs(index)]
  }

  set(index: number, value: Value) {
    this.extend(index)
    if (index >= 0) this.positive[index] = value
    else this.negative[Math.abs(index)] = value
  }
}

export class TuringMachine<State, Char> {
  tape: Tape<Char>
  transitionsFn: TransitionFn<State, Char>
  current: Configuration<State>

  constructor(
    initial: Configuration<State>,
    defaultChar: Char,
    transitionFn: TransitionFn<State, Char>,
  ) {
    this.tape = new Tape<Char>(defaultChar)
    this.transitionsFn = transitionFn
    this.current = initial
  }

  evolve() {
    const input = this.tape.get(this.current.cursor)
    const action = this.transitionsFn(this.current.state, input)
    if (action.write) this.tape.set(this.current.cursor, action.write)
    if (action.move) this.current.cursor += action.move
    this.current.state = action.nextState
  }
}
