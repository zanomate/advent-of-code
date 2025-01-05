import { readFile } from '../../utils/io'

export default async function () {
  const input = await readFile('./src/2015/day3/input.txt').then((text) => text.trim())
  const moves: string[] = input.split('')

  const moveNext = (pos: [number, number], direction: string): [number, number] => {
    switch (direction) {
      case '^':
        return [pos[0], pos[1] - 1]
      case 'v':
        return [pos[0], pos[1] + 1]
      case '<':
        return [pos[0] - 1, pos[1]]
      case '>':
        return [pos[0] + 1, pos[1]]
      default:
        throw new Error('Invalid direction')
    }
  }

  const year1 = new Set<string>()
  let pos: [number, number] = [0, 0]
  year1.add(pos.join(','))

  const year2 = new Set<string>()
  let pos_1: [number, number] = [0, 0]
  let pos_2: [number, number] = [0, 0]
  year2.add(pos_1.join(','))

  moves.forEach((direction, i) => {
    pos = moveNext(pos, direction)
    year1.add(pos.join(','))

    if (i % 2 === 0) {
      pos_1 = moveNext(pos_1, direction)
      year2.add(pos_1.join(','))
    } else {
      pos_2 = moveNext(pos_2, direction)
      year2.add(pos_2.join(','))
    }
  })

  console.log('Part 1:', year1.size)
  console.log('Part 2:', year2.size)
}