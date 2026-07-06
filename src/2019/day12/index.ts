import { readFile } from '../../utils/io'
import { DaySolution } from '../../utils/type'

type Axis = { pos: number[]; vel: number[] }

function parseMoons(input: string): number[][] {
  return input
    .trim()
    .split('\n')
    .map((line) => {
      const [x, y, z] = line.match(/-?\d+/g)!.map(Number)
      return [x, y, z]
    })
}

function gcd(a: number, b: number): number {
  return b === 0 ? a : gcd(b, a % b)
}

function lcm(a: number, b: number): number {
  return (a / gcd(a, b)) * b
}

/** Extract one axis (positions and zeroed velocities) from all moons. */
function axisOf(moons: number[][], axis: number): Axis {
  return { pos: moons.map((m) => m[axis]), vel: moons.map(() => 0) }
}

function step(state: Axis): void {
  const n = state.pos.length
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      state.vel[i] += Math.sign(state.pos[j] - state.pos[i])
    }
  }
  for (let i = 0; i < n; i++) state.pos[i] += state.vel[i]
}

function resolvePart1(moons: number[][]) {
  const axes = [0, 1, 2].map((a) => axisOf(moons, a))
  for (let s = 0; s < 1000; s++) axes.forEach(step)
  let energy = 0
  for (let i = 0; i < moons.length; i++) {
    const pot = axes.reduce((sum, ax) => sum + Math.abs(ax.pos[i]), 0)
    const kin = axes.reduce((sum, ax) => sum + Math.abs(ax.vel[i]), 0)
    energy += pot * kin
  }
  return energy
}

/** Steps until an axis returns to its initial state. */
function cycleLength(state: Axis): number {
  const initial = JSON.stringify(state)
  let steps = 0
  do {
    step(state)
    steps++
  } while (JSON.stringify(state) !== initial)
  return steps
}

function resolvePart2(moons: number[][]) {
  const cycles = [0, 1, 2].map((a) => cycleLength(axisOf(moons, a)))
  return cycles.reduce(lcm)
}

export default async function (inputFile: string): Promise<DaySolution> {
  const input = await readFile(inputFile)
  const moons = parseMoons(input)

  const t0 = performance.now()

  let part1 = resolvePart1(moons)
  let part2 = resolvePart2(moons)

  const t1 = performance.now()

  return [part1, part2, t1 - t0]
}
