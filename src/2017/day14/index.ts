import { readFile } from '../../utils/io'
import { Grid } from '../../utils/space/Grid'
import { DaySolution } from '../../utils/type'
import { knotHash } from '../day10'
import { Pos } from '../../utils/space/Pos'

function hashToBits(input: string) {
  const res: boolean[] = []
  input.split('').forEach((i) => {
    const binary = parseInt(i, 16).toString(2).padStart(4, '0')
    binary.split('').forEach((i) => {
      res.push(i === '1')
    })
  })
  return res
}

interface RegionFillInstance {
  pos: Pos
  region: number
}

export default async function (inputFile: string): Promise<DaySolution> {
  const input = await readFile(inputFile).then((text) => text.trim())

  const t0 = performance.now()

  const grid = new Grid<boolean>(128, 128, false)
  for (let row = 0; row < grid.height; row++) {
    const hash = knotHash(`${input}-${row}`)
    const bits = hashToBits(hash)
    grid.setRow(row, (i) => bits[i])
  }

  let count = 0
  grid.positions.forEach((pos) => {
    if (grid.getCell(pos)) count++
  })

  const part1 = count

  let regionCount = 0
  const regions = new Grid<number | null>(128, 128, null)

  const fillRegion = (instance: RegionFillInstance) => {
    const instances: RegionFillInstance[] = [instance]

    while (instances.length) {
      const { pos, region } = instances.shift()!
      if (regions.getCell(pos) !== null) continue
      regions.setCell(pos, region)
      pos.neighbours().forEach((neighbor) => {
        if (
          regions.hasCell(neighbor) &&
          grid.getCell(neighbor) &&
          regions.getCell(neighbor) === null
        ) {
          instances.push({ pos: neighbor, region })
        }
      })
    }
  }

  regions.positions.forEach((pos) => {
    if (grid.getCell(pos) && regions.getCell(pos) === null) {
      fillRegion({ pos, region: ++regionCount })
    }
  })

  const part2 = regionCount

  const t1 = performance.now()

  return [part1, part2, t1 - t0]
}
