export const sum = (numbers: number[]): number => {
  return numbers.reduce((acc, curr) => acc + curr, 0)
}

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

export const factorial = (n: number): number => {
  if (n === 0 || n === 1) return 1
  return n * factorial(n - 1)
}

export const isPrime = (n: number) => {
  if (n <= 1) return false
  if (n <= 3) return true
  if (n % 2 === 0 || n % 3 === 0) return false

  for (let i = 5; i * i <= n; i += 6) {
    if (n % i === 0 || n % (i + 2) === 0) return false
  }
  return true
}
