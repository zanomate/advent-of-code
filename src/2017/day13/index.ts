import { readFile } from '../../utils/io'
import { DaySolution } from '../../utils/type'

interface Scanner {
  depth: number
  range: number
}

function stepsOf(scanner: Scanner): number {
  return 2 + 2 * (scanner.range - 2)
}

function caught(scanners: Scanner[], startAt: number): Scanner[] {
  return scanners.filter((scanner) => (startAt + scanner.depth) % stepsOf(scanner) === 0)
}

function severity(scanners: Scanner[], startAt: number): number {
  return caught(scanners, startAt).reduce((tot, scanner) => tot + scanner.depth * scanner.range, 0)
}

export default async function (inputFile: string): Promise<DaySolution> {
  const input = await readFile(inputFile).then((text) => text.trim())
  const lines = input.split('\n')
  const scanners: Scanner[] = lines.map((line) => {
    const [n1, n2] = line.split(': ')
    return {
      depth: Number(n1),
      range: Number(n2),
    }
  })

  const t0 = performance.now()

  const part1 = severity(scanners, 0)

  let delay = 1
  while (caught(scanners, delay).length) delay++

  const part2 = delay

  const t1 = performance.now()

  return [part1, part2, t1 - t0]
}
