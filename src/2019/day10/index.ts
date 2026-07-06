import { readFile } from '../../utils/io'
import { p, Pos } from '../../utils/space/Pos'
import { DaySolution } from '../../utils/type'

function parseAsteroids(input: string): Pos[] {
  const asteroids: Pos[] = []
  input
    .trim()
    .split('\n')
    .forEach((line, y) => {
      line.split('').forEach((cell, x) => {
        if (cell === '#') asteroids.push(p(x, y))
      })
    })
  return asteroids
}

/** Angle measured clockwise from straight up, in [0, 2π). */
function angle(from: Pos, to: Pos): number {
  const dx = to.x - from.x
  const dy = to.y - from.y
  const a = Math.atan2(dx, -dy)
  return a < 0 ? a + 2 * Math.PI : a
}

function visibleCount(station: Pos, asteroids: Pos[]): number {
  const angles = new Set<number>()
  for (const other of asteroids) {
    if (other.equals(station)) continue
    angles.add(angle(station, other))
  }
  return angles.size
}

function bestStation(asteroids: Pos[]): { station: Pos; count: number } {
  let best = { station: asteroids[0], count: -1 }
  for (const station of asteroids) {
    const count = visibleCount(station, asteroids)
    if (count > best.count) best = { station, count }
  }
  return best
}

function resolvePart1(station: Pos, asteroids: Pos[]) {
  return visibleCount(station, asteroids)
}

function resolvePart2(station: Pos, asteroids: Pos[]) {
  // Group targets by angle; within each angle, sort by distance.
  const byAngle = new Map<number, Pos[]>()
  for (const other of asteroids) {
    if (other.equals(station)) continue
    const a = angle(station, other)
    if (!byAngle.has(a)) byAngle.set(a, [])
    byAngle.get(a)!.push(other)
  }
  const angles = [...byAngle.keys()].sort((x, y) => x - y)
  for (const a of angles) {
    byAngle.get(a)!.sort((x, y) => station.manhattanDistance(x) - station.manhattanDistance(y))
  }

  let vaporized = 0
  while (true) {
    let progressed = false
    for (const a of angles) {
      const targets = byAngle.get(a)!
      if (targets.length === 0) continue
      const hit = targets.shift()!
      progressed = true
      vaporized++
      if (vaporized === 200) return hit.x * 100 + hit.y
    }
    if (!progressed) return null
  }
}

export default async function (inputFile: string): Promise<DaySolution> {
  const input = await readFile(inputFile)
  const asteroids = parseAsteroids(input)
  const { station } = bestStation(asteroids)

  const t0 = performance.now()

  let part1 = resolvePart1(station, asteroids)
  let part2 = resolvePart2(station, asteroids)

  const t1 = performance.now()

  return [part1, part2, t1 - t0]
}
