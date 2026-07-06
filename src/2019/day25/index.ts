import { readFile } from '../../utils/io'
import { DaySolution } from '../../utils/type'
import { Intcode } from '../intcode/Intcode'

const OPPOSITE: Record<string, string> = {
  north: 'south',
  south: 'north',
  east: 'west',
  west: 'east',
}

// Items that trap, kill or otherwise break the droid if picked up.
const DANGEROUS = new Set([
  'infinite loop',
  'giant electromagnet',
  'molten lava',
  'escape pod',
  'photons',
])

type Room = { name: string; doors: string[]; items: string[] }

function parseRoom(output: string): Room {
  const name = output.match(/== (.+?) ==/)?.[1] ?? ''
  const doors: string[] = []
  const items: string[] = []
  let mode: 'doors' | 'items' | null = null
  for (const line of output.split('\n')) {
    if (line.startsWith('Doors here lead:')) mode = 'doors'
    else if (line.startsWith('Items here:') || line.startsWith('Items in your inventory:'))
      mode = 'items'
    else if (line.startsWith('- ')) {
      const value = line.slice(2)
      if (mode === 'doors') doors.push(value)
      else if (mode === 'items') items.push(value)
    } else if (line.trim() === '') mode = null
  }
  return { name, doors, items }
}

class Droid {
  private vm: Intcode
  constructor(program: number[]) {
    this.vm = new Intcode(program)
  }

  private readOutput(): string {
    this.vm.run()
    return this.vm
      .drainOutputs()
      .map((c) => String.fromCharCode(c))
      .join('')
  }

  start(): string {
    return this.readOutput()
  }

  command(cmd: string): string {
    this.vm.pushLine(cmd)
    return this.readOutput()
  }
}

function resolvePart1(program: number[]): string | null {
  const droid = new Droid(program)

  let pathToCheckpoint: string[] | null = null
  let floorDir: string | null = null
  const path: string[] = []
  const visited = new Set<string>()

  const explore = (output: string, cameFrom: string | null): void => {
    const room = parseRoom(output)

    if (room.name === 'Security Checkpoint') {
      pathToCheckpoint = [...path]
      floorDir = room.doors.find((d) => d !== cameFrom) ?? null
      return
    }
    if (visited.has(room.name)) return
    visited.add(room.name)

    for (const item of room.items) {
      if (!DANGEROUS.has(item)) droid.command(`take ${item}`)
    }

    for (const door of room.doors) {
      if (door === cameFrom) continue
      path.push(door)
      const next = droid.command(door)
      explore(next, OPPOSITE[door])
      droid.command(OPPOSITE[door])
      path.pop()
    }
  }

  explore(droid.start(), null)
  // Read through casts: TypeScript cannot see the mutations made inside `explore`.
  const checkpointPath = pathToCheckpoint as string[] | null
  const floor = floorDir as string | null
  if (!checkpointPath || !floor) return null

  // Walk to the checkpoint carrying every safe item, then drop them all.
  for (const dir of checkpointPath) droid.command(dir)
  const inventory = parseRoom(droid.command('inv')).items
  for (const item of inventory) droid.command(`drop ${item}`)

  // Brute-force every subset of items against the pressure-sensitive floor.
  for (let mask = 1; mask < 1 << inventory.length; mask++) {
    const subset = inventory.filter((_, i) => mask & (1 << i))
    for (const item of subset) droid.command(`take ${item}`)
    const result = droid.command(floor)
    const password = result.match(/typing (\d+) on the keypad/)?.[1]
    if (password) return password
    for (const item of subset) droid.command(`drop ${item}`)
  }
  return null
}

export default async function (inputFile: string): Promise<DaySolution> {
  const input = await readFile(inputFile)
  const program = Intcode.parse(input)

  const t0 = performance.now()

  // Part 2 of day 25 is awarded for free once every other star is collected.
  let part1 = resolvePart1(program)
  let part2 = null

  const t1 = performance.now()

  return [part1, part2, t1 - t0]
}
