import { blue, printSolution, red } from './utils/print'
import { DaySolution } from './utils/type'
import { readNumericParameter, readStringParameter } from './utils/io'

export type Parameter = string | number

export const resolveDay = async (
  year: number,
  day: number,
  file: string,
  parameters: Parameter[],
): Promise<DaySolution> => {
  const solution = await import(`./${year}/day${day}`)
  return solution.default(`./src/${year}/day${day}/${file}.txt`, parameters)
}

export const resolve = async (args: string[]) => {
  try {
    const year = readNumericParameter('year', args[0])
    const day = readNumericParameter('day', args[1])
    const file = readStringParameter('file', args[2])
    const parameters = args.slice(3)
    console.log(blue(`Year ${year} Day ${day}`))
    const solution = await resolveDay(year, day, file, parameters)
    printSolution(solution)
  } catch (error) {
    if (error instanceof Error) {
      console.error(red(error.message))
      console.error(error.stack)
    } else throw error
  }
}
