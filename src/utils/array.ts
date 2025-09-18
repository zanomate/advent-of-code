export function arr<T>(length: number, fillFn: (i: number) => T = (i) => i as T) {
  return Array.from({ length }, (_, i: number) => fillFn(i))
}

export function listOfNumbers(from: number, to: number): number[] {
  if (from > to) throw new Error('invalid range')
  return arr(to - from, (i) => from + i)
}

export function chunkArray<T>(array: T[], chunkSize: number): T[][] {
  const chunks: T[][] = []
  for (let i = 0; i < array.length; i += chunkSize) {
    chunks.push(array.slice(i, i + chunkSize))
  }
  return chunks
}
