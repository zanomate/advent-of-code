export const getCombinations = <T>(list: T[], length?: number): T[][] => {
  if (list.length === 1) return [list]
  return list.flatMap((item, i) => getCombinations(list.toSpliced(i, 1)).map((combination) => [item, ...combination]), length ? length - 1 : undefined)
}
