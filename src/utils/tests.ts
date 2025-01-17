import { resolveDay } from '../index'
import { PartSolution } from './type'

export const testDay = async (
  year: number,
  day: number,
  inputFile: string,
  part1: PartSolution | null,
  part2: PartSolution | null,
) => {
  const solution = await resolveDay(year, day, inputFile)
  if (part1 !== null) {
    expect(solution[0]).toEqual(part1)
  }
  if (part2 !== null) {
    expect(solution[1]).toEqual(part2)
  }
}
