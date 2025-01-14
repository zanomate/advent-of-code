import { Big } from 'big.js'
import { readFile } from '../../utils/io'

interface Machine {
  AX: number
  AY: number
  BX: number
  BY: number
  X: number
  Y: number
}

export default async function () {
  const input = await readFile('./src/2024/day13/input.txt').then((text) => text.trim())
  const machines: Machine[] = input.split('\n\n').map((machine) => {
    const [buttonA, buttonB, prize] = machine.split('\n')
    const matchButtonA = buttonA.match(/^Button A: X\+(\d+), Y\+(\d+)$/)
    const matchButtonB = buttonB.match(/^Button B: X\+(\d+), Y\+(\d+)$/)
    const matchPrize = prize.match(/^Prize: X=(\d+), Y=(\d+)$/)
    if (!matchButtonA || !matchButtonB || !matchPrize) throw new Error('Invalid input')
    const AX = parseInt(matchButtonA[1], 10)
    const AY = parseInt(matchButtonA[2], 10)
    const BX = parseInt(matchButtonB[1], 10)
    const BY = parseInt(matchButtonB[2], 10)
    const X = parseInt(matchPrize[1], 10)
    const Y = parseInt(matchPrize[2], 10)
    return { AX, AY, BX, BY, X, Y }
  })

  const t0 = performance.now()

  const computeMinTokens = (machines: Machine[]): number => {
    let res = 0
    machines.forEach(({ AX, AY, BX, BY, X, Y }) => {
      const B: number = new Big(X)
        .div(AX)
        .sub(new Big(Y).div(AY))
        .div(new Big(BX).div(AX).sub(new Big(BY).div(AY)))
        .toNumber()
      const A: number = new Big(X).sub(new Big(BX).mul(B)).div(AX).toNumber()

      if (A % 1 === 0 && B % 1 === 0) {
        res += A * 3 + B
      }
    })
    return res
  }

  const part1 = computeMinTokens(machines)

  const part2 = computeMinTokens(machines.map((m) => ({ ...m, X: m.X + 10000000000000, Y: m.Y + 10000000000000 })))

  const t1 = performance.now()

  console.log('Part 1:', part1)
  console.log('Part 2:', part2)
  console.log('Time (ms):', t1 - t0)
}
