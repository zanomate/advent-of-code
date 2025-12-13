import { readFile } from '../../utils/io'
import { DaySolution } from '../../utils/type'
import { last, sum } from 'lodash'

interface Tree {
  width: number
  height: number
  shapes: number[]
}

function resolvePart1(trees: Tree[]) {
  return trees.filter((tree) => {
    const area = tree.width * tree.height
    return sum(tree.shapes) * 9 <= area
  }).length
}

export default async function (inputFile: string): Promise<DaySolution> {
  const input = await readFile(inputFile)
  const blocks = input.split('\n\n')
  const trees: Tree[] = last(blocks)!
    .split('\n')
    .map((line) => {
      const [size, shapesBlock] = line.split(': ')
      const [width, height] = size.split('x').map(Number)
      const shapes = shapesBlock.split(' ').map((s) => Number(s))
      return { width, height, shapes }
    })

  const t0 = performance.now()

  let part1 = resolvePart1(trees)
  let part2 = null

  const t1 = performance.now()

  return [part1, part2, t1 - t0]
}
