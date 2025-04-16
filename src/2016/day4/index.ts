import { readFile } from '../../utils/io'
import { DaySolution } from '../../utils/type'

interface Room {
  name: string
  id: number
  checksum: string
}

const aCode = 'a'.charCodeAt(0)
const zCode = 'z'.charCodeAt(0)
const alphabetSize = zCode - aCode + 1

export default async function (inputFile: string): Promise<DaySolution> {
  const input = await readFile(inputFile).then((text) => text.trim())
  const rooms: Room[] = input.split('\n').map((line) => {
    const match = line.match(/^(.*)-(\d+)\[(\w+)]$/)
    if (match === null) throw new Error(`Invalid room`)
    const name = match[1]
    const id = parseInt(match[2])
    const checksum = match[3]
    return { name, id, checksum }
  })

  const t0 = performance.now()

  const validRooms = rooms.filter((room) => {
    const counts: Record<string, number> = {}
    room.name.split('').forEach((char) => {
      if (char === '-') return
      counts[char] = (counts[char] || 0) + 1
    })

    const sortedChars = Object.keys(counts).sort((a, b) => {
      const countDiff = counts[b] - counts[a]
      if (countDiff !== 0) return countDiff
      return a.localeCompare(b)
    })

    return room.checksum === sortedChars.slice(0, 5).join('')
  })

  const part1 = validRooms.reduce((tot, room) => tot + room.id, 0)

  const containingNorthPole = validRooms.find((room) => {
    const decryptedName = room.name
      .split('')
      .map((char) => {
        if (char === '-') return ' '
        return String.fromCharCode(((char.charCodeAt(0) - aCode + room.id) % alphabetSize) + aCode)
      })
      .join('')
    return decryptedName.includes('northpole')
  })

  const part2 = containingNorthPole?.id!

  const t1 = performance.now()

  return [part1, part2, t1 - t0]
}
