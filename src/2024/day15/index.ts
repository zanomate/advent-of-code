import { readFile } from '../../utils/io'
import { Dir, flipVertically } from '../../utils/space/Dir'
import { InputCell, Warehouse } from './model/Warehouse'

export default async function () {
  const input = await readFile('./src/2024/day15/input.txt').then((text) => text.trim())
  const [cellsInput, directionsInput] = input.split('\n\n')
  const cells: InputCell[][] = cellsInput.split('\n').map((row) => row.split('')) as InputCell[][]
  const directions: Dir[] = directionsInput.replace(/\n/g, '').split('') as Dir[]

  const t0 = performance.now()

  const wh1 = new Warehouse(cells, 1)
  for (let direction of directions) {
    // wh.print()
    // await readUserInput(`next: ${direction}`)
    const dir = flipVertically(direction)
    wh1.moveRobot(dir)
  }
  const part1 = wh1.computeAllDistances()

  const wh2 = new Warehouse(cells, 2)
  for (let direction of directions) {
    // wh.print()
    // await readUserInput(`next: ${direction}`)
    const dir = flipVertically(direction)
    wh2.moveRobot(dir)
  }
  const part2 = wh2.computeAllDistances()

  const t1 = performance.now()

  console.log('Part 1:', part1)
  console.log('Part 2:', part2)
  console.log('Time (ms):', t1 - t0)
}
