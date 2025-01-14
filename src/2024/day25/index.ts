import { readFile } from '../../utils/io'

type Lock = [number, number, number, number, number]
type Key = [number, number, number, number, number]

const fit = (lock: Lock, key: Key): boolean => {
  for (let i = 0; i < 5; i++) {
    if (lock[i] + key[i] > 5) return false
  }
  return true
}

export default async function () {
  const input = await readFile('./src/2024/day25/input.txt').then((text) => text.trim())
  const schemas = input.split('\n\n')

  const locks: Lock[] = []
  const keys: Key[] = []

  schemas.forEach((schema) => {
    const lines = schema.split('\n')
    if (lines[0] === '#####') {
      // Lock
      locks.push(
        Array.from({ length: 5 }).map(
          (_, i) => lines.slice(1).reduce((tot, line) => tot + (line[i] === '#' ? 1 : 0), 0) as number,
        ) as Lock,
      )
    } else {
      // Key
      keys.push(
        Array.from({ length: 5 }).map(
          (_, i) => lines.slice(0, -1).reduce((tot, line) => tot + (line[i] === '#' ? 1 : 0), 0) as number,
        ) as Key,
      )
    }
  })

  let fitCount = 0
  for (let lock of locks) {
    for (let key of keys) {
      if (fit(lock, key)) fitCount++
    }
  }

  console.log('Part 1:', fitCount)
}
