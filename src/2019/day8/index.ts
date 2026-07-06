import { readFile } from '../../utils/io'
import { DaySolution } from '../../utils/type'

const WIDTH = 25
const HEIGHT = 6

function toLayers(pixels: number[]): number[][] {
  const size = WIDTH * HEIGHT
  const layers: number[][] = []
  for (let i = 0; i < pixels.length; i += size) layers.push(pixels.slice(i, i + size))
  return layers
}

function count(layer: number[], value: number): number {
  return layer.filter((v) => v === value).length
}

function resolvePart1(layers: number[][]) {
  const target = layers.reduce((best, layer) => (count(layer, 0) < count(best, 0) ? layer : best))
  return count(target, 1) * count(target, 2)
}

function resolvePart2(layers: number[][]) {
  const size = WIDTH * HEIGHT
  const image = Array.from({ length: size }, (_, i) => {
    for (const layer of layers) if (layer[i] !== 2) return layer[i]
    return 2
  })
  const rows: string[] = []
  for (let y = 0; y < HEIGHT; y++) {
    const row = image
      .slice(y * WIDTH, (y + 1) * WIDTH)
      .map((p) => (p === 1 ? '#' : ' '))
      .join('')
    rows.push(row)
  }
  const rendered = rows.join('\n')
  console.log(rendered)
  return rendered
}

export default async function (inputFile: string): Promise<DaySolution> {
  const input = await readFile(inputFile)
  const pixels = input.trim().split('').map(Number)
  const layers = toLayers(pixels)

  const t0 = performance.now()

  let part1 = resolvePart1(layers)
  let part2 = resolvePart2(layers)

  const t1 = performance.now()

  return [part1, part2, t1 - t0]
}
