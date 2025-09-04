import { readFile } from '../../utils/io'
import { HexDir } from '../../utils/space/Dir'
import { HexPos } from '../../utils/space/HexPos'
import { DaySolution } from '../../utils/type'

const ORIGIN = new HexPos(0, 0, 0)

export default async function (inputFile: string): Promise<DaySolution> {
  const input = await readFile(inputFile).then((text) => text.trim())
  const steps = input.split(',')

  const t0 = performance.now()

  let maxDistance = 0
  let pos = ORIGIN
  steps.forEach((step) => {
    switch (step) {
      case 'n':
        pos = pos.shift(HexDir.UP)
        break
      case 's':
        pos = pos.shift(HexDir.DOWN)
        break
      case 'nw':
        pos = pos.shift(HexDir.LEFT_UP)
        break
      case 'sw':
        pos = pos.shift(HexDir.LEFT_DOWN)
        break
      case 'ne':
        pos = pos.shift(HexDir.RIGHT_UP)
        break
      case 'se':
        pos = pos.shift(HexDir.RIGHT_DOWN)
        break
      default:
    }
    maxDistance = Math.max(maxDistance, pos.distance(ORIGIN))
  })

  const part1 = pos.distance(ORIGIN)

  const part2 = maxDistance

  const t1 = performance.now()

  return [part1, part2, t1 - t0]
}
