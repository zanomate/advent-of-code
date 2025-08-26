/**
 * Every way to dispose all elements of a list of elements
 * @param elements
 * @example
 * * elements: [ 1, 2, 3 ]
 * * permutations: [
 * *   [ 1, 2, 3 ],
 * *   [ 1, 3, 2 ],
 * *   [ 2, 1, 3 ],
 * *   [ 2, 3, 1 ],
 * *   [ 3, 1, 2 ],
 * *   [ 3, 2, 1 ]
 * * ]
 */
export const getPermutations = <T>(elements: T[]): T[][] => {
  if (elements.length === 0) return []
  if (elements.length === 1) return [elements]

  const res: T[][] = []
  elements.forEach((head, index) => {
    const tail = elements.toSpliced(index, 1)
    getPermutations(tail).forEach((tailPermutation) => {
      res.push([head, ...tailPermutation])
    })
  })
  return res
}

/**
 * Every group of K elements choose from a list of length n. The order DOES NOT MATTER.
 * @param elements
 * @param k
 * @example
 * * k: 2
 * * elements: [ 1, 2, 3 ]
 * * permutations: [
 * *   [ 1, 2 ],
 * *   [ 2, 3 ],
 * *   [ 1, 3 ],
 * * ]
 */
export const getCombinations = <T>(k: number, elements: T[]): T[][] => {
  let res: T[][] = []
  elements.forEach((head, index) => {
    if (k === 1) res.push([head])
    else {
      const tail = elements.slice(index + 1)
      getCombinations(k - 1, tail).forEach((subCombination) => {
        res.push([head, ...subCombination])
      })
    }
  })
  return res
}

/**
 * Every way to choose k elements over a list of length n. The order MATTERS.
 * @param elements
 * @param k
 * @example
 * * k: 2
 * * elements: [ 1, 2, 3 ]
 * * permutations: [
 * *   [ 1, 2 ],
 * *   [ 2, 1 ],
 * *   [ 2, 3 ],
 * *   [ 3, 2 ],
 * *   [ 1, 3 ],
 * *   [ 3, 1 ],
 * * ]
 */
export const getDispositions = <T>(k: number, elements: T[]): T[][] => {
  return getCombinations(k, elements).flatMap(getPermutations)
}

// export function getCombinations<T>(list: T[], length: number = list.length): T[][] {
//   let i: number
//   let j: number
//   let combs: T[][]
//   let head: T[]
//   let tailcombs: T[][]
//
//   if (length > list.length || length <= 0) {
//     return []
//   }
//
//   if (length == list.length) {
//     return [list]
//   }
//
//   if (length == 1) {
//     combs = []
//     for (i = 0; i < list.length; i++) {
//       combs.push([list[i]])
//     }
//     return combs
//   }
//
//   combs = []
//   for (i = 0; i < list.length - length + 1; i++) {
//     head = list.slice(i, i + 1)
//     tailcombs = getCombinations(list.slice(i + 1), length - 1)
//     for (j = 0; j < tailcombs.length; j++) {
//       combs.push(head.concat(tailcombs[j]))
//     }
//   }
//   return combs
// }

// export const getPermutations = <T>(list: T[]): T[][] => getCombinations(list, list.length)

export const factorial = (n: number): number => {
  if (n === 0 || n === 1) return 1
  return n * factorial(n - 1)
}
