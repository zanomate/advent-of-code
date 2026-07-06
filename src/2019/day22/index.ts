import { readFile } from '../../utils/io'
import { DaySolution } from '../../utils/type'

/**
 * Each shuffle is a linear map on card positions modulo N: x -> a*x + b.
 * We track (a, b) so many shuffles compose cheaply.
 */
type Linear = { a: bigint; b: bigint }

function mod(x: bigint, n: bigint): bigint {
  return ((x % n) + n) % n
}

function parse(input: string, n: bigint): Linear {
  let a = 1n
  let b = 0n
  for (const line of input.trim().split('\n')) {
    if (line === 'deal into new stack') {
      a = mod(-a, n)
      b = mod(-b - 1n, n)
    } else if (line.startsWith('cut')) {
      const k = BigInt(line.match(/-?\d+/)![0])
      b = mod(b - k, n)
    } else if (line.startsWith('deal with increment')) {
      const k = BigInt(line.match(/\d+/)![0])
      a = mod(a * k, n)
      b = mod(b * k, n)
    }
  }
  return { a, b }
}

function power(base: bigint, exp: bigint, n: bigint): bigint {
  let result = 1n
  let b = mod(base, n)
  let e = exp
  while (e > 0n) {
    if (e & 1n) result = mod(result * b, n)
    b = mod(b * b, n)
    e >>= 1n
  }
  return result
}

function inverse(x: bigint, n: bigint): bigint {
  return power(x, n - 2n, n) // n is prime, Fermat's little theorem
}

function resolvePart1(input: string) {
  const n = 10007n
  const { a, b } = parse(input, n)
  return Number(mod(a * 2019n + b, n))
}

function resolvePart2(input: string) {
  const n = 119315717514047n
  const times = 101741582076661n
  const { a, b } = parse(input, n)

  // Composing the map with itself `times` yields A = a^times, B = b*(a^times - 1)/(a - 1).
  const A = power(a, times, n)
  const B = mod(((b * mod(A - 1n, n)) % n) * inverse(mod(a - 1n, n), n), n)

  // We want the original card that ends at position 2020: x = A^{-1}*(2020 - B).
  const position = 2020n
  return mod(inverse(A, n) * mod(position - B, n), n).toString()
}

export default async function (inputFile: string): Promise<DaySolution> {
  const input = await readFile(inputFile)

  const t0 = performance.now()

  let part1 = resolvePart1(input)
  let part2 = resolvePart2(input)

  const t1 = performance.now()

  return [part1, part2, t1 - t0]
}
