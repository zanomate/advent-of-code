import { readFile } from '../../utils/io'
import { DaySolution } from '../../utils/type'

interface Buffer {
  values: number[]
  pos: number
}

function next(buffer: Buffer, steps: number, value: number): Buffer {
  let newPos = ((buffer.pos + steps) % buffer.values.length) + 1
  return {
    values: buffer.values.toSpliced(newPos, 0, value),
    pos: newPos,
  }
}

export default async function (inputFile: string): Promise<DaySolution> {
  const input = await readFile(inputFile).then((text) => text.trim())
  const steps = Number(input)

  const t0 = performance.now()

  let buffer: Buffer = { values: [0], pos: 0 }
  for (let i = 1; i <= 2017; i++) {
    buffer = next(buffer, steps, i)
  }

  const part1 = buffer.values[buffer.pos + 1]

  let i = 0
  let pos = 0
  let res = null

  function advance() {
    pos = ((pos + steps) % (i + 1)) + 1
    i++
  }

  function advanceUntilPos0() {
    do {
      advance()
    } while (pos !== 1)
  }

  while (i < 50_000_000) {
    advanceUntilPos0()
    if (i < 50_000_000) {
      res = i
    }
  }

  const part2 = res

  const t1 = performance.now()

  return [part1, part2, t1 - t0]
}
