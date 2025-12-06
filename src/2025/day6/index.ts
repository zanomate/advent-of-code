import { readFile } from '../../utils/io'
import { DaySolution } from '../../utils/type'
import { last } from 'lodash'

interface Problem {
  operands: number[]
  operator: string
}

function readInputV1(input: string): Problem[] {
  const data: string[][] = input.split('\n').map((line) => line.trim().split(/\s+/))
  return Array.from({ length: data[0].length }, (_, i) => {
    const operands = data.slice(0, -1).map((line) => Number(line[i]))
    const operator = data[data.length - 1][i]
    return { operands, operator }
  })
}

function readInputV2(input: string): Problem[] {
  const lines = input.split('\n')

  const problems: Problem[] = []
  let cols: string[] = []
  for (let i = lines[0].length - 1; i >= 0; i--) {
    let col = lines.map((line) => line[i]).join('')
    const isColEmpty = col.trim() === ''

    if (!isColEmpty) cols.push(col)

    if (i == 0 || isColEmpty) {
      const operator = last(cols)!.slice(-1)
      cols[cols.length - 1] = last(cols)!.slice(0, -1)
      const operands = cols.map((c) => Number(c.trim()))
      const problem = {
        operands,
        operator,
      }
      problems.push(problem)
      cols = []
    }
  }

  return problems
}

function resolveProblem(problem: Problem): number {
  const [first, ...rest] = problem.operands
  let res = first
  rest.forEach((operand) => {
    switch (problem.operator) {
      case '+':
        res += operand
        break
      case '*':
        res *= operand
        break
    }
  })
  return res
}

function getProblemsGrandTotal(problems: Problem[]): number {
  return problems.reduce((tot, problem) => {
    return tot + resolveProblem(problem)
  }, 0)
}

function resolvePart1(input: string): number {
  const problems = readInputV1(input)
  return getProblemsGrandTotal(problems)
}

function resolvePart2(input: string): number {
  const problems = readInputV2(input)
  return getProblemsGrandTotal(problems)
}

export default async function (inputFile: string): Promise<DaySolution> {
  const input = await readFile(inputFile)

  const t0 = performance.now()

  let part1 = resolvePart1(input)
  let part2 = resolvePart2(input)

  const t1 = performance.now()

  return [part1, part2, t1 - t0]
}
