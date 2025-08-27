import { readFile } from '../../utils/io'
import { DaySolution } from '../../utils/type'

function findGroup(from: number, connections: Map<number, number[]>): number[] {
  const group = [from]

  const explore = (node: number) => {
    connections.get(node)?.forEach((connectedNode) => {
      if (!group.includes(connectedNode)) {
        group.push(connectedNode)
        explore(connectedNode)
      }
    })
  }

  explore(from)
  return group
}

export default async function (inputFile: string): Promise<DaySolution> {
  const input = await readFile(inputFile).then((text) => text.trim())
  const lines = input.split('\n')

  const connections = new Map<number, number[]>()
  lines.forEach((line) => {
    const [from, toList] = line.split(' <-> ')
    connections.set(Number(from), toList.split(', ').map(Number))
  })

  const t0 = performance.now()

  const nodesConnectedTo0 = findGroup(0, connections)
  const part1 = nodesConnectedTo0.length

  let remainingNodes = Array.from(connections.keys())

  const removeGroup = (group: number[]) => {
    remainingNodes = remainingNodes.filter((node) => !group.includes(node))
  }

  removeGroup(nodesConnectedTo0)

  let groupsCount = 1
  while (remainingNodes.length) {
    groupsCount++
    const node = remainingNodes[0]
    const group = findGroup(node, connections)
    removeGroup(group)
  }

  const part2 = groupsCount

  const t1 = performance.now()

  return [part1, part2, t1 - t0]
}
