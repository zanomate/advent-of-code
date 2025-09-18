import { readFile } from '../../utils/io'
import { DaySolution } from '../../utils/type'
import { parseRegex } from '../../utils/regex'
import { listOfNumbers } from '../../utils/array'

class Guard {
  id: number
  sleepCountPerMinute = new Map<number, number>()

  constructor(id: number) {
    this.id = id
  }

  incrementMinute(minute: number) {
    this.sleepCountPerMinute.set(minute, (this.sleepCountPerMinute.get(minute) ?? 0) + 1)
  }

  get totalSleep() {
    return Array.from(this.sleepCountPerMinute.values()).reduce((total, sleep) => total + sleep, 0)
  }

  findMostFrequentlyAsleepMinute(): { minute: number; count: number } {
    let maxCount = 0
    let maxCountMinute = -1
    Array.from(this.sleepCountPerMinute.keys()).forEach((minute) => {
      const count = this.sleepCountPerMinute.get(minute)!
      if (count > maxCount) {
        maxCount = count
        maxCountMinute = minute
      }
    })
    return { minute: maxCountMinute, count: maxCount }
  }
}

export default async function (inputFile: string): Promise<DaySolution> {
  const input = await readFile(inputFile).then((text) => text.trim())

  const guards = new Map<number, Guard>()
  let lastGuard: Guard = null as unknown as Guard
  let lastStart: number | null = null
  input
    .split('\n')
    .sort()
    .forEach((line) => {
      if (line.endsWith('begins shift')) {
        const [idStr] = parseRegex(line, /\[.+\] Guard #(\d+) begins shift/)
        const id = Number(idStr)
        if (guards.has(id)) lastGuard = guards.get(id)!
        else {
          lastGuard = new Guard(id)
          guards.set(id, lastGuard)
        }
      } else if (line.endsWith('falls asleep')) {
        const [minutes] = parseRegex(line, /\[.+(\d\d)\] falls asleep/)
        lastStart = Number(minutes)
      } else if (line.endsWith('wakes up')) {
        if (lastStart === null) throw new Error('missing start')
        const [minutes] = parseRegex(line, /\[.+(\d\d)\] wakes up/)
        const end = Number(minutes)
        listOfNumbers(lastStart, end).forEach((num) => {
          lastGuard.incrementMinute(num)
        })
      }
    })

  const t0 = performance.now()

  let maxSleep = 0
  let maxSleepGuard: Guard = null as unknown as Guard
  guards.forEach((guard) => {
    const totSleep = guard.totalSleep
    if (totSleep > maxSleep) {
      maxSleep = totSleep
      maxSleepGuard = guard
    }
  })

  const part1 = maxSleepGuard.id * maxSleepGuard.findMostFrequentlyAsleepMinute().minute

  const bestOfEach = Array.from(guards.values()).map((g) => ({
    id: g.id,
    ...g.findMostFrequentlyAsleepMinute(),
  }))
  let bestOfAll = { id: -1, minute: -1, count: 0 }
  bestOfEach.forEach((best) => {
    if (best.count > bestOfAll.count) {
      bestOfAll = best
    }
  })

  const part2 = bestOfAll.id * bestOfAll.minute
  const t1 = performance.now()

  return [part1, part2, t1 - t0]
}
