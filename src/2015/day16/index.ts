import { readFile } from '../../utils/io'

interface Aunt {
  index: number
  details: Record<string, number>
}

interface Detection {
  detail: string
  value: number
}

export default async function () {
  const input = await readFile('./src/2015/day16/input.txt').then((text) => text.trim())
  const input2 = await readFile('./src/2015/day16/input2.txt').then((text) => text.trim())

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

  const detections: Detection[] = input2.split('\n').map((line) => {
    const match = line.match(/(\w+): (\d+)/)
    if (match === null) throw new Error('invalid line')
    return { detail: match[1], value: parseInt(match[2]) }
  })

  let search1 = [...aunts]
  for (let detection of detections) {
    search1 = search1.filter((aunt) => {
      const auntValue = aunt.details[detection.detail]
      return auntValue === undefined || auntValue === detection.value
    })
  }

  console.log('Part 1:', search1[0].index)

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

  console.log('Part 2:', search2[0].index)
}
