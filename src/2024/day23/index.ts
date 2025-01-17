import { readFile } from '../../utils/io'
import { DaySolution } from '../../utils/type'

export default async function (inputFile: string): Promise<DaySolution> {
  const input = await readFile(inputFile).then((text) => text.trim())
  const connections = input.split('\n')

  const t0 = performance.now()

  const nodeConnections = new Map<string, Set<string>>()
  connections.forEach((connection) => {
    const [from, to] = connection.split('-')

    if (!nodeConnections.has(from)) nodeConnections.set(from, new Set<string>())
    const fromConnections = nodeConnections.get(from)!
    fromConnections.add(to)
    if (!nodeConnections.has(to)) nodeConnections.set(to, new Set<string>())
    const toConnections = nodeConnections.get(to)!
    toConnections.add(from)
  })

  const nodes = Array.from(nodeConnections.keys())
  const clusters = new Set<string>()

  for (let n1 of nodes) {
    for (let n2 of nodes) {
      if (n1 === n2) continue
      for (let n3 of nodes) {
        if (n1 === n3 || n2 === n3) continue
        if (!n1.startsWith('t') && !n2.startsWith('t') && !n3.startsWith('t')) continue
        if (nodeConnections.get(n1)!.has(n2) && nodeConnections.get(n2)!.has(n3) && nodeConnections.get(n3)!.has(n1)) {
          clusters.add([n1, n2, n3].sort().join('-'))
        }
      }
    }
  }

  let biggestCluster: string[] = []

  for (let firstNode of nodes) {
    const cluster: string[] = [firstNode]
    for (let otherNode of nodeConnections.get(firstNode)!.values()) {
      const n2Cons = nodeConnections.get(otherNode)
      const isInCluster = cluster.every((n) => n2Cons?.has(n))
      if (isInCluster) cluster.push(otherNode)
    }
    if (cluster.length > biggestCluster.length) biggestCluster = cluster
  }

  const part1 = clusters.size
  const part2 = biggestCluster.sort().join(',')

  const t1 = performance.now()

  return [part1, part2, t1 - t0]
}
