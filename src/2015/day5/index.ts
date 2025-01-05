import { readFile } from '../../utils/io'
import md5 from 'md5'

export default async function () {
  const input = await readFile('./src/2015/day4/input.txt').then((text) => text.trim())

  let i = 0
  let index_1: number | null = null
  let index_2: number | null = null
  while (index_1 === null || index_2 === null) {
    const key = `${input}${i}`
    const hash = md5(key)
    if (index_1 === null && hash.startsWith('00000')) {
      index_1 = i
    }
    if (index_2 === null && hash.startsWith('000000')) {
      index_2 = i
    }
    i++
  }

  console.log('Part 1:', index_1)
  console.log('Part 2:', index_2)
}
