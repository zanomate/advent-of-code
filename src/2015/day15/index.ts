import { readFile } from '../../utils/io'

interface Ingredient {
  capacity: number
  durability: number
  flavor: number
  texture: number
  calories: number
}

const propertiesRegex = /(\w+): capacity (-?\d+), durability (-?\d+), flavor (-?\d+), texture (-?\d+), calories (-?\d+)/

function findCombinations(len: number, tot: number): number[][] {
  const results: number[][] = []
  if (len === 1) results.push([tot])
  else {
    for (let i = 0; i <= tot; i++) {
      findCombinations(len - 1, tot - i).forEach((combination) => {
        results.push([i, ...combination])
      })
    }
  }
  return results
}

export default async function () {
  const input = await readFile('./src/2015/day15/input.txt').then((text) => text.trim())
  const properties = new Map<string, Ingredient>()

  input.split('\n').forEach((line) => {
    const match = line.match(propertiesRegex)
    if (match === null) throw new Error('Invalid properties')
    properties.set(match[1], {
      capacity: parseInt(match[2]),
      durability: parseInt(match[3]),
      flavor: parseInt(match[4]),
      texture: parseInt(match[5]),
      calories: parseInt(match[6]),
    })
  })

  const ingredients = Array.from(properties.keys())

  const computeScore = (recipe: Record<string, number>): number => {
    const capacity = ingredients.reduce((tot, i) => tot + properties.get(i)!.capacity * recipe[i], 0)
    const durability = ingredients.reduce((tot, i) => tot + properties.get(i)!.durability * recipe[i], 0)
    const flavor = ingredients.reduce((tot, i) => tot + properties.get(i)!.flavor * recipe[i], 0)
    const texture = ingredients.reduce((tot, i) => tot + properties.get(i)!.texture * recipe[i], 0)

    return Math.max(0, capacity) * Math.max(0, durability) * Math.max(0, flavor) * Math.max(0, texture)
  }

  const computeCalories = (recipe: Record<string, number>): number =>
    ingredients.reduce((tot, i) => tot + properties.get(i)!.calories * recipe[i], 0)

  let bestScore1 = 0
  let bestScore2 = 0
  findCombinations(ingredients.length, 100).forEach((combination) => {
    const recipe = combination.reduce((map, num, i) => ({ ...map, [ingredients[i]]: num }), {})
    const score = computeScore(recipe)
    const calories = computeCalories(recipe)
    if (bestScore1 < score) bestScore1 = score
    if (calories === 500 && bestScore2 < score) bestScore2 = score
  })

  console.log('Part 1:', bestScore1)
  console.log('Part 2:', bestScore2)
}
