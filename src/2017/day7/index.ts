import { readFile } from '../../utils/io'
import { DaySolution } from '../../utils/type'

interface Program {
  name: string
  weight: number
  childNames: string[]
  childrenWeight?: number
  totalWeight?: number
}

interface Correction {
  name: string
  weight: number
}

function areAllNumbersEqual(numbers: number[]): boolean {
  if (numbers.length <= 1) {
    return true
  }

  const firstNumber = numbers[0]
  return numbers.every((num) => num === firstNumber)
}

function findDifferentNumberIndex(numbers: number[]): { value: number; index: number } {
  if (numbers.length < 3) {
    throw new Error('array size must be at least 3 ')
  }

  const counts = new Map<number, { count: number; index: number }>()

  for (let i = 0; i < numbers.length; i++) {
    const num = numbers[i]
    if (counts.has(num)) {
      counts.get(num)!.count++
    } else {
      counts.set(num, { count: 1, index: i })
    }
  }

  for (const [num, data] of counts.entries()) {
    if (data.count === 1) {
      return { value: num, index: data.index }
    }
  }

  throw new Error('No different number found')
}

export default async function (inputFile: string): Promise<DaySolution> {
  const input = await readFile(inputFile).then((text) => text.trim())
  const lines = input.split('\n')

  const map = new Map<string, Program>()
  lines.forEach((line) => {
    const [node, childNamesString] = line.split(' -> ')
    const [name, weightString] = node.split(' ')
    const weight = parseInt(weightString.slice(1, -1))
    const childNames = childNamesString?.split(', ') || []
    map.set(name, { name, weight, childNames })
  })

  const t0 = performance.now()

  const someoneChild = new Set()
  Array.from(map.values()).forEach(({ childNames }) => {
    childNames.forEach((child) => {
      someoneChild.add(child)
    })
  })

  const rootName = Array.from(map.keys()).find((i) => !someoneChild.has(i))!
  const part1 = rootName

  const root = map.get(rootName)!

  const computeTotalWeight = (program: Program): number => {
    const childrenWeights = program.childNames.map((childName) => {
      const child = map.get(childName)!
      return computeTotalWeight(child)
    })

    program.childrenWeight = childrenWeights.reduce((tot, w) => tot + w, 0)
    program.totalWeight = program.weight + program.childrenWeight
    return program.totalWeight
  }

  computeTotalWeight(root)

  const findCorrection = (program: Program, expectedTotalWeight?: number): Correction | null => {
    const children = program.childNames.map((childName) => map.get(childName)!)

    if (children.length === 0) {
      if (expectedTotalWeight) {
        if (program.weight !== expectedTotalWeight) {
          return { name: program.name, weight: expectedTotalWeight }
        }
      }
    } else if (children.length === 1) {
      throw new Error(`can be both program ${program.name} or its only child`)
    } else {
      const childrenWeights = children.map((child) => child.totalWeight!)
      const areChildrenBalanced = areAllNumbersEqual(childrenWeights)
      if (areChildrenBalanced) {
        if (expectedTotalWeight) {
          const expectedWeight = expectedTotalWeight - program.childrenWeight!
          if (program.weight !== expectedWeight) {
            return { name: program.name, weight: expectedWeight }
          }
        }
      } else if (children.length === 2) {
        // can be each of the children
        const [c1, c2] = children
        return findCorrection(c1, c2.totalWeight!) || findCorrection(c2, c1.totalWeight!)
      } else {
        const { index } = findDifferentNumberIndex(childrenWeights)
        const child = children[index]
        const otherIndex = (index + 1) % children.length
        const otherWeight = children[otherIndex].totalWeight
        return findCorrection(child, otherWeight)
      }
    }

    return null
  }

  const correction = findCorrection(root)

  const part2 = correction!.weight

  const t1 = performance.now()

  return [part1, part2, t1 - t0]
}
