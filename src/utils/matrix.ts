export function rotateMatrixClockwise<T>(matrix: T[][]): T[][] {
  return matrix[0].map((_, col) => matrix.map((row) => row[col]).reverse())
}

export function flipMatrixX<T>(matrix: T[][]): T[][] {
  return [...matrix].reverse()
}

export function flipMatrixY<T>(matrix: T[][]): T[][] {
  return matrix.map((row) => [...row].reverse())
}
