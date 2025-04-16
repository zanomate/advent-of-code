export function getCombinations<T>(list: T[], length: number = list.length): T[][] {
  let i: number
  let j: number
  let combs: T[][]
  let head: T[]
  let tailcombs: T[][]

  if (length > list.length || length <= 0) {
    return []
  }

  if (length == list.length) {
    return [list]
  }

  if (length == 1) {
    combs = []
    for (i = 0; i < list.length; i++) {
      combs.push([list[i]])
    }
    return combs
  }

  combs = []
  for (i = 0; i < list.length - length + 1; i++) {
    head = list.slice(i, i + 1)
    tailcombs = getCombinations(list.slice(i + 1), length - 1)
    for (j = 0; j < tailcombs.length; j++) {
      combs.push(head.concat(tailcombs[j]))
    }
  }
  return combs
}

export const getPermutations = <T>(list: T[]): T[][] => getCombinations(list, list.length)

export const factorial = (n: number): number => {
  if (n === 0 || n === 1) return 1
  return n * factorial(n - 1)
}
