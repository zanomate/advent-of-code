import { readFile } from '../../utils/io'
import { DaySolution } from '../../utils/type'
import { cloneDeep, first, last, sum } from 'lodash'

interface Light {
  index: number
  target: boolean
}

interface Button {
  index: number
  switches: number[]
}

interface Machine {
  index: number
  lights: Light[]
  buttons: Button[]
  joltage: number[]
}

interface LightsState {
  lights: boolean[]
  pressed: number
  lastPressed: number
}

function tryButtonsForLights(machine: Machine, state: LightsState): LightsState[] {
  let newInstances: LightsState[] = []
  for (const button of machine.buttons.slice(state.lastPressed + 1)) {
    const newState: LightsState = cloneDeep(state)
    newState.pressed += 1
    newState.lastPressed = button.index
    for (const lightIndex of button.switches) {
      newState.lights[lightIndex] = !newState.lights[lightIndex]
    }
    newInstances.push(newState)
  }
  return newInstances
}

function turnOnMachine(machine: Machine): number {
  const initialState: LightsState = {
    lights: Array(machine.lights.length).fill(false),
    pressed: 0,
    lastPressed: -1,
  }
  let best = Infinity
  const queue: LightsState[] = [initialState]
  while (queue.length) {
    const state = queue.shift()!
    if (state.pressed < best) {
      if (machine.lights.every((light, index) => light.target === state.lights[index])) {
        best = state.pressed
      } else {
        queue.push(...tryButtonsForLights(machine, state))
      }
    }
  }
  return best
}

function resolvePart1(machines: Machine[]) {
  return machines.reduce((tot, machine) => tot + turnOnMachine(machine), 0)
}

// This function was taken from https://github.com/Nathan-Fenner/adventofcode/blob/main/day10.ts
const configureJoltage = (machine: Machine) => {
  let best = 1 / 0

  const solveFrom = (state: readonly number[], sofar: number, buttons: Button[]): void => {
    let stepsLeft = 0
    for (let i = 0; i < state.length; i++) {
      if (state[i] < 0) {
        return
      }
      stepsLeft = Math.max(stepsLeft, state[i])
    }

    if (stepsLeft === 0) {
      best = Math.min(best, sofar)
      return
    }

    if (sofar + stepsLeft >= best) {
      return
    }

    const pressButton = (button: Button): number[] => {
      const toggle = [...state]
      for (const v of button.switches) {
        toggle[v] -= 1
      }
      return toggle
    }

    // Is there a button we HAVE to press?
    for (let i = 0; i < state.length; i++) {
      for (let j = 0; j < state.length; j++) {
        if (state[i] > state[j]) {
          // Is this "special".
          const usefulButtons = buttons.filter(
            (b) => b.switches.includes(i) && !b.switches.includes(j),
          )
          if (usefulButtons.length === 0) {
            return
          }
          if (usefulButtons.length === 1) {
            // We must press it!
            solveFrom(pressButton(usefulButtons[0]), sofar + 1, buttons)
            return
          }
        }
      }
    }

    for (let buttonIndex = 0; buttonIndex < buttons.length; buttonIndex++) {
      const button = buttons[buttonIndex]
      const toggled = [...state]
      for (const v of button.switches) {
        toggled[v] -= 1
      }
      solveFrom(toggled, sofar + 1, buttons.slice(buttonIndex))
    }
  }

  solveFrom(machine.joltage, 0, machine.buttons)

  return best
}

function resolvePart2(machines: Machine[]) {
  const solutions = machines.map((machine) => {
    return configureJoltage(machine)
  })

  return sum(solutions)
}

export default async function (inputFile: string): Promise<DaySolution> {
  const input = await readFile(inputFile)
  const machines: Machine[] = input.split('\n').map((line, index) => {
    const parts = line.split(' ')
    const lights = first(parts)!
      .slice(1, -1)
      .split('')
      .map((state, index) => ({ index, target: state === '#' }) as Light)
    const buttons = parts
      .slice(1, -1)
      .map((part) => part.slice(1, -1).split(',').map(Number))
      .sort((switches1, switches2) => switches2.length - switches1.length)
      .map(
        (switches, index) =>
          ({
            index,
            switches,
          }) as Button,
      )
      .sort((a, b) => b.switches.length - a.switches.length)
    const joltage = last(parts)!.slice(1, -1).split(',').map(Number)
    return {
      index,
      lights,
      buttons,
      joltage,
    }
  })

  const t0 = performance.now()

  let part1 = resolvePart1(machines)
  let part2 = resolvePart2(machines)

  const t1 = performance.now()

  return [part1, part2, t1 - t0]
}
