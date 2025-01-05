import { readFile } from '../../utils/io'

export default async function () {
  const input = await readFile('./src/2015/day10/input.txt').then((text) => text.trim())

  const lookAndSay = (input: string): string => {
    let i = 0
    let res = ''
    while (i < input.length) {
      const [segment] = input.slice(i).match(/^(.)\1*/)!
      res += `${segment.length}${segment[0]}`
      i += segment.length
    }
    return res
  }

  let res1 = input
  for (let i = 0; i < 40; i++) {
    res1 = lookAndSay(res1)
  }
  let res2 = res1
  for (let i = 0; i < 10; i++) {
    res2 = lookAndSay(res2)
  }

  console.log('Part 1:', res1.length)
  console.log('Part 2:', res2.length)
}
