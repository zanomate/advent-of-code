import md5 from 'md5'
import { readFile } from '../../utils/io'
import { Dir, printCharFromDir } from '../../utils/space/Dir'
import { Pos } from '../../utils/space/Pos'
import { DaySolution } from '../../utils/type'

interface Step {
  dir: Dir
  pos: Pos
}

interface Attempt {
  pos: Pos
  path: Step[]
}

const getOpenDoors = (passcode: string, path: Step[]): Dir[] => {
  const stringPath = path.map((s) => printCharFromDir(s.dir)).join('')
  const hash = md5(`${passcode}${stringPath}`)
  let openDoors = []
  if (hash[0] > 'a') openDoors.push(Dir.UP)
  if (hash[1] > 'a') openDoors.push(Dir.DOWN)
  if (hash[2] > 'a') openDoors.push(Dir.LEFT)
  if (hash[3] > 'a') openDoors.push(Dir.RIGHT)
  return openDoors
}

export default async function (inputFile: string): Promise<DaySolution> {
  const passcode = await readFile(inputFile).then((text) => text.trim())

  const resolve = (): [string, number] => {
    const startPos = new Pos(0, 0)
    const endPos = new Pos(3, 3)

    let shortest: Step[] | null = null
    let longest: Step[] = []

    let queue: Attempt[] = [{ pos: startPos, path: [] }]
    while (queue.length) {
      const { pos, path } = queue.shift() as Attempt
      if (pos.equals(endPos)) {
        if (!shortest || path.length < shortest.length) shortest = path
        if (path.length > longest.length) longest = path
        continue
      }

      const doors = getOpenDoors(passcode, path)

      doors.forEach((dir) => {
        const newPos = pos.shift(dir)
        if (!newPos.isInBounds(0, 0, 4, 4)) return
        queue.push({ pos: newPos, path: [...path, { pos: newPos, dir }] })
      })
    }

    return [shortest ? shortest.map((s) => printCharFromDir(s.dir)).join('') : '', longest.length]
  }

  const t0 = performance.now()

  const [shortest, longest] = resolve()

  const part1 = shortest

  const part2 = longest

  const t1 = performance.now()

  return [part1, part2, t1 - t0]
}
