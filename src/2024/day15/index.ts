import { readFile } from '../../utils/io'
import { Dir, flipVertically } from '../../utils/space/Dir'
import { DaySolution } from '../../utils/type'
import { InputCell, Warehouse } from './model/Warehouse'

export default async function (inputFile: string): Promise<DaySolution> {
  const input = await readFile(inputFile).then((text) => text.trim())
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

  return [part1, part2, t1 - t0]
}
