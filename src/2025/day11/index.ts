import { readFile } from '../../utils/io'
import { DaySolution } from '../../utils/type'

function resolvePart1(links: Map<string, string[]>) {
  const memo = new Map<string, number>()

  function countPaths(name: string): number {
    if (name === 'out') return 1
    if (memo.has(name)) return memo.get(name)!

    const outputs = links.get(name)
    if (!outputs) return 0

    const paths = outputs.reduce((sum, output) => sum + countPaths(output), 0)
    memo.set(name, paths)
    return paths
  }

  return countPaths('you')
}

function resolvePart2(links: Map<string, string[]>) {
  const memo = new Map<string, number>()
  const k = (from: string, to: string) => `${from}-${to}`

  function countPaths(from: string, to: string): number {
    if (from === to) return 1
    const key = k(from, to)
    if (memo.has(key)) return memo.get(key)!

    const outputs = links.get(from)
    if (!outputs) return 0

    const paths = outputs.reduce((sum, output) => sum + countPaths(output, to), 0)
    memo.set(key, paths)
    return paths
  }

  const svr_fft = countPaths('svr', 'fft')
  const fft_dac = countPaths('fft', 'dac')
  const dac_out = countPaths('dac', 'out')
  const svr_dac = countPaths('svr', 'dac')
  const dac_fft = countPaths('dac', 'fft')
  const fft_out = countPaths('fft', 'out')
  return svr_fft * fft_dac * dac_out + svr_dac * dac_fft * fft_out
}

export default async function (inputFile: string): Promise<DaySolution> {
  const input = await readFile(inputFile)
  const links = new Map<string, string[]>()
  input.split('\n').forEach((line) => {
    const [name, outputsInput] = line.split(': ')
    const outputs = outputsInput.split(' ')
    links.set(name, outputs)
  })

  const t0 = performance.now()

  let part1 = resolvePart1(links)
  let part2 = resolvePart2(links)

  const t1 = performance.now()

  return [part1, part2, t1 - t0]
}
