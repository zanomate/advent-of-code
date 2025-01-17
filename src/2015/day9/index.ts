import { readFile } from '../../utils/io'
import { DaySolution } from '../../utils/type'

type Path = { cities: string[]; distance: number }

export default async function (inputFile: string): Promise<DaySolution> {
  const input = await readFile(inputFile).then((text) => text.trim())
  const lines = input.split('\n')

  const t0 = performance.now()

  const cities = new Set<string>()
  const distances: Record<string, Record<string, number>> = {}
  lines.forEach((line) => {
    const [path, distance] = line.split(' = ')
    const [from, to] = path.split(' to ')
    cities.add(from)
    cities.add(to)
    if (distances[from] === undefined) distances[from] = {}
    distances[from][to] = parseInt(distance)
    if (distances[to] === undefined) distances[to] = {}
    distances[to][from] = parseInt(distance)
  })

  const getShortestPath = (start: string | null, cities: string[]): [Path, Path] => {
    if (cities.length === 0)
      return [
        { cities: start ? [start] : [], distance: 0 },
        { cities: start ? [start] : [], distance: 0 },
      ]

    let shortestPath: Path = { cities: [], distance: Infinity }
    let longestPath: Path = { cities: [], distance: -Infinity }

    for (let i = 0; i < cities.length; i++) {
      const first = cities[i]
      const others = cities.toSpliced(i, 1)
      const distanceToFirst = start ? distances[start][first] : 0
      const [subShort, subLong] = getShortestPath(first, others)
      // new shortest
      const newShortestDistance = distanceToFirst + subShort.distance
      if (shortestPath.distance > newShortestDistance)
        shortestPath = { cities: [first, ...subShort.cities], distance: newShortestDistance }
      // new longest
      const newLongestDistance = distanceToFirst + subLong.distance
      if (longestPath.distance < newLongestDistance)
        longestPath = { cities: [first, ...subLong.cities], distance: newLongestDistance }
    }
    return [shortestPath, longestPath]
  }

  const [shortest, longest] = getShortestPath(null, Array.from(cities))

  const part1 = shortest.distance
  const part2 = longest.distance

  const t1 = performance.now()

  return [part1, part2, t1 - t0]
}
