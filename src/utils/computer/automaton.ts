export type TransitionFn<State, Input> = (state: State, input: Input) => State

export class FSA<State, Input> {
  current: State
  transitionsFn: TransitionFn<State, Input>

  constructor(initialState: State, transitionsFn: TransitionFn<State, Input>) {
    this.current = initialState
    this.transitionsFn = transitionsFn
  }

  evolve(input: Input) {
    this.current = this.transitionsFn(this.current, input)
  }
}
