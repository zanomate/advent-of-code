import { readFile } from '../../utils/io'
import { getCombinations } from '../../utils/math'
import { Grid } from '../../utils/space/Grid'
import { Pos } from '../../utils/space/Pos'

interface Equation {
  solution: number
  values: number[]
}

function findSolution(result: number, values: number[], enableConcat: boolean): number | null {
  const [firstValue, ...otherValues] = values
  if (otherValues.length === 0) {
    return firstValue === result ? result : null
  }
  const [secondValue, ...remainingValues] = otherValues
  const tryAdd = findSolution(result, [firstValue + secondValue, ...remainingValues], enableConcat)
  if (tryAdd != null) return result
  const tryMul = findSolution(result, [firstValue * secondValue, ...remainingValues], enableConcat)
  if (tryMul != null) return result
  if (enableConcat) {
    const tryConcat = findSolution(result, [parseInt(`${firstValue}${secondValue}`), ...remainingValues], enableConcat)
    if (tryConcat != null) return result
  }
  return null
}

export default async function () {
  const input = await readFile('./src/2024/day7/input.txt').then((text) => text.trim())
  const equations: Equation[] = input
    .split('\n')
    .map((line) => line.match(/(\d+):\s(.+)/))
    .map((match) => {
      if (match === null) throw new Error('Invalid input')
      const solution = parseInt(match[1])
      const values = match[2].split(' ').map((value) => parseInt(value))
      return { solution, values }
    })

  const t0 = performance.now()

  const part1 = equations
    .filter(({ solution, values }) => findSolution(solution, values, false) != null)
    .reduce((tot, { solution }) => tot + solution, 0)

  const part2 = equations
    .filter(({ solution, values }) => findSolution(solution, values, true) != null)
    .reduce((tot, { solution }) => tot + solution, 0)

  const t1 = performance.now()

  console.log('Part 1:', part1)
  console.log('Part 2:', part2)
  console.log('Time (ms):', t1 - t0)
}
