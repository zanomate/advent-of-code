import { bitsToString, stringToBits } from '../../utils/boolean'
import { readFile } from '../../utils/io'
import { DaySolution } from '../../utils/type'

interface Disc {
  positions: number
  start: number
}

const evolveSequence = (prev: boolean[]) => [...prev, false, ...prev.toReversed().map((v) => !v)]

const computeChecksum = (sequence: boolean[]) => {
  const pairs = Array.from({ length: sequence.length / 2 }, (_, i) => [
    sequence[2 * i],
    sequence[2 * i + 1],
  ])
  const checksum = pairs.map(([a, b]) => a === b)
  if (checksum.length % 2 === 1) return checksum
  return computeChecksum(checksum)
}

export default async function (inputFile: string): Promise<DaySolution> {
  const input = await readFile(inputFile).then((text) => text.trim())
  const initial = stringToBits(input)

  const resolve = (size: number): string => {
    let sequence = initial
    while (sequence.length < size) sequence = evolveSequence(sequence).slice(0, size)
    const checksum = computeChecksum(sequence)
    return bitsToString(checksum)
  }

  const t0 = performance.now()

  const part1 = resolve(272) // 20 for sample

  const part2 = resolve(35651584)

  const t1 = performance.now()

  return [part1, part2, t1 - t0]
}
