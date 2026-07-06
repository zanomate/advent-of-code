import { readFile } from '../../utils/io'
import { DaySolution } from '../../utils/type'

const BASE = [0, 1, 0, -1]

function fftPhase(digits: number[]): number[] {
  const n = digits.length
  const out = new Array(n)
  for (let i = 0; i < n; i++) {
    let sum = 0
    for (let j = i; j < n; j++) {
      const pattern = BASE[Math.floor((j + 1) / (i + 1)) % 4]
      if (pattern !== 0) sum += digits[j] * pattern
    }
    out[i] = Math.abs(sum) % 10
  }
  return out
}

function resolvePart1(digits: number[]) {
  let signal = digits
  for (let phase = 0; phase < 100; phase++) signal = fftPhase(signal)
  return signal.slice(0, 8).join('')
}

function resolvePart2(digits: number[]) {
  const offset = Number(digits.slice(0, 7).join(''))
  const total = digits.length * 10000
  // The suffix-sum trick only holds when the offset lands in the second half.
  // Short sample signals with a large offset fall outside it; skip them.
  if (offset < total / 2 || offset >= total) return null
  // The offset lands in the second half, where each output digit is the
  // running suffix sum mod 10, independent of the earlier digits.
  const length = total - offset
  const tail = new Array(length)
  for (let i = 0; i < length; i++) tail[i] = digits[(offset + i) % digits.length]

  for (let phase = 0; phase < 100; phase++) {
    let running = 0
    for (let i = length - 1; i >= 0; i--) {
      running = (running + tail[i]) % 10
      tail[i] = running
    }
  }
  return tail.slice(0, 8).join('')
}

export default async function (inputFile: string): Promise<DaySolution> {
  const input = await readFile(inputFile)
  const digits = input.trim().split('').map(Number)

  const t0 = performance.now()

  let part1 = resolvePart1(digits)
  let part2 = resolvePart2(digits)

  const t1 = performance.now()

  return [part1, part2, t1 - t0]
}
