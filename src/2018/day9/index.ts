import { readFile } from '../../utils/io'
import { parseRegex } from '../../utils/regex'
import { DaySolution } from '../../utils/type'

interface Marble {
  value: number
  prev: Marble
  next: Marble
}

function playGame(players: number, lastMarble: number): number {
  const scores = new Array<number>(players).fill(0)

  const zero = { value: 0 } as Marble
  zero.prev = zero
  zero.next = zero
  let current = zero

  for (let marble = 1; marble <= lastMarble; marble++) {
    if (marble % 23 === 0) {
      for (let i = 0; i < 7; i++) current = current.prev
      const player = (marble - 1) % players
      scores[player] += marble + current.value
      current.prev.next = current.next
      current.next.prev = current.prev
      current = current.next
    } else {
      const a = current.next
      const inserted: Marble = { value: marble, prev: a, next: a.next }
      a.next.prev = inserted
      a.next = inserted
      current = inserted
    }
  }

  return Math.max(...scores)
}

function resolvePart1(players: number, lastMarble: number): number {
  return playGame(players, lastMarble)
}

function resolvePart2(players: number, lastMarble: number): number {
  return playGame(players, lastMarble * 100)
}

export default async function (inputFile: string): Promise<DaySolution> {
  const input = await readFile(inputFile).then((text) => text.trim())
  const [players, lastMarble] = parseRegex(
    input,
    /(\d+) players; last marble is worth (\d+) points/,
  ).map(Number)

  const t0 = performance.now()

  const part1 = resolvePart1(players, lastMarble)
  const part2 = resolvePart2(players, lastMarble)

  const t1 = performance.now()

  return [part1, part2, t1 - t0]
}
