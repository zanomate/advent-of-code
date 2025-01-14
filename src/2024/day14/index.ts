import { readFile } from '../../utils/io'
import { Dir } from '../../utils/space/Dir'
import { Grid } from '../../utils/space/Grid'
import { Pos } from '../../utils/space/Pos'

interface Instruction {
  posX: number
  posY: number
  velX: number
  velY: number
}

export const WIDTH = 101
export const HEIGHT = 103

export class Area {
  readonly grid: Grid<number> = new Grid(WIDTH, HEIGHT, 0)

  increment(pos: Pos): void {
    this.grid.updateCell(pos, (pos) => pos + 1)
  }

  count(from: Pos, to: Pos): number {
    let count = 0
    for (let y = from.y; y < to.y; y++) {
      for (let x = from.x; x < to.x; x++) {
        count += this.grid.getCell(new Pos(x, y))!
      }
    }
    return count
  }

  countQuadrants(): number {
    const leftUpQuadrant = this.count(new Pos(0, 0), new Pos(Math.floor(WIDTH / 2), Math.floor(HEIGHT / 2)))
    const rightUpQuadrant = this.count(new Pos(Math.ceil(WIDTH / 2), 0), new Pos(WIDTH, Math.floor(HEIGHT / 2)))
    const leftDownQuadrant = this.count(new Pos(0, Math.ceil(HEIGHT / 2)), new Pos(Math.floor(WIDTH / 2), HEIGHT))
    const rightDownQuadrant = this.count(new Pos(Math.ceil(WIDTH / 2), Math.ceil(HEIGHT / 2)), new Pos(WIDTH, HEIGHT))
    return leftUpQuadrant * rightDownQuadrant * rightUpQuadrant * leftDownQuadrant
  }

  print(): void {
    this.grid.print((cell) => (cell === 0 ? '.' : 'X'))
  }

  check(): boolean {
    for (let pos of this.grid.positions) {
      if (
        Array.from({ length: 6 }).every((_, i) => {
          const pos1 = pos.shift(Dir.DOWN, i)
          const pos2 = pos.shift(Dir.DOWN, i).shift(Dir.RIGHT, 1)
          if (!this.grid.hasCell(pos1) || !this.grid.hasCell(pos2)) return false
          const cell1 = this.grid.getCell(pos1)
          const cell2 = this.grid.getCell(pos2)
          return cell1 !== null && cell1 > 0 && cell2 !== null && cell2 > 0
        })
      ) {
        return true
      }
    }
    return false
  }
}

export default async function () {
  const input = await readFile('./src/2024/day14/input.txt').then((text) => text.trim())
  const instructions: Instruction[] = input.split('\n').map((instruction) => {
    const match = instruction.match(/p=(.+),(.+) v=(.+),(.+)/) || []
    if (match === null) throw new Error('Invalid instruction')
    const posX = parseInt(match[1])
    const posY = parseInt(match[2])
    const velX = parseInt(match[3])
    const velY = parseInt(match[4])
    return { posX, posY, velX, velY }
  })

  const t0 = performance.now()

  const areaAfterSeconds = (seconds: number): Area => {
    const area = new Area()
    instructions.forEach((instruction) => {
      const endX = (((instruction.posX + instruction.velX * seconds) % WIDTH) + WIDTH) % WIDTH
      const endY = (((instruction.posY + instruction.velY * seconds) % HEIGHT) + HEIGHT) % HEIGHT
      area.increment(new Pos(endX, endY))
    })
    return area
  }

  const area1 = areaAfterSeconds(100)
  const part1 = area1.countQuadrants()

  let part2 = 0
  let i = 0
  while (true) {
    const area2 = areaAfterSeconds(i)
    if (area2.check()) {
      part2 = i
      // area2.print()
      break
    }
    i++
  }

  const t1 = performance.now()

  console.log('Part 1:', part1)
  console.log('Part 2:', part2)
  console.log('Time (ms):', t1 - t0)
}
