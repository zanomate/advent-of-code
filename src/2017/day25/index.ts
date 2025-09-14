import { readFile } from '../../utils/io'
import { DaySolution } from '../../utils/type'
import { parseRegex } from '../../utils/regex'
import { chunkArray } from '../../utils/array'
import {
  Action,
  Configuration,
  TransitionFn,
  TuringMachine,
} from '../../utils/computer/turingMachine'

type Bool = '0' | '1'

function key(state: string, value: Bool) {
  return `${state}-${value}`
}

function parseAction(lines: string[]): Action<string, Bool> {
  const [write] = parseRegex<[Bool]>(lines[0], /\s+- Write the value (\d+)./)
  const [move] = parseRegex<['left' | 'right']>(lines[1], /\s+- Move one slot to the (left|right)./)
  const [nextState] = parseRegex(lines[2], /\s+- Continue with state (\w+)./)
  return {
    write,
    move: move === 'left' ? -1 : 1,
    nextState,
  }
}

export default async function (inputFile: string): Promise<DaySolution> {
  const input = await readFile(inputFile).then((text) => text.trim())
  const lines = input.split('\n')
  const [initialState] = parseRegex(lines[0], /Begin in state (\w)./)
  const [steps] = parseRegex(lines[1], /Perform a diagnostic checksum after (\d+) steps./)

  const transitions = new Map<string, Action<string, Bool>>()
  chunkArray(lines.slice(3), 10).forEach((chunk) => {
    const [fromState] = parseRegex(chunk[0], /In state (\w):/)
    const actionFrom0 = parseAction(chunk.slice(2, 5))
    const actionFrom1 = parseAction(chunk.slice(6, 9))
    transitions.set(key(fromState, '0'), actionFrom0)
    transitions.set(key(fromState, '1'), actionFrom1)
  })

  const initialConfig: Configuration<string> = { state: initialState, cursor: 0 }
  const transitionFn: TransitionFn<string, Bool> = (state, input) => {
    return transitions.get(key(state, input))!
  }
  const tm = new TuringMachine<string, Bool>(initialConfig, '0', transitionFn)

  const t0 = performance.now()

  let i = 0
  tm.tape.extend(-3)
  tm.tape.extend(3)
  while (i++ < Number(steps)) tm.evolve()

  const part1 = tm.tape.values.filter((c) => c === '1').length

  const t1 = performance.now()

  return [part1, null, t1 - t0]
}
