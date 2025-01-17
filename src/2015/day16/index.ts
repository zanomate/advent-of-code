import { readFile } from '../../utils/io'
import { DaySolution } from '../../utils/type'

interface Aunt {
  index: number
  details: Record<string, number>
}

interface Detection {
  detail: string
  value: number
}

const detections: Detection[] = [
  { detail: 'children', value: 3 },
  { detail: 'cats', value: 7 },
  { detail: 'samoyeds', value: 2 },
  { detail: 'pomeranians', value: 3 },
  { detail: 'akitas', value: 0 },
  { detail: 'vizslas', value: 0 },
  { detail: 'goldfish', value: 5 },
  { detail: 'trees', value: 3 },
  { detail: 'cars', value: 2 },
  { detail: 'perfumes', value: 1 },
]

export default async function (inputFile: string): Promise<DaySolution> {
  const input = await readFile(inputFile).then((text) => text.trim())

  const t0 = performance.now()

  const aunts: Aunt[] = input.split('\n').map((line) => {
    const firstSeparator = line.indexOf(':')
    const name = line.slice(0, firstSeparator)
    const description = line.slice(firstSeparator + 2)
    const nameMatch = name.match(/Sue (\d+)/)
    if (nameMatch === null) throw new Error('invalid line')
    const index = parseInt(nameMatch[1])
    const details = description.split(', ').reduce<Record<string, number>>((map, str) => {
      const match = str.match(/(\w+): (\d+)/)
      if (match === null) throw new Error('invalid line')
      return { ...map, [match[1]]: parseInt(match[2]) }
    }, {})
    return { index, details }
  })

  let search1 = [...aunts]
  for (let detection of detections) {
    search1 = search1.filter((aunt) => {
      const auntValue = aunt.details[detection.detail]
      return auntValue === undefined || auntValue === detection.value
    })
  }

  let search2 = [...aunts]
  for (let detection of detections) {
    search2 = search2.filter((aunt) => {
      const auntValue = aunt.details[detection.detail]
      if (auntValue === undefined) return true
      if (['cats', 'trees'].includes(detection.detail)) return auntValue > detection.value
      if (['pomeranians', 'goldfish'].includes(detection.detail)) return auntValue < detection.value
      return auntValue === detection.value
    })
  }

  const part1 = search1[0].index
  const part2 = search2[0].index

  const t1 = performance.now()

  return [part1, part2, t1 - t0]
}
