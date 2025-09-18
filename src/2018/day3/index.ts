import { readFile } from '../../utils/io'
import { DaySolution } from '../../utils/type'
import { parseRegex } from '../../utils/regex'
import { Grid } from '../../utils/space/Grid'
import { p, Pos } from '../../utils/space/Pos'

interface Claim {
  id: string
  left: number
  top: number
  width: number
  height: number
  intact: boolean
}

type Ids = string[]

function getPosListClaimedMultipleTimes(claimsMap: Map<string, Claim>): Pos[] {
  const claims = Array.from(claimsMap.values())
  const maxX = Math.max(...claims.map((c) => c.left + c.width))
  const maxY = Math.max(...claims.map((c) => c.top + c.height))
  const grid = new Grid<Ids>(maxX, maxY, [])

  claims.forEach((claim) => {
    const topLeft = p(claim.left, claim.top)
    const bottomRight = topLeft.sum(p(claim.width, claim.height))
    grid.setPortion(topLeft, bottomRight, (_, prev) => {
      if (prev.length) {
        if (prev.length === 1) claimsMap.get(prev[0])!.intact = false
        claim.intact = false
      }
      return [...prev, claim.id]
    })
  })

  return grid.positions.filter((pos) => grid.getCell(pos)!.length > 1)
}

export default async function (inputFile: string): Promise<DaySolution> {
  const input = await readFile(inputFile).then((text) => text.trim())
  const claimsMap: Map<string, Claim> = input.split('\n').reduce((map, line) => {
    const [id, left, top, width, height] = parseRegex(line, /#(\d+) @ (\d+),(\d+): (\d+)x(\d+)/)
    map.set(id, {
      id,
      left: Number(left),
      top: Number(top),
      width: Number(width),
      height: Number(height),
      intact: true,
    })
    return map
  }, new Map<string, Claim>())

  const t0 = performance.now()

  const posList = getPosListClaimedMultipleTimes(claimsMap)

  const part1 = posList.length

  const intactClaim = Array.from(claimsMap.values()).find((c) => c.intact)

  const part2 = intactClaim!.id
  const t1 = performance.now()

  return [part1, part2, t1 - t0]
}
