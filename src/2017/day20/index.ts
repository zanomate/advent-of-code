import { readFile } from '../../utils/io'
import { DaySolution } from '../../utils/type'

interface Vector {
  x: number
  y: number
  z: number
}

interface Particle {
  pos: Vector
  vel: Vector
  acc: Vector
}

export default async function (inputFile: string): Promise<DaySolution> {
  const input = await readFile(inputFile).then((text) => text.trim())
  const particles: Particle[] = input.split('\n').map((line) => {
    const [p, v, a] = line.split(', ')
    const [px, py, pz] = p.slice(3, -1).split(',')
    const [vx, vy, vz] = v.slice(3, -1).split(',')
    const [ax, ay, az] = a.slice(3, -1).split(',')
    return {
      pos: { x: Number(px), y: Number(py), z: Number(pz) },
      vel: { x: Number(vx), y: Number(vy), z: Number(vz) },
      acc: { x: Number(ax), y: Number(ay), z: Number(az) },
    }
  })

  const t0 = performance.now()

  let state: Particle[] = particles

  for (let i = 0; i < 5000; i++) {
    state = state.map(({ pos, vel, acc }) => {
      const newVel = { x: vel.x + acc.x, y: vel.y + acc.y, z: vel.z + acc.z }
      const newPos = { x: pos.x + newVel.x, y: pos.y + newVel.y, z: pos.z + newVel.z }
      return {
        pos: newPos,
        vel: newVel,
        acc,
      }
    })
  }

  let minDistance = Infinity
  let minDistanceIndex = -1
  state.forEach((state, index) => {
    const distance = Math.abs(state.pos.x) + Math.abs(state.pos.y) + Math.abs(state.pos.z)
    if (distance < minDistance) {
      minDistance = distance
      minDistanceIndex = index
    }
  })

  const part1 = minDistanceIndex

  state = particles

  for (let i = 0; i < 5000; i++) {
    const posIndexes: Record<string, number[]> = {}

    state = state.map(({ pos, vel, acc }, index) => {
      const newVel = { x: vel.x + acc.x, y: vel.y + acc.y, z: vel.z + acc.z }
      const newPos = { x: pos.x + newVel.x, y: pos.y + newVel.y, z: pos.z + newVel.z }
      const key = `${newPos.x}-${newPos.y}-${newPos.z}`
      posIndexes[key] = [...(posIndexes[key] || []), index]
      return {
        pos: newPos,
        vel: newVel,
        acc,
      }
    })

    let collisions = new Set<number>()
    Object.values(posIndexes).forEach((indexes) => {
      if (indexes.length > 1) indexes.forEach((index) => collisions.add(index))
    })

    state = state.filter((_, i) => !collisions.has(i))
  }

  const part2 = state.length

  const t1 = performance.now()

  return [part1, part2, t1 - t0]
}
