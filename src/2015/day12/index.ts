import { readFile } from '../../utils/io'

export default async function () {
  const input = await readFile('./src/2015/day12/input.txt').then((text) => text.trim())

  let part1 = 0
  let queue1 = [JSON.parse(input)]
  while (queue1.length) {
    const json = queue1.shift()!
    if (typeof json === 'number') {
      part1 += json as number
    } else if (typeof json === 'string') {
      // do nothing
    } else {
      queue1.push(...Object.values(json))
    }
  }

  let part2 = 0
  let queue2 = [JSON.parse(input)]
  while (queue2.length) {
    const json = queue2.shift()!
    if (typeof json === 'number') {
      part2 += json as number
    } else if (typeof json === 'string') {
      // do nothing
    } else if (!Array.isArray(json) && Object.values(json).includes('red')) {
      // do nothing
    } else {
      queue2.push(...Object.values(json))
    }
  }

  console.log('Part 1:', part1)
  console.log('Part 2:', part2)
}
