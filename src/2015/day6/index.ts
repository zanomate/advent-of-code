import { readFile } from '../../utils/io'

export default async function () {
  const input = await readFile('./src/2015/day6/input.txt').then((text) => text.trim())
  const instructions = input.split('\n')

  const grid1: boolean[][] = Array.from({ length: 1000 }, () => Array.from({ length: 1000 }, () => false))
  const grid2: number[][] = Array.from({ length: 1000 }, () => Array.from({ length: 1000 }, () => 0))

  const updateGrid1 = (
    startX: number,
    startY: number,
    endX: number,
    endY: number,
    updater: (prev: boolean) => boolean,
  ) => {
    for (let y = startY; y <= endY; y++) {
      for (let x = startX; x <= endX; x++) {
        grid1[y][x] = updater(grid1[y][x])
      }
    }
  }

  const updateGrid2 = (
    startX: number,
    startY: number,
    endX: number,
    endY: number,
    updater: (prev: number) => number,
  ) => {
    for (let y = startY; y <= endY; y++) {
      for (let x = startX; x <= endX; x++) {
        grid2[y][x] = updater(grid2[y][x])
      }
    }
  }

  instructions.forEach((instruction) => {
    const match = instruction.match(/(turn on|turn off|toggle) (\d+,\d+) through (\d+,\d+)/)
    if (!match) throw new Error('Invalid instruction')
    const action = match[1]
    const [startX, startY] = match[2].split(',').map((str) => parseInt(str))
    const [endX, endY] = match[3].split(',').map((str) => parseInt(str))

    switch (action) {
      case 'turn on':
        updateGrid1(startX, startY, endX, endY, () => true)
        updateGrid2(startX, startY, endX, endY, (prev) => prev + 1)
        break
      case 'turn off':
        updateGrid1(startX, startY, endX, endY, () => false)
        updateGrid2(startX, startY, endX, endY, (prev) => Math.max(0, prev - 1))
        break
      case 'toggle':
        updateGrid1(startX, startY, endX, endY, (prev) => !prev)
        updateGrid2(startX, startY, endX, endY, (prev) => prev + 2)
        break
    }
  })

  let lit1 = 0
  let lit2 = 0
  for (let y = 0; y < 1000; y++) {
    for (let x = 0; x < 1000; x++) {
      if (grid1[y][x]) lit1++
      if (grid2[y][x] > 0) lit2 += grid2[y][x]
    }
  }

  console.log('Part 1:', lit1)
  console.log('Part 2:', lit2)
}
