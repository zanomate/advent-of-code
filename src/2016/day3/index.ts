import { chunkArray } from '../../utils/array'
import { readFile } from '../../utils/io'
import { DaySolution } from '../../utils/type'

export default async function (inputFile: string): Promise<DaySolution> {
  const input = await readFile(inputFile).then((text) => text.trim())
  const allNums: number[][] = input.split('\n').map((line) =>
    line
      .trim()
      .split(/\s+/)
      .map((side) => parseInt(side)),
  )

  const t0 = performance.now()

  const valid1 = allNums.filter((sides) => {
    const biggerSide = Math.max(...sides)
    const otherSides = sides.toSpliced(sides.indexOf(biggerSide), 1)
    const sumOtherSide = otherSides[0] + otherSides[1]
    return biggerSide < sumOtherSide
  })

  const allNumsChunks = chunkArray(allNums, 3)
  const trianglesByCol: number[][] = allNumsChunks.flatMap((chunk) => [
    [chunk[0][0], chunk[1][0], chunk[2][0]],
    [chunk[0][1], chunk[1][1], chunk[2][1]],
    [chunk[0][2], chunk[1][2], chunk[2][2]],
  ])

  const valid2 = trianglesByCol.filter((sides) => {
    const biggerSide = Math.max(...sides)
    const otherSides = sides.toSpliced(sides.indexOf(biggerSide), 1)
    const sumOtherSide = otherSides[0] + otherSides[1]
    return biggerSide < sumOtherSide
  })

  const part1 = valid1.length
  const part2 = valid2.length

  const t1 = performance.now()

  return [part1, part2, t1 - t0]
}
