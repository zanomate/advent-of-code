import { readFile } from '../../utils/io'

export default async function () {
  const input = await readFile('./src/2015/day2/input.txt').then((text) => text.trim())
  const presents: number[][] = input.split('\n').map((line) => line.split('x').map((str) => parseInt(str)))

  let paper = 0
  let ribbon = 0
  presents.forEach((present) => {
    const sides = present.sort((a, b) => a - b)
    const areas = [sides[0] * sides[1], sides[1] * sides[2], sides[2] * sides[0]]
    paper += 2 * areas.reduce((sum, area) => sum + area, 0) + areas[0]
    ribbon += 2 * (sides[0] + sides[1]) + sides.reduce((mul, side) => mul * side, 1)
  })

  console.log('Part 1:', paper)
  console.log('Part 2:', ribbon)
}
