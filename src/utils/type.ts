export type PartSolution = string | number | null

export type DaySolution = [PartSolution, PartSolution, number] // [part1, part2, time]

export const isInEnum = (value: string, enumType: any): boolean => {
  return Object.values(enumType).includes(value)
}
