import { readFile, readNumericParameter } from '../../utils/io'
import { DaySolution } from '../../utils/type'
import { Square } from '../../utils/space/Square'

type Cell = '#' | '.'

function toLine(square: Square<Cell>) {
  return square.cells.map((row) => row.join('')).join('/')
}

function fromLine(line: string): Square<Cell> {
  const lines = line.split('/')
  const values = lines.map((line) => line.split('')) as Cell[][]
  return Square.fromValues<Cell>(values)
}

function findVariants(line: string): string[] {
  const square = fromLine(line)
  return [
    line,
    toLine(square.flipX()),
    toLine(square.rotate()),
    toLine(square.rotate().flipX()),
    toLine(square.rotate().rotate()),
    toLine(square.rotate().rotate().flipX()),
    toLine(square.rotate().rotate().rotate()),
    toLine(square.rotate().rotate().rotate().flipX()),
  ]
}

export default async function (file: string, parameters: string[]): Promise<DaySolution> {
  const iterations1 = readNumericParameter('iterations1', parameters[0])
  const iterations2 = readNumericParameter('iterations2', parameters[1])
  const input = await readFile(file).then((text) => text.trim())

  const rules = new Map<string, string>()
  input.split('\n').forEach((line) => {
    const [from, to] = line.split(' => ')
    findVariants(from).forEach((variant) => {
      rules.set(variant, to)
    })
  })

  const evolvePart = (part: Square<Cell>): Square<Cell> => {
    const line = toLine(part)
    const newLine = rules.get(line)
    if (!newLine) throw new Error(`line ${line} not found`)
    return fromLine(newLine)
  }

  const evolvePattern = (pattern: Square<Cell>): Square<Cell> => {
    let parts = []
    if (pattern.size % 2 === 0) {
      parts = pattern.split(2)
    } else if (pattern.size % 3 === 0) {
      parts = pattern.split(3)
    } else {
      return pattern
    }

    for (let y = 0; y < parts.length; y++) {
      for (let x = 0; x < parts[0].length; x++) {
        parts[y][x] = evolvePart(parts[y][x])
      }
    }

    return Square.compose(parts)
  }

  let iterations = 0
  let pattern = fromLine('.#./..#/###')

  const t0 = performance.now()

  while (iterations < iterations1) {
    pattern = evolvePattern(pattern)
    iterations++
  }

  const part1 = pattern.values.filter((v) => v === '#').length

  while (iterations < iterations2) {
    pattern = evolvePattern(pattern)
    iterations++
  }

  const part2 = pattern.values.filter((v) => v === '#').length

  const t1 = performance.now()

  return [part1, part2, t1 - t0]
}
