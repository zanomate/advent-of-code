import { readFile, readNumericParameter } from '../../utils/io'
import { DaySolution } from '../../utils/type'

type Rule = [string, string]

interface Step {
  name: string
  prerequisites: Set<string>
  timeLeft: number
  worker: string | null
}

function buildStep(name: string, baseTime: number): Step {
  return {
    name,
    prerequisites: new Set<string>(),
    timeLeft: baseTime + (name.charCodeAt(0) - 'A'.charCodeAt(0)) + 1,
    worker: null,
  }
}

function buildSteps(rules: Rule[], baseTime: number): Step[] {
  const map = new Map<string, Step>()
  rules.forEach((rule) => {
    const [before, after] = rule
    if (!map.has(before)) map.set(before, buildStep(before, baseTime))
    if (!map.has(after)) map.set(after, buildStep(after, baseTime))
    map.get(after)!.prerequisites.add(before)
  })
  return Array.from(map.values()).sort((a, b) => a.name.localeCompare(b.name))
}

function resolvePart1(rules: Rule[]): string {
  const steps = buildSteps(rules, 0)
  let res = ''

  while (steps.length) {
    for (let i = 0; i < steps.length; i++) {
      const { name, prerequisites } = steps[i]
      if (prerequisites.size === 0) {
        res += name
        steps.splice(i, 1)
        steps.forEach((step) => step.prerequisites.delete(name))
        break
      }
    }
  }

  return res
}

function resolvePart2(rules: Rule[], taskBaseTime: number, workersCount: number): number {
  const steps = buildSteps(rules, taskBaseTime)
  let works: (Step | null)[] = Array(workersCount).fill(null)
  let t = 0
  while (steps.length || works.some((w) => w !== null)) {
    let endedSteps: Step[] = []
    for (let i = 0; i < works.length; i++) {
      if (works[i] === null) {
        const stepIndex = steps.findIndex((step) => step.prerequisites.size === 0)
        if (stepIndex >= 0) {
          works[i] = steps.splice(stepIndex, 1)[0]
        }
      }
      if (works[i] !== null) {
        works[i]!.timeLeft -= 1
        if (works[i]!.timeLeft === 0) {
          endedSteps.push(works[i]!)
          works[i] = null
        }
      }
    }

    endedSteps.forEach((endedStep) => {
      steps.forEach((s) => s.prerequisites.delete(endedStep.name))
    })
    t++
  }

  return t
}

export default async function (inputFile: string, parameters: string[]): Promise<DaySolution> {
  const taskBaseTime = readNumericParameter('taskBaseTime', parameters[0])
  const workersCount = readNumericParameter('workersCount', parameters[1])

  const input = await readFile(inputFile).then((text) => text.trim())
  const rules: Rule[] = input.split('\n').map((line) => {
    const match = line.match(/Step ([A-Z]) must be finished before step ([A-Z]) can begin\./)
    return [match![1], match![2]]
  })

  const t0 = performance.now()

  const part1 = resolvePart1(rules)
  const part2 = resolvePart2(rules, taskBaseTime, workersCount)

  const t1 = performance.now()

  return [part1, part2, t1 - t0]
}
