import { readFile } from '../../utils/io'
import { DaySolution } from '../../utils/type'

type Component = [number, number]

interface Result {
  bridge: Component[]
  strength: number
}

function strongestBridge(start: number, components: Component[]): Result {
  if (!components.length) return { bridge: [], strength: 0 }

  let res: Result = { bridge: [], strength: 0 }

  components.forEach((c, i) => {
    if (c.includes(start)) {
      const otherPort = c[0] === start ? c[1] : c[0]
      const restOfComponents = components.toSpliced(i, 1)
      const strongestSubRes = strongestBridge(otherPort, restOfComponents)
      const candidateStrength = c[0] + c[1] + strongestSubRes.strength
      if (candidateStrength > res.strength) {
        res = {
          bridge: [c, ...strongestSubRes.bridge],
          strength: candidateStrength,
        }
      }
    }
  })

  return res
}

function strongestLongestBridge(start: number, components: Component[]): Result {
  if (!components.length) return { bridge: [], strength: 0 }

  let res: Result = { bridge: [], strength: 0 }

  components.forEach((c, i) => {
    if (c.includes(start)) {
      const otherPort = c[0] === start ? c[1] : c[0]
      const restOfComponents = components.toSpliced(i, 1)
      const strongestSubRes = strongestLongestBridge(otherPort, restOfComponents)
      const candidateBridge = [c, ...strongestSubRes.bridge]
      const candidateStrength = c[0] + c[1] + strongestSubRes.strength
      if (
        candidateBridge.length > res.bridge.length ||
        (candidateBridge.length === res.bridge.length && candidateStrength > res.strength)
      ) {
        res = {
          bridge: [c, ...strongestSubRes.bridge],
          strength: candidateStrength,
        }
      }
    }
  })

  return res
}

export default async function (inputFile: string): Promise<DaySolution> {
  const input = await readFile(inputFile).then((text) => text.trim())
  const components: Component[] = input.split('\n').map((line) => {
    const [p1, p2] = line.split('/')
    return [parseInt(p1), parseInt(p2)]
  })

  const t0 = performance.now()

  const bridge1 = strongestBridge(0, components)
  const part1 = bridge1.strength

  const bridge2 = strongestLongestBridge(0, components)
  const part2 = bridge2.strength

  const t1 = performance.now()

  return [part1, part2, t1 - t0]
}
