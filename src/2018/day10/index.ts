import { readFile } from '../../utils/io'
import { parseRegex } from '../../utils/regex'
import { Pos, p } from '../../utils/space/Pos'
import { DaySolution, PartSolution } from '../../utils/type'

interface Light {
  position: Pos
  velocity: Pos
}

function parseLight(line: string): Light {
  const [x, y, vx, vy] = parseRegex(
    line,
    /position=<\s*(-?\d+),\s*(-?\d+)> velocity=<\s*(-?\d+),\s*(-?\d+)>/,
  ).map(Number)
  return { position: p(x, y), velocity: p(vx, vy) }
}

function boundingAreaAt(lights: Light[], t: number): number {
  let minX = Infinity
  let maxX = -Infinity
  let minY = Infinity
  let maxY = -Infinity
  for (const { position, velocity } of lights) {
    const x = position.x + velocity.x * t
    const y = position.y + velocity.y * t
    if (x < minX) minX = x
    if (x > maxX) maxX = x
    if (y < minY) minY = y
    if (y > maxY) maxY = y
  }
  return (maxX - minX) * (maxY - minY)
}

// The lights converge to a message when the bounding box is smallest, then
// spread apart again. The area shrinks monotonically until that moment.
function findAlignmentTime(lights: Light[]): number {
  let t = 0
  while (boundingAreaAt(lights, t + 1) < boundingAreaAt(lights, t)) t++
  return t
}

function render(lights: Light[], t: number): string {
  const positions = lights.map(({ position, velocity }) =>
    p(position.x + velocity.x * t, position.y + velocity.y * t),
  )
  const minX = Math.min(...positions.map((pos) => pos.x))
  const maxX = Math.max(...positions.map((pos) => pos.x))
  const minY = Math.min(...positions.map((pos) => pos.y))
  const maxY = Math.max(...positions.map((pos) => pos.y))

  const filled = new Set(positions.map((pos) => pos.toString()))
  const rows: string[] = []
  for (let y = minY; y <= maxY; y++) {
    let row = ''
    for (let x = minX; x <= maxX; x++) {
      row += filled.has(p(x, y).toString()) ? '#' : '.'
    }
    rows.push(row)
  }
  return '\n' + rows.join('\n')
}

function resolvePart1(lights: Light[], time: number): PartSolution {
  return render(lights, time)
}

function resolvePart2(time: number): PartSolution {
  return time
}

export default async function (inputFile: string): Promise<DaySolution> {
  const input = await readFile(inputFile).then((text) => text.trim())
  const lights = input.split('\n').map(parseLight)

  const t0 = performance.now()

  const time = findAlignmentTime(lights)
  const part1 = resolvePart1(lights, time)
  const part2 = resolvePart2(time)

  const t1 = performance.now()

  return [part1, part2, t1 - t0]
}
