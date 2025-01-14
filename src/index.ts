import { red } from './utils/print'

const year = 2024
const day = 1

;(async () => {
  try {
    const solution = await import(`./${year}/day${day}`)
    await solution.default()
  } catch (error) {
    if (error instanceof Error) {
      console.error(red(error.message))
      // console.error(error.stack)
    } else throw error
  }
})()
