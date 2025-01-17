import { readFile } from '../../utils/io'
import { DaySolution } from '../../utils/type'

export default async function (inputFile: string): Promise<DaySolution> {
  const input = await readFile(inputFile).then((text) => text.trim())

  const t0 = performance.now()

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

  const part1 = res1.length
  const part2 = res2.length

  const t1 = performance.now()

  return [part1, part2, t1 - t0]
}
