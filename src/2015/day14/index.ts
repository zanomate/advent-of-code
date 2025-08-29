import { readFile } from '../../utils/io'
import { DaySolution } from '../../utils/type'

interface Info {
  speed: number
  duration: number
  pause: number
}

const SECONDS_LIMIT = 2503

export default async function (inputFile: string): Promise<DaySolution> {
  const input = await readFile(inputFile).then((text) => text.trim())

  const t0 = performance.now()

  const reindeers: Record<string, { speed: number; duration: number; pause: number }> = {}
  input.split('\n').map((line) => {
    const match = line.match(
      /(\w+) can fly (\d+) km\/s for (\d+) seconds, but then must rest for (\d+) seconds./,
    )
    if (match === null) throw new Error('invalid line')
    reindeers[match[1]] = {
      speed: parseInt(match[2]),
      duration: parseInt(match[3]),
      pause: parseInt(match[4]),
    }
  })

  const getKm = (info: Info, limit: number): number => {
    const flySecs = Math.floor(limit / (info.duration + info.pause)) * info.duration
    const lastReprise = Math.min(limit % (info.duration + info.pause), info.duration)
    return (flySecs + lastReprise) * info.speed
  }

  let bestDistance = 0
  Object.keys(reindeers).forEach((name) => {
    const info = reindeers[name]
    const distance = getKm(info, SECONDS_LIMIT)
    if (bestDistance < distance) bestDistance = distance
  })

  const names = Object.keys(reindeers)
  const kms = names.reduce<Record<string, number>>((map, name) => ({ ...map, [name]: 0 }), {})
  const scores = names.reduce<Record<string, number>>((map, name) => ({ ...map, [name]: 0 }), {})

  for (let limit = 1; limit <= SECONDS_LIMIT; limit++) {
    let maxKm = 0
    for (let name of names) {
      const info = reindeers[name]
      const km = getKm(info, limit)
      kms[name] = km
      maxKm = Math.max(maxKm, km)
    }
    const winningNames = names.filter((name) => kms[name] === maxKm)
    winningNames.forEach((name) => (scores[name] = scores[name] + 1))
  }

  let highScore = Math.max(...Object.values(scores))

  const t1 = performance.now()

  return [bestDistance, highScore, t1 - t0]
}
