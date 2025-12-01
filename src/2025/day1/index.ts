import { readFile } from '../../utils/io'
import { DaySolution } from '../../utils/type'

interface Rotation {
  dir: number
  steps: number
}

function rotate(cursor: number, dir: number, steps: number): number {
  const shift = dir * steps
  return (cursor + shift + 100) % 100
}

function resolvePart1(rotations: Rotation[]): number {
  let cursor = 50
  let res = 0
  rotations.forEach((rotation) => {
    cursor = rotate(cursor, rotation.dir, rotation.steps)
    if (cursor === 0) res++
  })
  return res
}

function resolvePart2(rotations: Rotation[]): number {
  let cursor = 50
  let res = 0
  rotations.forEach(({ dir, steps }) => {
    // compute steps to zero
    const stepsToZero = dir === 1 ? 100 - cursor : cursor ? cursor : 100
    // if we can't reach zero in this rotation. move cursor and return
    if (steps < stepsToZero) {
      cursor = rotate(cursor, dir, steps)
      return
    }

    // otherwise, we will reach zero at least once
    res++
    cursor = 0
    // if we reach zero exactly at the end of rotation, return
    if (steps === stepsToZero) return

    // otherwise, compute remaining steps after first reach to zero
    const remainingSteps = steps - stepsToZero
    // each 100 steps we reach zero again
    res += Math.floor(remainingSteps / 100)

    // compute last steps after last reach to zero
    const lastSteps = remainingSteps % 100
    cursor = rotate(cursor, dir, lastSteps)
  })
  return res
}

export default async function (inputFile: string): Promise<DaySolution> {
  const input = await readFile(inputFile).then((text) => text.trim())
  const rotations: Rotation[] = input.split('\n').map((line) => {
    const dir = line[0] === 'L' ? -1 : 1
    const steps = parseInt(line.slice(1))
    return { dir, steps }
  })

  const t0 = performance.now()

  let part1 = resolvePart1(rotations)
  let part2 = resolvePart2(rotations)

  const t1 = performance.now()

  return [part1, part2, t1 - t0]
}
