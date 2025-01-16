import { DaySolution } from './type'

export const color = (text: string, colorCode: string) => {
  return `${colorCode}${text}\x1b[0m`
}

export const red = (text: string) => color(text, '\x1b[31m')
export const blue = (text: string) => color(text, '\x1b[34m')
export const green = (text: string) => color(text, '\x1b[32m')

export const printSolution = (solution: DaySolution) => {
  if (solution[0] !== null) console.log('Part 1:', green(String(solution[0])))
  if (solution[1] !== null) console.log('Part 2:', green(String(solution[1])))
  console.log('Time (ms):', blue(String(solution[2])))
}
