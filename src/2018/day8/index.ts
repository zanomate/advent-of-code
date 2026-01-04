import { readFile } from '../../utils/io'
import { DaySolution } from '../../utils/type'
import { sum } from 'lodash'

interface TreeNode {
  index: number
  children: TreeNode[]
  metadata: number[]
}

function parseTree(index: number, numbers: number[]): TreeNode {
  const childCount = numbers.shift()!
  const metadataCount = numbers.shift()!
  const children: TreeNode[] = []
  for (let i = 0; i < childCount; i++) {
    children.push(parseTree(i, numbers))
  }
  let metadata: number[] = []
  for (let i = 0; i < metadataCount; i++) {
    metadata.push(numbers.shift()!)
  }
  return {
    index: index + 1,
    children,
    metadata,
  }
}

function sumMetadataOf(node: TreeNode): number {
  return sum(node.metadata) + sum(node.children.map(sumMetadataOf))
}

function valueOf(node: TreeNode): number {
  const childrenCount = node.children.length
  if (childrenCount === 0) return sum(node.metadata)
  return sum(
    node.metadata
      .filter((n) => n <= childrenCount)
      .map((n) => {
        return valueOf(node.children[n - 1])
      }),
  )
}

function resolvePart1(tree: TreeNode): number {
  return sumMetadataOf(tree)
}

function resolvePart2(tree: TreeNode): number {
  return valueOf(tree)
}

export default async function (inputFile: string, parameters: string[]): Promise<DaySolution> {
  const input = await readFile(inputFile).then((text) => text.trim())
  const numbers = input.split(' ').map(Number)
  const tree = parseTree(0, numbers)

  const t0 = performance.now()

  const part1 = resolvePart1(tree)
  const part2 = resolvePart2(tree)

  const t1 = performance.now()

  return [part1, part2, t1 - t0]
}
