import { readFile } from '../../utils/io'
import { DaySolution } from '../../utils/type'

function decompressV1(str: string): string {
  let decompressed = ''
  let cursor = 0
  while (cursor < str.length) {
    const matchMarker = str.slice(cursor).match(/\((\d+)x(\d+)\)/)
    if (matchMarker !== null) {
      decompressed += str.slice(cursor, cursor + matchMarker.index!)
      const numOfChars = parseInt(matchMarker[1])
      const numOfRepetitions = parseInt(matchMarker[2])
      const segmentStart = cursor + matchMarker.index! + matchMarker[0].length
      const segmentEnd = segmentStart + numOfChars
      const segment = str.slice(segmentStart, segmentEnd)
      decompressed += segment.repeat(numOfRepetitions)
      cursor = segmentEnd
    } else {
      decompressed += str.slice(cursor)
      cursor = str.length
    }
  }
  return decompressed
}

function decompressV2Length(str: string): number {
  const matchMarker = str.match(/\((\d+)x(\d+)\)/)
  if (matchMarker === null) return str.length
  const charsBeforeMarker = matchMarker.index!
  const numOfChars = parseInt(matchMarker[1])
  const numOfRepetitions = parseInt(matchMarker[2])
  const segmentStart = charsBeforeMarker + matchMarker[0].length
  const segmentEnd = segmentStart + numOfChars
  const segment = str.slice(segmentStart, segmentEnd)
  const segmentLength = decompressV2Length(segment)
  const charsAfterSegment = decompressV2Length(str.slice(segmentEnd))
  return charsBeforeMarker + segmentLength * numOfRepetitions + charsAfterSegment
}

export default async function (inputFile: string): Promise<DaySolution> {
  const input = await readFile(inputFile).then((text) => text.trim())

  const t0 = performance.now()

  const part1 = decompressV1(input).length
  const part2 = decompressV2Length(input)

  const t1 = performance.now()

  return [part1, part2, t1 - t0]
}
