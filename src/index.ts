import { blue, printSolution, red } from './utils/print'
import { DaySolution } from './utils/type'

export const resolveDay = async (
  year: number,
  day: number,
  inputFile: string,
): Promise<DaySolution> => {
  const solution = await import(`./${year}/day${day}`)
  return solution.default(`./src/${year}/day${day}/${inputFile}.txt`)
}

const YEAR = 2017
const DAY = 21
const FILE = 'sample'
// const FILE = 'input'

export const resolve = async () => {
  try {
    console.log(blue(`Year ${YEAR} Day ${DAY}`))
    const solution = await resolveDay(YEAR, DAY, FILE)
    printSolution(solution)
  } catch (error) {
    if (error instanceof Error) {
      console.error(red(error.message))
      console.error(error.stack)
    } else throw error
  }
}
