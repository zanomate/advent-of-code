import { readFile } from '../../utils/io'
import { DaySolution } from '../../utils/type'

type DiskBlock = number | null

function findSpace(disk: DiskBlock[], size: number, from: number, to: number): number | null {
  let blockStart = from
  while (blockStart < to) {
    if (disk[blockStart] !== null) blockStart++
    else {
      let blockEnd = blockStart
      while (disk[blockEnd] === null) blockEnd++
      const blockLength = blockEnd - blockStart
      if (blockLength >= size) {
        return blockStart
      } else {
        blockStart = blockEnd
      }
    }
  }
  return null
}

function compactBlocks(disk: DiskBlock[]): DiskBlock[] {
  let res = [...disk]
  let blockIndex = res.length - 1
  let lastFreeIndex = 0
  while (lastFreeIndex < blockIndex) {
    if (res[blockIndex] !== null) {
      const freeIndex = findSpace(res, 1, lastFreeIndex, blockIndex)
      if (freeIndex === null) break
      const block = res.splice(blockIndex, 1)[0]
      res.splice(freeIndex, 1, block)
      lastFreeIndex = freeIndex + 1
    }
    blockIndex--
  }
  return res
}

function compactFiles(disk: DiskBlock[]): DiskBlock[] {
  let res = [...disk]
  const lastBlockId = res.findLast((b) => b !== null) ?? 0
  for (let movingId = lastBlockId; movingId >= 0; movingId--) {
    const blockStart = res.indexOf(movingId)
    const blockEnd = res.lastIndexOf(movingId)
    const blockLength = blockEnd - blockStart + 1
    const leftmostSpaceStart = findSpace(res, blockLength, 0, blockStart)
    if (leftmostSpaceStart !== null) {
      const block = res.splice(
        blockStart,
        blockLength,
        ...Array.from({ length: blockLength }, () => null),
      )
      res.splice(leftmostSpaceStart, blockLength, ...block)
    }
  }
  return res
}

function computeChecksum(disk: DiskBlock[]) {
  return disk.reduce<number>((tot, block, index) => {
    if (block === null) return tot
    return tot + index * block
  }, 0)
}

export default async function (inputFile: string): Promise<DaySolution> {
  const input = await readFile(inputFile).then((text) => text.trim())

  const t0 = performance.now()

  let disk: DiskBlock[] = input.split('').flatMap((num, index) => {
    const isBlock = index % 2 === 0
    const lastBlockId = Math.floor(index / 2)
    const length = parseInt(num)
    return isBlock ? Array.from({ length }, () => lastBlockId) : Array.from({ length }, () => null)
  })

  const disk1 = compactBlocks(disk)
  const part1 = computeChecksum(disk1)

  const disk2 = compactFiles(disk)
  const part2 = computeChecksum(disk2)

  const t1 = performance.now()

  return [part1, part2, t1 - t0]
}
