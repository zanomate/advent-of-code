import { readFile } from '../../utils/io'
import { DaySolution } from '../../utils/type'

export default async function (inputFile: string): Promise<DaySolution> {
  const input = await readFile(inputFile).then((text) => text.trim())
  const lines = input.split('\n')
  const nums = lines.map((line) => parseInt(line))

  const t0 = performance.now()

  let cursor = 0
  let steps = 0
  let memory = [...nums]

  while (cursor >= 0 && cursor < lines.length) {
    steps++
    const offset = memory[cursor]
    memory[cursor]++
    cursor += offset
  }

  const part1 = steps

  cursor = 0
  steps = 0
  memory = [...nums]

  while (cursor >= 0 && cursor < lines.length) {
    steps++
    const offset = memory[cursor]
    if (offset >= 3) memory[cursor]--
    else memory[cursor]++
    cursor += offset
  }

  const part2 = steps

  const t1 = performance.now()

  return [part1, part2, t1 - t0]
}
