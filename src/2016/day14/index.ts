import md5 from 'md5'
import { readFile } from '../../utils/io'
import { DaySolution } from '../../utils/type'

const computeHash = (salt: string, index: number) => md5(`${salt}${index}`)

const compute2016Hash = (salt: string, index: number) => {
  let hash = computeHash(salt, index)
  for (let i = 0; i < 2016; i++) {
    hash = md5(hash)
  }
  return hash
}

export default async function (inputFile: string): Promise<DaySolution> {
  const salt = await readFile(inputFile).then((text) => text.trim())

  const resolve = (hashFn: (salt: string, index: number) => string) => {
    const hashes: string[] = []

    const getHash = (index: number) => {
      while (index >= hashes.length) hashes.push(hashFn(salt, hashes.length))
      return hashes[index]
    }

    let foundKeys = 0
    let index = 0

    while (foundKeys < 64) {
      const hash = getHash(index)
      const match = hash.match(/(.)\1\1/)
      if (match) {
        let offset = 1
        while (offset <= 1000) {
          const nextHash = getHash(index + offset)
          if (nextHash.includes(match[1].repeat(5))) {
            foundKeys++
            break
          }
          offset++
        }
      }

      index++
    }

    return index - 1
  }

  const t0 = performance.now()

  const part1: number = resolve(computeHash)

  const part2: number = resolve(compute2016Hash)

  const t1 = performance.now()

  return [part1, part2, t1 - t0]
}
