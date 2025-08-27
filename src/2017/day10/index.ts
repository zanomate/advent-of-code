import { readFile } from '../../utils/io'
import { DaySolution } from '../../utils/type'

function reverse(list: number[], from: number, length: number) {
  if (length > list.length) {
    throw new Error(`length ${length} is invalid`)
  }

  const copyList = Array.from({ length }, (_, i) => list[(from + i) % list.length])
  copyList.reverse().forEach((v, i) => {
    list[(from + i) % list.length] = v
  })
}

function resolvePart1(input: string) {
  const lengths = input.split(',').map((s) => parseInt(s))

  const list = Array.from({ length: 256 }, (_, i) => i)
  let cursor = 0
  let skipSize = 0
  lengths.forEach((length) => {
    reverse(list, cursor, length)
    cursor += (length + skipSize) % list.length
    skipSize++
  })

  return list[0] * list[1]
}

function resolvePart2(input: string) {
  const lengths = Array.from({ length: input.length }, (_, i) => input.charCodeAt(i))
  lengths.push(17, 31, 73, 47, 23)

  // sparse hash

  const list = Array.from({ length: 256 }, (_, i) => i)
  let cursor = 0
  let skipSize = 0

  for (let round = 0; round < 64; round++) {
    lengths.forEach((length) => {
      reverse(list, cursor, length)
      cursor += (length + skipSize) % list.length
      skipSize++
    })
  }

  // dense hash
  const dense = Array.from({ length: 16 }, (_, i) => {
    const block = list.slice(16 * i, 16 * (i + 1))
    return block.reduce((acc, num) => acc ^ num, 0)
  }).map((num) => num.toString(16).padStart(2, '0'))

  return dense.join('')
}

export default async function (inputFile: string): Promise<DaySolution> {
  const input = await readFile(inputFile).then((text) => text.trim())

  const t0 = performance.now()

  const part1 = resolvePart1(input)

  const part2 = resolvePart2(input)

  const t1 = performance.now()

  return [part1, part2, t1 - t0]
}
