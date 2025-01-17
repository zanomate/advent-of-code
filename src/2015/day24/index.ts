import { readFile } from '../../utils/io'
import { DaySolution } from '../../utils/type'

type Group = number[]

function getGroups(packages: number[], weight: number, len: number): [number, Group[]] {
  if (packages.length === 0) throw new Error('no solution')
  if (packages.length === 1) {
    if (packages[0] === weight) return [1, [packages]]
    return [Infinity, []]
  }

  let maxLen = len
  let groups: Group[] = []

  packages.forEach((pkg, i) => {
    if (pkg === weight) {
      if (maxLen === null || maxLen > 1) {
        maxLen = 1
        groups = [[pkg]]
      } else {
        groups.push([pkg])
      }
    }
    if (pkg < weight && maxLen > 1) {
      const [subMaxLen, subGroups] = getGroups(packages.toSpliced(i, 1), weight - pkg, maxLen - 1)
      if (maxLen === null || maxLen > 1 + subMaxLen) {
        maxLen = 1 + subMaxLen
        groups = subGroups.map((s) => [pkg, ...s])
      } else {
        groups.push(...subGroups.map((s) => [pkg, ...s]))
      }
    }
  })

  return [maxLen, groups]
}

export default async function (inputFile: string): Promise<DaySolution> {
  const input = await readFile(inputFile).then((text) => text.trim())
  const packages: number[] = input
    .split('\n')
    .map((str) => parseInt(str))
    .reverse()

  const t0 = performance.now()

  const totalWeight = packages.reduce((tot, pkg) => tot + pkg, 0)

  const groupWeightPt1 = totalWeight / 3
  const [, groupsPt1] = getGroups(packages, groupWeightPt1, Infinity)

  let lowestQEPt1 = Infinity
  groupsPt1.forEach((group) => {
    const qe = group.reduce((tot, pkg) => tot * pkg, 1)
    if (lowestQEPt1 > qe) lowestQEPt1 = qe
  })

  const groupWeightPt2 = totalWeight / 4
  const [, groupsPt2] = getGroups(packages, groupWeightPt2, Infinity)

  let lowestQEPt2 = Infinity
  groupsPt2.forEach((group) => {
    const qe = group.reduce((tot, pkg) => tot * pkg, 1)
    if (lowestQEPt2 > qe) lowestQEPt2 = qe
  })

  const t1 = performance.now()

  return [lowestQEPt1, lowestQEPt2, t1 - t0]
}
