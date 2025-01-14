import { readFile } from '../../utils/io'
import { Rule } from './model/Rule'
import { Update } from './model/Update'

export default async function () {
  const input = await readFile('./src/2024/day5/input.txt').then((text) => text.trim())
  const [rulesInput, updatesInput] = input.trim().split('\n\n')
  const rules = rulesInput.split('\n').map((str) => new Rule(str))
  const updates = updatesInput.split('\n').map((str) => new Update(str.split(',').map((num) => parseInt(num))))

  const t0 = performance.now()

  const part1 = updates.filter((update) => update.isCorrect(rules)).reduce((acc, update) => acc + update.middle, 0)
  const part2 = updates
    .filter((update) => !update.isCorrect(rules))
    .map((update) => update.fix(rules))
    .reduce((acc, update) => acc + update.middle, 0)

  const t1 = performance.now()

  console.log('Part 1:', part1)
  console.log('Part 2:', part2)
  console.log('Time (ms):', t1 - t0)
}
