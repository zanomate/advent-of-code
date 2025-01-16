import { printSolution, red } from './utils/print'
import { DaySolution } from './utils/type'

export const resolveDay = async (year: number, day: number, inputFile: string): Promise<DaySolution> => {
  const solution = await import(`./${year}/day${day}`)
  return solution.default(`./src/${year}/day${day}/${inputFile}.txt`)
}

export const resolve = async () => {
  try {
    const solution = await resolveDay(2024, 25, 'input')
    printSolution(solution)
  } catch (error) {
    if (error instanceof Error) {
      console.error(red(error.message))
      // console.error(error.stack)
    } else throw error
  }
}
