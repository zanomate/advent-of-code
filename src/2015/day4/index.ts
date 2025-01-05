import { readFile } from '../../utils/io'

export default async function () {
  const input = await readFile('./src/2015/day4/input.txt').then((text) => text.trim())
  const strings: string[] = input.split('\n')

  let nice1 = 0
  let nice2 = 0
  strings.forEach((str) => {
    if (!str.match(/(ab|cd|pq|xy)/) && str.match(/[aeiou].*[aeiou].*[aeiou]/) && str.match(/(.)\1/)) nice1++
    if (str.match(/(.{2}).*\1/) && str.match(/(.).\1/)) nice2++
  })
  console.log('Part 1:', nice1)
  console.log('Part 2:', nice2)
}
